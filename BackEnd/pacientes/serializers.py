from rest_framework import serializers
from .models import Paciente, ContactoEmergencia
from triage.models import SesionTriage
from datetime import date
import re

class SesionTriageSerializer(serializers.ModelSerializer):
    """Serializer básico para sesiones de triage"""
    class Meta:
        model = SesionTriage
        fields = ['id', 'fecha_inicio', 'fecha_fin', 'nivel_triage', 'completado']

class ContactoEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoEmergencia
        exclude = ('paciente',)
    
        extra_kwargs = {
            'segundo_nombre': {'required': False},
            'segundo_apellido': {'required': False},
        }
        
    def validate(self, data):
        
        # Para actualizaciones parciales (PATCH), obtener los datos existentes
        if self.instance is not None:
            # Combinar los datos existentes con los nuevos datos
            instance_data = {
                'primer_nombre': getattr(self.instance, 'primer_nombre', None),
                'segundo_nombre': getattr(self.instance, 'segundo_nombre', None),
                'primer_apellido': getattr(self.instance, 'primer_apellido', None),
                'segundo_apellido': getattr(self.instance, 'segundo_apellido', None)
            }
            # Filtrar campos None
            instance_data = {k: v for k, v in instance_data.items() if v is not None}
            # Actualizar con los nuevos datos
            instance_data.update(data)
            validation_data = instance_data
        else:
            validation_data = data
            
        nombre_completo = []
        for field in ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']:
            # Verificar si el campo tiene un valor, ya sea en los datos nuevos o existentes
            if validation_data.get(field):
                # Eliminar espacios extras y dividir en palabras
                nombres = [nombre.strip() for nombre in validation_data[field].split() if nombre.strip()]
                
                # Verificar que haya al menos una palabra
                if not nombres:
                    raise serializers.ValidationError({field: "Este campo no puede estar vacío."})
                
                # Verificar que cada palabra tenga al menos 2 caracteres
                for nombre in nombres:
                    if len(nombre) < 2:
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' del campo {field} es demasiado corta. Debe tener al menos 2 caracteres."
                        })
                    elif len(nombre) > 30:
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' del campo {field} es demasiado larga. Debe tener como máximo 30 caracteres."
                        })
                    
                # Verificar que cada nombre tenga 1 o 2 palabras
                if len(nombres) not in [1, 2]:
                    raise serializers.ValidationError(
                        f"El campo '{field}' debe contener exactamente una o dos palabras, no {len(nombres)}."
                    )

                # Verificar que solo contenga letras y espacios
                for nombre in nombres:
                    if not nombre.replace('-', '').replace("'", '').isalpha():
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' contiene caracteres no permitidos. Solo se permiten letras, guiones y apóstrofes."
                        })
                        
                # Actualizar el campo con las palabras normalizadas
                data[field] = ' '.join(nombres)
                nombre_completo.extend(nombres)
        
        campos = {
            'primer_nombre': data.get('primer_nombre', ''),
            'segundo_nombre': data.get('segundo_nombre', ''),
            'primer_apellido': data.get('primer_apellido', ''),
            'segundo_apellido': data.get('segundo_apellido', ''),
        }

        for campo1, valor1 in campos.items():
            for campo2, valor2 in campos.items():
                if campo1 == campo2:
                    continue  # No comparar el mismo campo consigo mismo
                # Permitir que los dos apellidos sean iguales
                if {campo1, campo2} == {'primer_apellido', 'segundo_apellido'}:
                    continue
                # Si son iguales y no están vacíos → error
                if valor1 and valor2 and valor1 == valor2:
                    raise serializers.ValidationError(
                        f"Los campos '{campo1}' y '{campo2}' no pueden contener el mismo valor: '{valor1}'."
                    )
        
        # Validar que el nombre completo tenga al menos 3 palabras
        if len(nombre_completo) < 3:
            raise serializers.ValidationError(
                "El nombre completo debe tener al menos 3 palabras entre nombres y apellidos."
            )
            
        # validar numero prefijo_telefonico. Debe tener: + y al menos un numero
        if 'prefijo_telefonico' in data:
            if not re.match(r'^\+\d+$', data['prefijo_telefonico']):
                raise serializers.ValidationError({"prefijo_telefonico": "El prefijo telefónico debe comenzar con '+' y tener al menos un número."})

        # Validar telefono. Debe tener entre 7 y 10 dígitos
        if 'telefono' in data:
            if not re.match(r'^\d{7,10}$', data['telefono']):
                raise serializers.ValidationError({"telefono": "El número de teléfono debe tener entre 7 y 10 dígitos."})

        # Validar que relacion_parentesco solo contenga texto
        if 'relacion_parentesco' in data:
            relacion = data['relacion_parentesco'].strip()
            if not relacion:
                raise serializers.ValidationError({"relacion_parentesco": "Este campo no puede estar vacío."})
            if not all(c.isalpha() or c.isspace() for c in relacion):
                raise serializers.ValidationError({"relacion_parentesco": "La relación de parentesco solo puede contener letras y espacios."})
            if len(relacion) < 2:
                raise serializers.ValidationError({"relacion_parentesco": "La relación de parentesco debe tener al menos 2 caracteres."})
            if len(relacion) > 50:
                raise serializers.ValidationError({"relacion_parentesco": "La relación de parentesco no puede tener más de 50 caracteres."})
            
            data['relacion_parentesco'] = relacion
            
        return data

class PacienteSerializer(serializers.ModelSerializer):
    contacto_emergencia = ContactoEmergenciaSerializer(required=True, write_only=True)
    edad = serializers.ReadOnlyField()  # Lee directamente la propiedad edad del modelo
    sesiones_triage = SesionTriageSerializer(many=True, read_only=True)  # Agregar sesiones de triage

    class Meta:
        model = Paciente
        fields = '__all__'

    # Método para crear un paciente y su contacto de emergencia
    def create(self, validated_data):
        contacto_data = validated_data.pop('contacto_emergencia')
        paciente = Paciente.objects.create(**validated_data)
        ContactoEmergencia.objects.create(paciente=paciente, **contacto_data)
        return paciente

    # Este método permite personalizar la representación del paciente
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Obtener el contacto de emergencia de forma segura
        try:
            contacto = instance.contacto_emergencia.first()
            if contacto:
                representation['contacto_emergencia'] = ContactoEmergenciaSerializer(contacto).data
            else:
                representation['contacto_emergencia'] = None
        except Exception:
            representation['contacto_emergencia'] = None
            
        return representation
    
    def validate(self, data):
        # Para actualizaciones parciales (PATCH), obtener los datos existentes
        if self.instance is not None:
            # Combinar los datos existentes con los nuevos datos
            instance_data = {
                'primer_nombre': getattr(self.instance, 'primer_nombre', None),
                'segundo_nombre': getattr(self.instance, 'segundo_nombre', None),
                'primer_apellido': getattr(self.instance, 'primer_apellido', None),
                'segundo_apellido': getattr(self.instance, 'segundo_apellido', None)
            }
            # Filtrar campos None
            instance_data = {k: v for k, v in instance_data.items() if v is not None}
            # Actualizar con los nuevos datos
            instance_data.update(data)
            validation_data = instance_data
        else:
            validation_data = data

        # Validar que el contacto de emergencia tenga información diferente al paciente
        if 'contacto_emergencia' in validation_data:
            contacto_data = validation_data['contacto_emergencia']
            
            # Comparar datos del paciente y contacto de emergencia
            fields_to_compare = ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']
            
            # Verificar si todos los nombres son iguales
            all_names_match = all(
                data.get(field) == contacto_data.get(field)
                for field in fields_to_compare
                if field in data and field in contacto_data
            )
            
            if all_names_match:
                raise serializers.ValidationError({
                    "contacto_emergencia": "El contacto de emergencia no puede tener el mismo nombre completo que el paciente."
                })
            
            # Verificar si el teléfono es el mismo
            if (data.get('prefijo_telefonico') == contacto_data.get('prefijo_telefonico') and 
                data.get('telefono') == contacto_data.get('telefono')):
                raise serializers.ValidationError({
                    "contacto_emergencia": "El contacto de emergencia no puede tener el mismo número telefónico que el paciente."
                })

        # Obtener todas las palabras del nombre completo
        nombre_completo = []
        for field in ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']:
            # Verificar si el campo tiene un valor, ya sea en los datos nuevos o existentes
            if validation_data.get(field):
                # Eliminar espacios extras y dividir en palabras
                nombres = [nombre.strip() for nombre in validation_data[field].split() if nombre.strip()]
                
                # Verificar que haya al menos una palabra
                if not nombres:
                    raise serializers.ValidationError({field: "Este campo no puede estar vacío."})
                
                # Verificar que cada palabra tenga al menos 2 caracteres
                for nombre in nombres:
                    if len(nombre) < 2:
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' del campo {field} es demasiado corta. Debe tener al menos 2 caracteres."
                        })
                    elif len(nombre) > 30:
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' del campo {field} es demasiado larga. Debe tener como máximo 30 caracteres."
                        })
                    
                # Verificar que cada nombre tenga solo una palabra
                if len(nombres) not in [1, 2]:
                    raise serializers.ValidationError(
                        f"El campo '{field}' debe contener exactamente una o dos palabras, no {len(nombres)}."
                    )

                # Verificar que solo contenga letras y espacios
                for nombre in nombres:
                    if not nombre.replace('-', '').replace("'", '').isalpha():
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' contiene caracteres no permitidos. Solo se permiten letras, guiones y apóstrofes."
                        })
                        
                # Actualizar el campo con las palabras normalizadas
                if field in data:  # Solo actualizar si el campo está en los datos nuevos
                    data[field] = ' '.join(nombres)
                nombre_completo.extend(nombres)
        
        # Validar que el nombre completo tenga al menos 3 palabras
        if len(nombre_completo) < 3:
            raise serializers.ValidationError(
                "El nombre completo debe tener al menos 3 palabras entre nombres y apellidos."
            )
    
        campos = {
            'primer_nombre': data.get('primer_nombre', ''),
            'segundo_nombre': data.get('segundo_nombre', ''),
            'primer_apellido': data.get('primer_apellido', ''),
            'segundo_apellido': data.get('segundo_apellido', ''),
        }

        for campo1, valor1 in campos.items():
            for campo2, valor2 in campos.items():
                if campo1 == campo2:
                    continue  # No comparar el mismo campo consigo mismo
                # Permitir que los dos apellidos sean iguales
                if {campo1, campo2} == {'primer_apellido', 'segundo_apellido'}:
                    continue
                # Si son iguales y no están vacíos → error
                if valor1 and valor2 and valor1 == valor2:
                    raise serializers.ValidationError(
                        f"Los campos '{campo1}' y '{campo2}' no pueden contener el mismo valor: '{valor1}'."
                    )
        
        # validar numero prefijo_telefonico. Debe tener: + y al menos un numero
        if 'prefijo_telefonico' in data:
            if not re.match(r'^\+\d+$', data['prefijo_telefonico']):
                raise serializers.ValidationError({"prefijo_telefonico": "El prefijo telefónico debe comenzar con '+' y tener al menos un número."})

        # Validar telefono. Debe tener entre 7 y 10 dígitos
        if 'telefono' in data:
            if not re.match(r'^\d{7,10}$', data['telefono']):
                raise serializers.ValidationError({"telefono": "El número de teléfono debe tener entre 7 y 10 dígitos."})

        # Si tiene seguro médico, validar el campo correspondiente
        if 'tiene_seguro_medico' in data and data['tiene_seguro_medico']:
            if 'nombre_seguro_medico' not in data or not data['nombre_seguro_medico']:
                raise serializers.ValidationError({"nombre_seguro_medico": "Este campo es obligatorio si tiene seguro médico."})

        # Validar fecha de nacimiento
        if 'fecha_nacimiento' in data:
            fecha_nacimiento = data['fecha_nacimiento']
            hoy = date.today()
            fecha_minima = date(1900, 1, 1)
            
            if fecha_nacimiento >= hoy:
                raise serializers.ValidationError({"fecha_nacimiento": "La fecha de nacimiento debe ser anterior a hoy."})
            
            if fecha_nacimiento < fecha_minima:
                raise serializers.ValidationError({"fecha_nacimiento": "La fecha de nacimiento no puede ser anterior al año 1900."})

        return data