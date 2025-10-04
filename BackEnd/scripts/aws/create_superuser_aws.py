#!/usr/bin/env python3
"""
Script Simple para Creación de Superusuario en AWS
"""

import os
import sys
import django
from datetime import datetime

# Configuración de Django
current_dir = os.path.dirname(os.path.abspath(__file__))
scripts_dir = os.path.dirname(current_dir)  # scripts/
backend_dir = os.path.dirname(scripts_dir)  # BackEnd/
project_root = os.path.dirname(backend_dir)  # Proyecto-Triage/

# Agregar el directorio BackEnd al path de Python
sys.path.insert(0, backend_dir)

# Cambiar al directorio BackEnd para que Django funcione correctamente
os.chdir(backend_dir)

# Configurar variables de entorno para AWS
# Cargar las variables de entorno AWS desde el archivo .env en scripts/aws/
from dotenv import load_dotenv

# Cargar el archivo .env de AWS
aws_env_path = os.path.join(current_dir, '.env')
if os.path.exists(aws_env_path):
    load_dotenv(aws_env_path)
    print(f"Cargando configuración AWS desde: {aws_env_path}")
else:
    print("Error: No se encontró el archivo .env en scripts/aws/")
    print("Copia el archivo .env.example como .env y configura tus credenciales de AWS")
    sys.exit(1)

# Configurar Django para usar la base de datos AWS
os.environ['RENDER'] = 'true'  # Esto hará que use la configuración de producción
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')

# Configurar las variables de la base de datos AWS
required_vars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT']
for var in required_vars:
    if var not in os.environ:
        print(f"Error: Variable de entorno {var} no está configurada")
        sys.exit(1)

# Establecer el engine de MySQL
os.environ['DB_ENGINE'] = 'django.db.backends.mysql'

django.setup()

from autenticacion.models import Usuario

def main():
    # Datos del usuario
    username = 'Paula'
    email = 'paula@gmail.com'
    password = 'Admin123*'
    
    print("Creando superusuario en AWS...")
    
    # Verificar si el usuario existe
    if Usuario.objects.filter(username=username).exists():
        print(f"El usuario '{username}' ya existe.")
        user = Usuario.objects.get(username=username)
        user.set_password(password)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.role = 'admin'
        user.save()
        print("¡Usuario actualizado exitosamente!")
    else:
        # Crear nuevo usuario
        user = Usuario.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name='Maria',
            last_name='Castro',
            middle_name='Paula',
            second_surname='Muñiz',
            document_type='CC',
            document_number='1234567890',
            birth_date=datetime.strptime('2003-12-05', '%Y-%m-%d').date(),
            phone='3152487546',
            role='admin'
        )
        print(f"¡Superusuario '{username}' creado exitosamente!")
    
    print(f"Iniciar sesión con: {username} / {password}")

if __name__ == "__main__":
    main()