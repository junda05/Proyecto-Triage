from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

Usuario = get_user_model()

# Mapeo de campos a nombres descriptivos en español
FIELD_NAMES = {
    'document_type': 'tipo de documento',
    'document_number': 'número de documento',
    'birth_date': 'fecha de nacimiento',
    'password': 'contraseña',
    'password_confirm': 'confirmación de contraseña',
    'email': 'correo electrónico',
    'phone': 'número de teléfono',
    'phone_prefix': 'prefijo telefónico',
    'first_name': 'primer nombre',
    'last_name': 'primer apellido',
    'username': 'nombre de usuario'
}

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)
    email = serializers.EmailField(required=True, error_messages={'required': f'El {FIELD_NAMES["email"]} es requerido.'})
    document_type = serializers.CharField(required=False, error_messages={'required': f'El {FIELD_NAMES["document_type"]} es requerido.'})
    document_number = serializers.CharField(required=False, error_messages={'required': f'El {FIELD_NAMES["document_number"]} es requerido.'})
    birth_date = serializers.DateField(required=False, error_messages={'required': f'La {FIELD_NAMES["birth_date"]} es requerida.'})
    phone = serializers.CharField(required=True, error_messages={'required': f'El {FIELD_NAMES["phone"]} es requerido.'})
    phone_prefix = serializers.CharField(required=True, error_messages={'required': f'El {FIELD_NAMES["phone_prefix"]} es requerido.'})
    
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'password', 'password_confirm', 'first_name', 'middle_name',
            'last_name', 'second_surname', 'document_type', 'document_number',
            'birth_date', 'phone_prefix', 'phone', 'role', 'last_login', 'is_active', 'date_joined'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'middle_name': {'required': False},
            'second_surname': {'required': False},
            'last_login': {'read_only': True},
            'date_joined': {'read_only': True},
        }
    
    def validate(self, data):
        # Determinar si es una operación de creación o actualización
        is_creation = not hasattr(self, 'instance') or self.instance is None
        
        # Validar modificaciones en usuarios inactivos
        if not is_creation and self.instance and not self.instance.is_active:
            # Si el usuario está inactivo, solo permitir reactivarlo (cambiar is_active a True)
            if len(data) == 1 and 'is_active' in data and data['is_active'] in [True, 'true', '1', 1]:
                # Solo se permite reactivar el usuario
                return data
            elif 'is_active' in data and data['is_active'] in [True, 'true', '1', 1] and len(data) > 1:
                # Se está intentando reactivar y modificar otros campos al mismo tiempo
                raise serializers.ValidationError(
                    "Para reactivar un usuario inactivo, primero debe activarlo y luego modificar otros campos en operaciones separadas."
                )
            else:
                # Se está intentando modificar otros campos de un usuario inactivo
                raise serializers.ValidationError(
                    "No se pueden modificar los datos de un usuario inactivo."
                )
        
        # Validar campos obligatorios para creación
        if is_creation:
            required_fields = ['document_type', 'document_number', 'birth_date', 'password', 'password_confirm']
            for field in required_fields:
                if field not in data or not data[field]:
                    field_name = FIELD_NAMES.get(field, field)
                    article = 'La' if field == 'birth_date' else 'El'
                    raise serializers.ValidationError({field: f"{article} {field_name} es requerido{'a' if field == 'birth_date' else ''}."})
        
        # Validar email único solo si se proporciona en la petición
        if 'email' in data:
            email_query = Usuario.objects.filter(email=data['email'])
            if not is_creation:
                # En actualizaciones, excluir el usuario actual
                email_query = email_query.exclude(pk=self.instance.pk)
            if email_query.exists():
                raise serializers.ValidationError({"email": "Este correo ya está en uso."})
        
        # Validar documento único solo si se proporciona en la petición
        if 'document_number' in data:
            document_query = Usuario.objects.filter(document_number=data['document_number'])
            if not is_creation:
                # En actualizaciones, excluir el usuario actual
                document_query = document_query.exclude(pk=self.instance.pk)
            if document_query.exists():
                raise serializers.ValidationError({"document_number": "El documento ya está registrado."})
        
        # Validación del nombre completo para actualizaciones parciales
        # Solo validar si se están actualizando campos de nombre
        name_fields_in_data = [field for field in ['first_name', 'middle_name', 'last_name', 'second_surname'] if field in data]
        
        if name_fields_in_data:
            # Para actualizaciones, necesitamos combinar los datos existentes con los nuevos
            if self.instance:
                # Obtener datos actuales del usuario
                current_data = {
                    'first_name': self.instance.first_name or '',
                    'middle_name': self.instance.middle_name or '',
                    'last_name': self.instance.last_name or '',
                    'second_surname': self.instance.second_surname or ''
                }
                # Actualizar con los nuevos datos
                current_data.update({field: data[field] for field in name_fields_in_data if field in data})
            else:
                # Para creación, usar solo los datos proporcionados
                current_data = {field: data.get(field, '') for field in ['first_name', 'middle_name', 'last_name', 'second_surname']}
            
            # Procesar y validar el nombre completo
            nombre_completo = []
            for field, value in current_data.items():
                if value:  # Solo procesar si el campo no está vacío
                    # Eliminar espacios extras y dividir en palabras
                    nombres = [nombre.strip() for nombre in value.split() if nombre.strip()]
                    
                    # Procesar nombres si existen
                    for nombre in nombres:
                        if len(nombre) < 2:
                            raise serializers.ValidationError({
                                field: f"La palabra '{nombre}' del campo {field} es demasiado corta. Debe tener al menos 2 caracteres."
                            })
                        elif len(nombre) > 30:
                            raise serializers.ValidationError({
                                field: f"La palabra '{nombre}' del campo {field} es demasiado larga. Debe tener como máximo 30 caracteres."
                            })
                        
                        # Verificar que solo contenga letras y espacios
                        if not nombre.replace('-', '').replace("'", '').isalpha():
                            raise serializers.ValidationError({
                                field: f"La palabra '{nombre}' contiene caracteres no permitidos. Solo se permiten letras, guiones y apóstrofes."
                            })
                    
                    # Verificar que cada campo tenga solo una o dos palabras
                    if nombres and len(nombres) not in [1, 2]:
                        raise serializers.ValidationError({
                            field: f"El campo '{field}' debe contener exactamente una o dos palabras, no {len(nombres)}."
                        })
                    
                    nombre_completo.extend(nombres)
            
            # Validar que el nombre completo tenga al menos 3 palabras
            # Se requiere: nombre + apellido + (segundo nombre O segundo apellido)
            if len(nombre_completo) < 3:
                raise serializers.ValidationError(
                    "El nombre completo debe tener al menos 3 palabras. Debe incluir nombre, apellido y segundo nombre o segundo apellido."
                )
        
        # Procesar solo los campos presentes en data para normalización
        for field in ['first_name', 'middle_name', 'last_name', 'second_surname']:
            if field in data and data[field]:
                # Eliminar espacios extras y dividir en palabras
                nombres = [nombre.strip() for nombre in data[field].split() if nombre.strip()]
                
                # Verificar que haya al menos una palabra si el campo no es opcional
                if not nombres and field in ['first_name', 'last_name']:
                    raise serializers.ValidationError({field: "Este campo no puede estar vacío."})
                
                # Actualizar el campo con las palabras normalizadas
                if nombres:
                    data[field] = ' '.join(nombres)
    
        # Validar nombres repetidos solo si se están actualizando campos de nombre
        if name_fields_in_data:
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

        # Validar contraseñas solo si ambas se proporcionan en la petición
        if 'password' in data or 'password_confirm' in data:
            # Si se proporciona una, se deben proporcionar ambas
            if 'password' not in data or 'password_confirm' not in data:
                raise serializers.ValidationError({
                    "password": "Para cambiar la contraseña, debes proporcionar tanto 'password' como 'password_confirm'."
                })
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        
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
        # Remover password_confirm ya que no es un campo del modelo
        validated_data.pop('password_confirm', None)
        
        # Manejar contraseña si se proporciona
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
        read_only_fields = ('id', 'date_joined')


class CaseSensitiveTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer personalizado para login que valida el username de forma exacta (case-sensitive).
    Solo permite autenticación si el username coincide exactamente con el de la base de datos.
    """
    
    def validate(self, attrs):
        # Obtener username y password de los datos enviados
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username is None or password is None:
            raise serializers.ValidationError(
                'Debe proporcionar username y password.',
                code='authorization'
            )
        
        User = get_user_model()
        
        try:
            # Buscar usuarios que coincidan con el username (puede ser insensible a mayúsculas en la DB)
            users = User.objects.filter(username__iexact=username)
            
            if not users.exists():
                raise serializers.ValidationError(
                    'Las credenciales proporcionadas no son válidas.',
                    code='authorization'
                )
            
            # Verificar que el username sea EXACTAMENTE igual (case-sensitive)
            user = None
            for candidate_user in users:
                if candidate_user.username == username:  # Comparación exacta
                    user = candidate_user
                    break
            
            if user is None:
                raise serializers.ValidationError(
                    'Las credenciales proporcionadas no son válidas.',
                    code='authorization'
                )
            
            # Verificar que el usuario esté activo
            if not user.is_active:
                raise serializers.ValidationError(
                    'La cuenta está desactivada.',
                    code='authorization'
                )
            
            # Verificar la contraseña
            if not user.check_password(password):
                raise serializers.ValidationError(
                    'Las credenciales proporcionadas no son válidas.',
                    code='authorization'
                )
            
            # Si llegamos aquí, las credenciales son válidas
            # Actualizar los attrs con el usuario encontrado para que el padre proceda
            attrs['username'] = user.username
            
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'Las credenciales proporcionadas no son válidas.',
                code='authorization'
            )
        
        # Llamar al método padre con las credenciales validadas
        return super().validate(attrs)