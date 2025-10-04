from django.urls import path
from .views import ListCreatePacienteView, DetallePacienteView, ActualizarContactoEmergenciaView, ExportarPacientesCsvView

urlpatterns = [
    # POST /api/v1/pacientes/ - Crear un nuevo paciente
    # GET /api/v1/pacientes/ - Listar todos los pacientes (solo administradores)
    path('', ListCreatePacienteView.as_view(), name='paciente-list-create'),
    
    # GET /api/v1/pacientes/{id} - Obtener un paciente por ID (solo administradores)
    # PUT - PATCH /api/v1/pacientes/{id} - Actualizar un paciente por ID (solo administradores)
    path('<int:pk>', DetallePacienteView.as_view(), name='paciente-detail'), 

    # PUT - PATCH /api/v1/pacientes/{id}/contacto-emergencia - Actualizar contacto de emergencia por ID de paciente
    path('<int:pk>/contacto-emergencia', ActualizarContactoEmergenciaView.as_view(), name='contacto-emergencia-detail'),
    
    # GET /api/v1/pacientes/exportar-csv/ - Exportar tabla de pacientes a CSV
    path('exportar-csv/', ExportarPacientesCsvView.as_view(), name='paciente-exportar-csv'),
]