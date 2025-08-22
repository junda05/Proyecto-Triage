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
    
    def __str__(self):
        return f"Triage {self.id} - Paciente: {self.paciente.nombre} {self.paciente.apellido}"

class Pregunta(models.Model):
    """Modelo para representar una pregunta del sistema de triage."""
    TIPOS_PREGUNTA = [
        ('boolean', 'Sí/No'),
        ('numeric', 'Numérico'),
        ('choice', 'Selección'),
        ('scale', 'Escala'),
        ('text', 'Texto libre'),
    ]
    
    codigo = models.CharField(max_length=100, primary_key=True)
    texto = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS_PREGUNTA)
    opciones = models.JSONField(null=True, blank=True)  # Para preguntas de selección o escala
    unidad = models.CharField(max_length=20, null=True, blank=True)  # Para valores numéricos
    orden = models.IntegerField(default=0)  # Para ordenar preguntas
    
    def __str__(self):
        return f"{self.codigo}: {self.texto}"

class Respuesta(models.Model):
    """Modelo para almacenar las respuestas de los pacientes a las preguntas de triage."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sesion = models.ForeignKey(SesionTriage, on_delete=models.CASCADE, related_name='respuestas')
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE)
    valor = models.JSONField()  # Almacena cualquier tipo de respuesta como JSON
    timestamp = models.DateTimeField(auto_now_add=True)
    pregunta_siguiente = models.CharField(max_length=100, null=True, blank=True)  # Código de la siguiente pregunta basada en esta respuesta
    
    class Meta:
        unique_together = ('sesion', 'pregunta')  # Evita duplicados de respuestas
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Respuesta a {self.pregunta.codigo} en sesión {self.sesion.id}"

class ReglaFlujo(models.Model):
    """Modelo para definir reglas de navegación en el flujo del triage."""
    pregunta_origen = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='reglas_origen')
    condicion = models.JSONField()  # Condición que debe cumplirse (ej: {"tipo": "igual", "valor": "Sí"})
    pregunta_destino = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='reglas_destino')
    prioridad = models.IntegerField(default=0)  # Para ordenar múltiples reglas posibles
    nivel_triage = models.IntegerField(null=True, blank=True)  # Si esta regla determina un nivel de triage final
    
    class Meta:
        ordering = ['pregunta_origen', '-prioridad']
    
    def __str__(self):
        return f"Regla: {self.pregunta_origen.codigo} → {self.pregunta_destino.codigo}"
