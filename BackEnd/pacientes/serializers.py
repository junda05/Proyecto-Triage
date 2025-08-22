from rest_framework import serializers
from datetime import date
from .models import Paciente, ContactoEmergencia
import re

class ContactoEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoEmergencia
        exclude = ('paciente',)
    
        extra_kwargs = {
            'segundo_nombre': {'required': False},
            'segundo_apellido': {'required': False},
        }
        
    def validate(self, data):
        nombre_completo = []
        for field in ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']:
            if field in data:
                # Eliminar espacios extras y dividir en palabras
                nombres = [nombre.strip() for nombre in data[field].split() if nombre.strip()]
                
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
                if len(nombres) != 1:
                    raise serializers.ValidationError(
                        f"El campo '{field}' debe contener exactamente una palabra, no {len(nombres)}."
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
        
        # Validar que el nombre completo tenga al menos 3 palabras
        if len(nombre_completo) < 3:
            raise serializers.ValidationError(
                "El nombre completo debe tener al menos 3 palabras entre nombres y apellidos."
            )
    
        # Validar que los 4 nombres no sean iguales y mostrar detalles
        from collections import Counter

        contador_nombres = Counter(nombre_completo)
        nombres_repetidos = [nombre for nombre, count in contador_nombres.items() if count > 1]

        if len(nombres_repetidos) > 0:
            total_repeticiones = sum(count - 1 for count in contador_nombres.values() if count > 1)
            raise serializers.ValidationError(
                f"No puede tener {total_repeticiones} nombre(s) repetido(s). Nombres duplicados: {', '.join(nombres_repetidos)}"
            )
            
        # validar numero prefijo_telefonico. Debe tener: + y al menos un numero
        if 'prefijo_telefonico' in data:
            if not re.match(r'^\+\d+$', data['prefijo_telefonico']):
                raise serializers.ValidationError({"prefijo_telefonico": "El prefijo telefónico debe comenzar con '+' y tener al menos un número."})

        # Validar telefono. Debe tener al menos 7 números
        if 'telefono' in data:
            if not re.match(r'^\d{7,}$', data['telefono']):
                raise serializers.ValidationError({"telefono": "El número de teléfono debe tener al menos 7 dígitos."})

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
    edad = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Paciente
        fields = '__all__'

    def get_edad(self, obj):
        today = date.today()
        edad = today.year - obj.fecha_nacimiento.year
        if today.month < obj.fecha_nacimiento.month or (today.month == obj.fecha_nacimiento.month and today.day < obj.fecha_nacimiento.day):
            edad -= 1
        return edad

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
                if len(nombres) != 1:
                    raise serializers.ValidationError(
                        f"El campo '{field}' debe contener exactamente una palabra, no {len(nombres)}."
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
    
        # Validar que los 4 nombres no sean iguales y mostrar detalles
        from collections import Counter

        contador_nombres = Counter(nombre_completo)
        nombres_repetidos = [nombre for nombre, count in contador_nombres.items() if count > 1]

        if len(nombres_repetidos) > 0:
            total_repeticiones = sum(count - 1 for count in contador_nombres.values() if count > 1)
            raise serializers.ValidationError(
                f"No puede tener {total_repeticiones} nombre(s) repetido(s). Nombres duplicados: {', '.join(nombres_repetidos)}"
            )
        
        # validar numero prefijo_telefonico. Debe tener: + y al menos un numero
        if 'prefijo_telefonico' in data:
            if not re.match(r'^\+\d+$', data['prefijo_telefonico']):
                raise serializers.ValidationError({"prefijo_telefonico": "El prefijo telefónico debe comenzar con '+' y tener al menos un número."})

        # Validar telefono. Debe tener al menos 7 números
        if 'telefono' in data:
            if not re.match(r'^\d{7,}$', data['telefono']):
                raise serializers.ValidationError({"telefono": "El número de teléfono debe tener al menos 7 dígitos."})
            
        return data