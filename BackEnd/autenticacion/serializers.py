from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

Usuario = get_user_model()

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm', 'first_name', 'middle_name',
            'last_name', 'second_surname', 'document_type', 'document_number',
            'birth_date', 'phone_prefix', 'phone', 'role'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'email': {'required': True},
            'phone': {'required': True},
            'phone_prefix': {'required': True},
        }
    
    def validate(self, data):
        # Validar email único solo si se proporciona en la petición
        if 'email' in data and Usuario.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Este correo ya está en uso."})
        
        # Validar documento único solo si se proporciona en la petición
        if 'document_number' in data and Usuario.objects.filter(document_number=data['document_number']).exists():
            raise serializers.ValidationError({"document_number": "El documento ya está registrado."})
        
        # Obtener todas las palabras del nombre completo
        nombre_completo = []
        for field in ['first_name', 'middle_name', 'last_name', 'second_surname']:
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
            
        # validar numero phone_prefix. Debe tener: + y al menos un numero
        if 'phone_prefix' in data:
            if not re.match(r'^\+\d+$', data['phone_prefix']):
                raise serializers.ValidationError({"phone_prefix": "El prefijo telefónico debe comenzar con '+' y tener al menos un número."})

        # Validar phone. Debe tener al menos 7 números
        if 'phone' in data:
            if not re.match(r'^\d{7,}$', data['phone']):
                raise serializers.ValidationError({"phone": "El número de teléfono debe tener al menos 7 dígitos."})

        # Validar contraseñas solo si se proporcionan en la petición
        if 'password' in data and 'password_confirm' in data:
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError("Las contraseñas no coinciden")
        
        return data
    
    def create(self, validated_data):
        # Get user role
        role = validated_data.get('role', 'estandar')
        
        user = Usuario.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            middle_name=validated_data.get('middle_name', ''),
            last_name=validated_data['last_name'],
            second_surname=validated_data.get('second_surname', ''),
            document_type=validated_data['document_type'],
            document_number=validated_data['document_number'],
            birth_date=validated_data['birth_date'],
            phone_prefix=validated_data['phone_prefix'],
            phone=validated_data['phone'],
            role=role,
            is_active=True,  # Los usuarios siempre se crean activos
            is_staff=role == 'admin',  # Si el rol es admin, darle acceso a staff
            is_superuser=role == 'admin'  # Si el rol es admin, también debe ser superusuario
        )
        
        user.set_password(validated_data['password'])
        user.save()
        return user
    
    def update(self, instance, validated_data):
        # No permitir actualizar el password directamente, usar endpoint separado
        # Para una futura implementación de recuperación de contraseña
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)

        # Actualizar permisos si cambia el rol
        if 'role' in validated_data:
            role = validated_data['role']
            if role == 'admin':
                instance.is_staff = True
                instance.is_superuser = True
            else:
                instance.is_staff = False
                instance.is_superuser = False

        return super().update(instance, validated_data)


class SerializadorPerfilUsuario(serializers.ModelSerializer):
      
    class Meta:
        model = Usuario
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'middle_name',
            'last_name',
            'second_surname',
            'document_type',
            'document_number',
            'birth_date',
            'phone_prefix',
            'phone',
            'role',
            'date_joined',
            'is_active'
        )
        read_only_fields = ('id', 'date_joined', 'is_active')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para tokens JWT que actualiza last_login al obtener tokens
    """
    
    def validate(self, attrs):
        # Primero obtenemos el token y los datos usando el método original
        data = super().validate(attrs)
        
        # Actualizar el campo last_login del usuario
        import datetime
        
        # Obtener la hora actual (ya en zona horaria local debido a USE_TZ = False)
        local_now = datetime.datetime.now()
        
        user = self.user
        user.last_login = local_now
        user.save(update_fields=['last_login'])
        
        return data