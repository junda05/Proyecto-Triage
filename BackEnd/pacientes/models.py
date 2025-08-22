from django.db import models
from utils.choices import DOC_CHOICES, SEX_CHOICES

# Entidad principal
class Paciente(models.Model):
    primer_nombre = models.CharField(max_length=255)
    segundo_nombre = models.CharField(max_length=255, blank=True, null=True)
    primer_apellido = models.CharField(max_length=255)
    segundo_apellido = models.CharField(max_length=255, blank=True, null=True)
    tipo_documento = models.CharField(max_length=2, choices=DOC_CHOICES)
    numero_documento = models.CharField(max_length=20, unique=True)
    sexo = models.CharField(max_length=10, choices=SEX_CHOICES)
    prefijo_telefonico = models.CharField(max_length=10)
    telefono = models.CharField(max_length=20)
    creado = models.DateTimeField(auto_now_add=True)
    esta_activo = models.BooleanField(default=True)
    
    # Indexar para realizar consulta más eficientes a la base de datos
    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'
        
        indexes = [
            models.Index(fields=['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']),
            models.Index(fields=['numero_documento']),
        ]

    # Representación en cadena del modelo para el admin y tener una visualización clara de los pacientes
    # Esto es útil para identificar rápidamente a los pacientes en la interfaz de administración
    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido} ({self.numero_documento})"


# Modelo de contacto de emergencia para pacientes
class ContactoEmergencia(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete = models.CASCADE, related_name = 'contacto_emergencia')
    nombre = models.CharField(max_length=255)
    prefijo_telefonico = models.CharField(max_length=10)
    telefono = models.CharField(max_length=20)
    relacion_parentesco = models.CharField(max_length=100)
    
    class Meta:
        indexes = [
            models.Index(fields=['nombre']),
            models.Index(fields=['telefono']),
        ]
        
    def __str__(self):
        return f"{self.nombre} ({self.telefono})"