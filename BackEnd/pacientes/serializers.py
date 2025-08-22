from rest_framework import serializers
from datetime import date
from .models import Paciente, ContactoEmergencia

class ContactoEmergenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoEmergencia
        exclude = ('paciente',)  # Excluimos paciente porque se asignará automáticamente

class PacienteSerializer(serializers.ModelSerializer):
    contacto_emergencia = ContactoEmergenciaSerializer(required=True)
    edad = serializers.SerializerMethodField()

    class Meta:
        model = Paciente
        fields = '__all__'
        extra_fields = ['edad', 'contacto_emergencia']

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

    # Este método permite personalizar la representación del paciente para
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        contacto = instance.contacto_emergencia.first()
        if contacto:
            representation['contacto_emergencia'] = ContactoEmergenciaSerializer(contacto).data
        return representation
    
    def validate(self, data):
        # Obtener todas las palabras del nombre completo
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
                            field: f"La palabra '{nombre}' es demasiado corta. Debe tener al menos 2 caracteres."
                        })
                    elif len(nombre) > 30:
                        raise serializers.ValidationError({
                            field: f"La palabra '{nombre}' es demasiado larga. Debe tener como máximo 30 caracteres."
                        })
                    
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
        
        return data