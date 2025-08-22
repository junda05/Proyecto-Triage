from django.urls import path
from .views import CrearPacienteView, DetallePacienteView, DetalleContactoEmergenciaView

urlpatterns = [
    # POST /api/v1/pacientes - Crear un nuevo paciente
    path('/', CrearPacienteView.as_view(), name='paciente-list'),
    
    # GET /api/v1/pacientes/{id} - Obtener un paciente por ID
    # PUT - PATCH /api/v1/pacientes/{id} - Actualizar un paciente por ID
    path('<int:pk>', DetallePacienteView.as_view(), name='paciente-detail'),

    # GET /api/v1/pacientes/{id}/contacto-emergencia - Obtener contacto de emergencia por ID de paciente
    # PUT - PATCH /api/v1/pacientes/{id}/contacto-emergencia - Actualizar contacto de emergencia por ID de paciente
    path('<int:pk>/contacto-emergencia', DetalleContactoEmergenciaView.as_view(), name='contacto-emergencia-detail'),
]
