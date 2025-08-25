from django.db import models
from datetime import date
from utils.choices import DOC_CHOICES, SEX_CHOICES, EPS_CHOICES, REGIMEN_EPS_CHOICES

# Entidad principal
class Paciente(models.Model):
    primer_nombre = models.CharField(max_length=255)
    segundo_nombre = models.CharField(max_length=255, blank=True, null=True)
    primer_apellido = models.CharField(max_length=255)
    segundo_apellido = models.CharField(max_length=255, blank=True, null=True)
    fecha_nacimiento = models.DateField()
    tipo_documento = models.CharField(max_length=2, choices=DOC_CHOICES)
    numero_documento = models.CharField(max_length=20, unique=False)
    sexo = models.CharField(max_length=10, choices=SEX_CHOICES)
    prefijo_telefonico = models.CharField(max_length=10)
    telefono = models.CharField(max_length=20)
    regimen_eps = models.CharField(max_length=100, choices=REGIMEN_EPS_CHOICES)
    eps = models.CharField(max_length=100, choices=EPS_CHOICES)
    tiene_seguro_medico = models.BooleanField(default=False)
    nombre_seguro_medico = models.CharField(max_length=100, blank=True, null=True)
    sintomas_iniciales = models.TextField()  # Este campo es obligatorio
    creado = models.DateTimeField(auto_now_add=True)
    
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
    
    @property
    def edad(self):
        """
        Calcula la edad del paciente basada en su fecha de nacimiento
        """
        today = date.today()
        edad = today.year - self.fecha_nacimiento.year
        if today.month < self.fecha_nacimiento.month or (today.month == self.fecha_nacimiento.month and today.day < self.fecha_nacimiento.day):
            edad -= 1
        return edad


# Modelo de contacto de emergencia para pacientes
class ContactoEmergencia(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete = models.CASCADE, related_name = 'contacto_emergencia')
    primer_nombre = models.CharField(max_length=255)
    segundo_nombre = models.CharField(max_length=255, blank=True, null=True)
    primer_apellido = models.CharField(max_length=255)
    segundo_apellido = models.CharField(max_length=255, blank=True, null=True)
    prefijo_telefonico = models.CharField(max_length=10)
    telefono = models.CharField(max_length=20)
    relacion_parentesco = models.CharField(max_length=100)
    
    class Meta:
        indexes = [
            models.Index(fields=['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']),
            models.Index(fields=['telefono']),
        ]
        
    def __str__(self):
        return f"{self.primer_nombre} {self.primer_apellido} ({self.telefono})"