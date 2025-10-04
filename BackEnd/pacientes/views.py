from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
from .models import Paciente, ContactoEmergencia
from .serializers import PacienteSerializer, ContactoEmergenciaSerializer
from .services import PacienteCsvService
from utils.IsAdmin import IsAdminUser

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class ListCreatePacienteView(generics.ListCreateAPIView):
    serializer_class = PacienteSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    pagination_class = StandardResultsSetPagination
    
    # Campos de búsqueda
    search_fields = ['primer_nombre', 'primer_apellido', 'numero_documento']
    
    # Campos de filtrado
    filterset_fields = ['estado', 'sexo', 'tipo_documento']
    # Campos disponibles para ordenamiento
    ordering_fields = ['primer_nombre', 'primer_apellido', 'edad', 'sesiones_triage__fecha_inicio', 'sesiones_triage__nivel_triage']
    ordering = ['-sesiones_triage__fecha_inicio']  # Orden por defecto: más reciente primero

    def get_queryset(self):
        # Usar select_related y prefetch_related para optimizar las consultas
        queryset = Paciente.objects.select_related().prefetch_related(
            'sesiones_triage',
            'contacto_emergencia'
        )
        
        # Filtro personalizado para pacientes con triage completado
        triage_completado = self.request.query_params.get('triage_completado', None)
        if triage_completado and triage_completado.lower() == 'true':
            queryset = queryset.filter(sesiones_triage__completado=True)
        
        # Filtro por nivel ESI
        nivel_triage = self.request.query_params.get('nivel_triage', None)
        if nivel_triage:
            queryset = queryset.filter(sesiones_triage__nivel_triage=nivel_triage)
            
        # Usar distinct() al final para evitar duplicados si hay joins
        return queryset.distinct()

    # # Si el metodo HTTP es GET, pedir permisos de administrador
    # def get_permissions(self):
    #     if self.request.method == 'GET':
    #         self.permission_classes = [IsAdminUser]
    #     return super().get_permissions()

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Pacientes obtenidos satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'exito': True,
            'mensaje': 'Paciente y contacto de emergencia creados satisfactoriamente',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)
        
# Vista para obtener, actualizar y eliminar un paciente
class DetallePacienteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PacienteSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        # Optimizar la consulta de detalle también
        return Paciente.objects.select_related().prefetch_related(
            'sesiones_triage',
            'contacto_emergencia'
        )

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Paciente obtenido satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Paciente actualizado satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        nombre_completo = f"{instance.primer_nombre} {instance.segundo_nombre} {instance.primer_apellido} {instance.segundo_apellido}"
        self.perform_destroy(instance)
        return Response({
            'exito': True,
            'mensaje': f'Paciente {nombre_completo} eliminado satisfactoriamente',
        }, status=status.HTTP_200_OK)

# Vista para obtener y actualizar un contacto de emergencia
class ActualizarContactoEmergenciaView(generics.UpdateAPIView):
    serializer_class = ContactoEmergenciaSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_object(self):
        paciente_id = self.kwargs.get('pk')
        return ContactoEmergencia.objects.get(paciente_id=paciente_id)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'exito': True,
            'mensaje': 'Contacto de emergencia actualizado satisfactoriamente',
            'data': response.data
        }, status=status.HTTP_200_OK)


class ExportarPacientesCsvView(generics.GenericAPIView):
    """
    Vista para exportar tabla de pacientes a CSV.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Maneja la exportación de pacientes a CSV.
        """
        try:
            # Crear instancia del servicio y generar CSV simple
            csv_service = PacienteCsvService()
            return csv_service.exportar_pacientes_csv()
            
        except Exception as e:
            # Devolver error como JSON si algo falla
            return Response({
                'exito': False,
                'mensaje': f'Error al generar CSV: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
