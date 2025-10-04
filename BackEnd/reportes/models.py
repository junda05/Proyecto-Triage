from django.db import models
from django.utils import timezone
from pacientes.models import Paciente
from triage.models import SesionTriage

# No necesitamos modelos adicionales por ahora
# Todas las métricas se calcularán directamente desde Paciente y SesionTriage
# usando agregaciones optimizadas de Django
