from django.db import models
from django.contrib.auth.models import AbstractUser
from utils.choices import DOC_CHOICES, ROL_CHOICES

class Usuario(AbstractUser):
    # User entity fields
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    second_surname = models.CharField(max_length=100, blank=True, null=True)
    document_type = models.CharField(max_length=2, choices=DOC_CHOICES)
    document_number = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField()
    phone_prefix = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=15)
    
    # Campo específico del proyecto
    role = models.CharField(max_length=10, choices=ROL_CHOICES, default='estandar')
    
    # Para ordenar y visualizar en el admin
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
        # Indexar para realizar consulta más eficientes a la base de datos
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['document_number']),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"