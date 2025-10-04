from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SesionTriage, Pregunta, Respuesta
from .serializers import SesionTriageSerializer, PreguntaSerializer, RespuestaSerializer, RespuestaCreateSerializer
from .utils.preguntas import PREGUNTAS
from pacientes.models import Paciente
from utils.IsAdmin import IsAdminUser
from .utils.enfermedad_helpers import EnfermedadEvaluationHelper
from .utils.triage_evaluation import TriageEvaluationHelper
from .utils.triage_flow import TriageFlowHelper
import uuid


class TriagePreguntaMixin:
    """
    Mixin que proporciona lógica común para determinar preguntas de triage
    """
    def _determinar_primera_pregunta(self, paciente):
        """
        Determina la primera pregunta según la edad y sexo del paciente
        """
        return TriageFlowHelper.determinar_primera_pregunta(paciente)
    
    def _determinar_siguiente_pregunta_sesion(self, sesion):
        """
        Determina la siguiente pregunta basada en las respuestas existentes de una sesión.
        Método común para evitar duplicación entre vistas.
        """
        respuestas_existentes = sesion.respuestas.all().order_by('timestamp')
        
        if respuestas_existentes.exists():
            # Si ya hay respuestas, obtener la última y determinar la siguiente pregunta
            ultima_respuesta = respuestas_existentes.last()
            if ultima_respuesta.pregunta_siguiente:
                try:
                    return Pregunta.objects.get(codigo=ultima_respuesta.pregunta_siguiente)
                except Pregunta.DoesNotExist:
                    return None
            else:
                return None
        else:
            # No hay respuestas, obtener la primera pregunta
            return self._determinar_primera_pregunta(sesion.paciente)

class PreguntaListView(generics.ListAPIView):
    """
    API para listar todas las preguntas disponibles del triage
    """
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer

class PreguntaDetailView(generics.RetrieveAPIView):
    """
    API para consultar una pregunta específica por su código
    """
    queryset = Pregunta.objects.all()
    serializer_class = PreguntaSerializer
    lookup_field = 'codigo'

class SesionTriageListView(generics.ListAPIView):
    """
    API para listar sesiones de triage
    """
    queryset = SesionTriage.objects.all()
    serializer_class = SesionTriageSerializer
    
    def perform_create(self, serializer):
        serializer.save(fecha_inicio=timezone.now())

class SesionTriageDetailView(TriagePreguntaMixin, generics.RetrieveAPIView):
    """
    API para consultar una sesión específica y obtener la siguiente pregunta
    """
    queryset = SesionTriage.objects.all()
    serializer_class = SesionTriageSerializer
    permission_classes = [permissions.AllowAny]
    
    def _is_valid_uuid(self, uuid_string):
        """
        Valida si una cadena es un UUID válido
        """
        try:
            uuid.UUID(uuid_string)
            return True
        except (ValueError, TypeError):
            return False
    
    def retrieve(self, request, *args, **kwargs):
        try:
            # Validar que el pk sea un UUID válido antes de buscar el objeto
            pk = kwargs.get('pk')
            if not self._is_valid_uuid(pk):
                return Response({
                    'exito': False,
                    'mensaje': 'Sesión no encontrada',
                    'error': 'No se encontró la sesión especificada'
                }, status=status.HTTP_404_NOT_FOUND)
            
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            # Si la sesión está completada, no calcular siguiente pregunta
            if instance.completado:
                return Response({
                    'exito': True,
                    'mensaje': 'Sesión encontrada exitosamente (completada)',
                    'data': {
                        'sesion': serializer.data,
                        'siguiente_pregunta': None,
                        'completado': True
                    }
                }, status=status.HTTP_200_OK)
            
            # Determinar la siguiente pregunta usando el método común
            siguiente_pregunta = self._determinar_siguiente_pregunta_sesion(instance)
            
            return Response({
                'exito': True,
                'mensaje': 'Sesión encontrada exitosamente',
                'data': {
                    'sesion': serializer.data,
                    'siguiente_pregunta': PreguntaSerializer(siguiente_pregunta).data if siguiente_pregunta else None,
                    'completado': False
                }
            }, status=status.HTTP_200_OK)
            
        except SesionTriage.DoesNotExist:
            return Response({
                'exito': False,
                'mensaje': 'Sesión no encontrada',
                'error': 'No se encontró la sesión especificada'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'exito': False,
                'mensaje': 'Error interno del servidor',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class IniciarTriage(TriagePreguntaMixin, APIView):
    """
    API para iniciar una nueva sesión de triage y obtener la primera pregunta
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        # Verificar que se proporcione un paciente_id
        paciente_id = request.data.get('paciente')
        if not paciente_id:
            return Response({
                'exito': False,
                'mensaje': 'Se requiere un paciente_id',
                'error': 'Se requiere un paciente_id'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Obtener el paciente para verificar su sexo
            paciente = Paciente.objects.get(id=paciente_id)
        except Paciente.DoesNotExist:
            return Response({
                'exito': False,
                'mensaje': 'Paciente no encontrado',
                'error': 'No se encontró el paciente especificado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar si ya existe una sesión activa (no completada) para este paciente
        sesion_activa = SesionTriage.objects.filter(
            paciente=paciente,
            completado=False
        ).first()
        
        if sesion_activa:
            # Ya existe una sesión activa, recuperar directamente usando el método común
            try:
                sesion_serializer = SesionTriageSerializer(sesion_activa)
                siguiente_pregunta = self._determinar_siguiente_pregunta_sesion(sesion_activa)
                
                return Response({
                    'exito': True,
                    'mensaje': 'Sesión de triage activa recuperada',
                    'data': {
                        'sesion': sesion_serializer.data,
                        'primera_pregunta': PreguntaSerializer(siguiente_pregunta).data if siguiente_pregunta else None
                    }
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response({
                    'exito': False,
                    'mensaje': 'Error interno del servidor',
                    'error': f'Error al recuperar la sesión activa: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Crear nueva sesión de triage
        sesion_serializer = SesionTriageSerializer(data={'paciente': paciente_id})
        sesion_serializer.is_valid(raise_exception=True)
        sesion = sesion_serializer.save(fecha_inicio=timezone.now())
        
        # Determinar la primera pregunta usando el método auxiliar
        primera_pregunta = self._determinar_primera_pregunta(paciente)
        
        if not primera_pregunta:
            return Response({
                'exito': False,
                'mensaje': 'No hay preguntas definidas en el sistema',
                'error': 'No hay preguntas definidas en el sistema'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'exito': True,
            'mensaje': 'Sesión de triage iniciada exitosamente',
            'data': {
                'sesion': SesionTriageSerializer(sesion).data,
                'primera_pregunta': PreguntaSerializer(primera_pregunta).data
            }
        }, status=status.HTTP_201_CREATED)

class RespuestaCreate(generics.CreateAPIView):
    """
    API para registrar una respuesta y obtener la siguiente pregunta
    """
    serializer_class = RespuestaCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Guardar la respuesta
            respuesta = serializer.save()
            
            # Buscar la siguiente pregunta según las reglas de flujo
            siguiente_pregunta = self.determinar_siguiente_pregunta(respuesta)
            
            if siguiente_pregunta:
                # Si hay siguiente pregunta, actualizar el campo pregunta_siguiente
                respuesta.pregunta_siguiente = siguiente_pregunta.codigo
                respuesta.save()
                
                # Devolver la siguiente pregunta junto con la respuesta guardada
                return Response({
                    'exito': True,
                    'mensaje': 'Respuesta guardada exitosamente',
                    'data': {
                        'respuesta': RespuestaSerializer(respuesta).data,
                        'siguiente_pregunta': PreguntaSerializer(siguiente_pregunta).data
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                # No hay más preguntas, finalizar el triage
                sesion = respuesta.sesion
                sesion.completado = True
                sesion.fecha_fin = timezone.now()
                
                # Determinar nivel de triage basado en las respuestas
                nivel_triage = self.determinar_nivel_triage(sesion)
                if nivel_triage:
                    sesion.nivel_triage = nivel_triage
                
                sesion.save()
                
                return Response({
                    'exito': True,
                    'mensaje': 'Triage completado exitosamente',
                    'data': {
                        'respuesta': RespuestaSerializer(respuesta).data,
                        'nivel_triage': sesion.nivel_triage,
                        'completado': True
                    }
                }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'exito': False,
                'mensaje': f'Error al procesar la respuesta: {str(e)}',
                'error': f'Error al procesar la respuesta: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def determinar_siguiente_pregunta(self, respuesta):
        """
        Determina la siguiente pregunta basada en la respuesta actual
        y las reglas de flujo definidas en FLUJO_PREGUNTAS.
        """
        codigo_pregunta = respuesta.pregunta.codigo
        valor_respuesta = respuesta.valor
        
        if codigo_pregunta == 'antecedentes_enfermedades_cronicas':
            return TriageFlowHelper.manejar_flujo_enfermedades_cronicas(respuesta)
        
        if codigo_pregunta.startswith('sintoma_relacionado_') and codigo_pregunta != 'sintoma_relacionado_con_enfermedad_cronica':
            return TriageFlowHelper.manejar_sintoma_enfermedad_especifica(respuesta)
        
        siguiente_codigo = TriageFlowHelper.obtener_siguiente_codigo(codigo_pregunta, valor_respuesta)
        
        if siguiente_codigo == "DINAMICO_SIGUIENTE_ENFERMEDAD":
            return self._manejar_flujo_dinamico_enfermedades(respuesta)
        
        return TriageFlowHelper.buscar_pregunta_por_codigo(siguiente_codigo)
    
    def _manejar_flujo_dinamico_enfermedades(self, respuesta):
        """
        Maneja el flujo dinámico cuando se ha completado el flujo específico de una enfermedad.
        """
        siguiente_enfermedad = TriageFlowHelper.obtener_siguiente_enfermedad_a_evaluar(respuesta)
        
        if siguiente_enfermedad:
            return siguiente_enfermedad
        
        enfermedades_originales = EnfermedadEvaluationHelper.obtener_enfermedades_de_sesion(respuesta.sesion)
        enfermedades_evaluadas = EnfermedadEvaluationHelper.obtener_enfermedades_evaluadas(respuesta.sesion)
        enfermedades_pendientes = [e for e in enfermedades_originales if e not in enfermedades_evaluadas]
        
        if enfermedades_pendientes:
            siguiente_enfermedad = EnfermedadEvaluationHelper.obtener_primera_enfermedad_a_evaluar(enfermedades_pendientes)
            return TriageFlowHelper.buscar_pregunta_por_codigo(siguiente_enfermedad)
        
        if EnfermedadEvaluationHelper.se_completo_flujo_especifico(respuesta.sesion):
            return None
        
        return TriageFlowHelper.buscar_pregunta_por_codigo("antecedentes_alergias")
    
    def determinar_nivel_triage(self, sesion):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        Para múltiples enfermedades crónicas, selecciona el ESI más crítico (menor número).
        """
        return TriageEvaluationHelper.determinar_nivel_triage(sesion)

class CargarPreguntas(APIView):
    """
    API para cargar preguntas iniciales desde el módulo utils.preguntas
    """
    permission_classes = [IsAdminUser]
    
    def post(self, request, format=None):
        try:
            # Cargar las preguntas desde el diccionario PREGUNTAS
            for codigo, datos in PREGUNTAS.items():
                Pregunta.objects.update_or_create(
                    codigo=codigo,
                    defaults={
                        'texto': datos.get('texto', ''),
                        'tipo': datos.get('tipo', 'text'),
                        'opciones': datos.get('opciones', None),
                    }
                )
            
            return Response({
                'exito': True,
                'mensaje': f'Se han cargado las preguntas exitosamente'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'exito': False,
                'mensaje': 'Error interno del servidor',
                'error': f'Error al cargar preguntas: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)