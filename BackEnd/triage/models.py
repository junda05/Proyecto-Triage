from django.db import models
from django.utils import timezone
from pacientes.models import Paciente
import uuid

class SesionTriage(models.Model):
    """Modelo para representar una sesión de triage completa."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='sesiones_triage')
    fecha_inicio = models.DateTimeField(default=timezone.now)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    nivel_triage = models.IntegerField(null=True, blank=True)  # Nivel ESI final (1-5)
    completado = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-fecha_inicio']  # Default ordering to prevent pagination warnings
    
    def __str__(self):
        return f"Triage {self.id} - Paciente: {self.paciente.primer_nombre} {self.paciente.primer_apellido}"

class Pregunta(models.Model):
    """Modelo para representar una pregunta del sistema de triage."""
    TIPOS_PREGUNTA = [
        ('boolean', 'Sí/No'),
        ('numeric', 'Numérico'),
        ('choice', 'Selección única'),
        ('multi_choice', 'Selección múltiple'),
        ('scale', 'Escala'),
        ('text', 'Texto libre'),
    ]
    
    codigo = models.CharField(max_length=100, primary_key=True)
    texto = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS_PREGUNTA)
    opciones = models.JSONField(null=True, blank=True)  # Para preguntas de selección o escala
    
    class Meta:
        ordering = ['codigo']  # Default ordering to prevent pagination warnings
    
    def __str__(self):
        return f"{self.codigo}: {self.texto}"

class Respuesta(models.Model):
    """Modelo para almacenar las respuestas de los pacientes a las preguntas de triage."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sesion = models.ForeignKey(SesionTriage, on_delete=models.CASCADE, related_name='respuestas')
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE)
    valor = models.JSONField()  # Almacena cualquier tipo de respuesta como JSON
    informacion_adicional = models.TextField(null=True, blank=True)  # Para campos como "Otra alergia especificar"
    timestamp = models.DateTimeField(auto_now_add=True)
    pregunta_siguiente = models.CharField(max_length=100, null=True, blank=True)  # Código de la siguiente pregunta basada en esta respuesta
    
    class Meta:
        unique_together = ('sesion', 'pregunta')  # Evita duplicados de respuestas
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Respuesta a {self.pregunta.codigo} en sesión {self.sesion.id}"
