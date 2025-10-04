from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.utils import timezone
from datetime import date, timedelta
from .services import ReportesService
from .serializers import ReportFiltersSerializer


class ReporteDashboardView(generics.GenericAPIView):
    """
    Vista unificada para el dashboard de reportes
    Retorna todos los datos necesarios en una sola respuesta
    Implementa principio DRY eliminando endpoints duplicados
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ReportFiltersSerializer
    
    @method_decorator(cache_page(60 * 5))  # Cache por 5 minutos
    def post(self, request, *args, **kwargs):
        """
        Genera reporte completo para dashboard con todos los datos
        """
        # Validar filtros
        filter_serializer = self.get_serializer(data=request.data)
        if not filter_serializer.is_valid():
            return Response(
                filter_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        filtros_data = filter_serializer.validated_data
        
        # Generar reporte usando el servicio
        service = ReportesService(
            fecha_inicio=filtros_data['fecha_inicio'],
            fecha_fin=filtros_data['fecha_fin'],
            filtros={
                'niveles_esi': filtros_data.get('niveles_esi'),
                'estados': filtros_data.get('estados'),
                'generos': filtros_data.get('generos'),
                'turnos': filtros_data.get('turnos'),
                'rango_edad_min': filtros_data.get('rango_edad_min'),
                'rango_edad_max': filtros_data.get('rango_edad_max')
            }
        )
        
        try:
            # Generar todos los datos necesarios para el dashboard
            dashboard_data = {
                # Resumen principal
                **service.generar_reporte_completo(),
                
                # Información adicional para el dashboard
                'periodo': {
                    'fecha_inicio': filtros_data['fecha_inicio'].strftime('%d/%m/%Y'),
                    'fecha_fin': filtros_data['fecha_fin'].strftime('%d/%m/%Y'),
                    'dias_analizados': (filtros_data['fecha_fin'] - filtros_data['fecha_inicio']).days + 1
                },
                'metadata': {
                    'fecha_generacion': timezone.localtime().strftime('%d/%m/%Y'),
                    'hora_generacion': timezone.localtime().strftime('%H:%M:%S'),
                    'tipo_reporte': 'Dashboard Completo',
                    'version': '2.0'
                }
            }
            
            return Response(dashboard_data, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': f'Error interno del servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, *args, **kwargs):
        """
        Obtiene reporte dashboard con filtros por defecto (últimos 30 días)
        """
        fecha_fin = date.today()
        fecha_inicio = fecha_fin - timedelta(days=30)
        
        service = ReportesService(fecha_inicio, fecha_fin)
        
        try:
            dashboard_data = {
                **service.generar_reporte_completo(),
                'periodo': {
                    'fecha_inicio': fecha_inicio.strftime('%d/%m/%Y'),
                    'fecha_fin': fecha_fin.strftime('%d/%m/%Y'),
                    'dias_analizados': 31
                },
                'metadata': {
                    'fecha_generacion': timezone.localtime().strftime('%d/%m/%Y'),
                    'hora_generacion': timezone.localtime().strftime('%H:%M:%S'),
                    'tipo_reporte': 'Dashboard Completo',
                    'version': '2.0'
                }
            }
            
            return Response(dashboard_data, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response(
                {'error': f'Error interno del servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
