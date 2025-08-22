import os
import sys
import django
from datetime import datetime

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
django.setup()

from autenticacion.models import Usuario

def create_admin_user(
    username,
    email,
    password,
    first_name,
    last_name,
    middle_name='',
    second_surname='',
    document_type='CC',
    document_number='',
    birth_date=None,
    phone='',
):
    """
    Creates an administrator user with the provided data
    """
    # Check if user already exists
    if Usuario.objects.filter(username=username).exists():
        print(f"User {username} already exists.")
        return None

    try:
        # Create superuser
        user = Usuario.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name,
            second_surname=second_surname,
            document_type=document_type,
            document_number=document_number,
            birth_date=birth_date,
            phone=phone,
            role='admin',
            is_active=True
        )
        print(f"Administrator user '{username}' created successfully!")
        return user
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        return None
    
# Create admin user
if __name__ == "__main__":
    create_admin_user(
        username='paula',
        email='paula@gmail.com',
        password='Admin123*',
        first_name='Maria',
        last_name='Castro',
        middle_name='Paula',
        second_surname='Muñiz',
        document_type='CC',
        document_number='1234567890',
        birth_date=datetime.strptime('2003-12-05', '%Y-%m-%d').date(),
        phone='3152487546'
    )