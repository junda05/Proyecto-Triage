from django.utils import timezone
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SesionTriage, Pregunta, Respuesta, ReglaFlujo
from .serializers import SesionTriageSerializer, PreguntaSerializer, RespuestaSerializer, RespuestaCreateSerializer
from utils.preguntas import PREGUNTAS, FLUJO_PREGUNTAS, REGLAS_ESI
from pacientes.models import Paciente

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

class SesionTriageListView(generics.ListCreateAPIView):
    """
    API para listar y crear sesiones de triage
    """
    queryset = SesionTriage.objects.all()
    serializer_class = SesionTriageSerializer
    
    def perform_create(self, serializer):
        serializer.save(fecha_inicio=timezone.now())

class SesionTriageDetailView(generics.RetrieveUpdateAPIView):
    """
    API para consultar y actualizar una sesión específica
    """
    queryset = SesionTriage.objects.all()
    serializer_class = SesionTriageSerializer

class RespuestaCreate(generics.CreateAPIView):
    """
    API para registrar una respuesta y obtener la siguiente pregunta
    """
    serializer_class = RespuestaCreateSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
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
                'respuesta': RespuestaSerializer(respuesta).data,
                'siguiente_pregunta': PreguntaSerializer(siguiente_pregunta).data
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
                'respuesta': RespuestaSerializer(respuesta).data,
                'mensaje': 'Triage completado',
                'nivel_triage': sesion.nivel_triage
            }, status=status.HTTP_201_CREATED)
    
    def determinar_siguiente_pregunta(self, respuesta):
        """
        Determina la siguiente pregunta basada en la respuesta actual
        y las reglas de flujo definidas en FLUJO_PREGUNTAS.
        """
        codigo_pregunta = respuesta.pregunta.codigo
        valor_respuesta = respuesta.valor
        
        # Obtener el código de la siguiente pregunta
        siguiente_codigo = self._obtener_siguiente_codigo(codigo_pregunta, valor_respuesta)
        
        # Buscar y retornar la pregunta correspondiente
        return self._buscar_pregunta_por_codigo(siguiente_codigo)
    
    def _obtener_siguiente_codigo(self, codigo_pregunta, valor_respuesta):
        """
        Obtiene el código de la siguiente pregunta según las reglas de flujo.
        """
        if codigo_pregunta not in FLUJO_PREGUNTAS:
            return None
            
        regla_flujo = FLUJO_PREGUNTAS[codigo_pregunta]
        
        # Si la regla es simple (string), retornarla directamente
        if not isinstance(regla_flujo, dict):
            return regla_flujo
        
        # Buscar siguiente pregunta por prioridad
        return (self._buscar_por_valor_exacto(regla_flujo, valor_respuesta) or
                self._buscar_por_default(regla_flujo) or
                self._buscar_por_siguiente(regla_flujo))
    
    def _buscar_por_valor_exacto(self, regla_flujo, valor_respuesta):
        """Busca coincidencia exacta con el valor de la respuesta."""
        return regla_flujo.get(str(valor_respuesta))
    
    def _buscar_por_default(self, regla_flujo):
        """Busca la regla por defecto."""
        return regla_flujo.get("default")
    
    def _buscar_por_siguiente(self, regla_flujo):
        """Busca la regla siguiente genérica."""
        return regla_flujo.get("siguiente")
    
    def _buscar_pregunta_por_codigo(self, codigo):
        """Busca una pregunta por su código."""
        if not codigo:
            return None
        
        try:
            return Pregunta.objects.get(codigo=codigo)
        except Pregunta.DoesNotExist:
            return None
    
    def determinar_nivel_triage(self, sesion):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        """
        respuestas_dict = self._obtener_respuestas_dict(sesion)
        contexto_paciente = self._obtener_contexto_paciente(sesion, respuestas_dict)
        
        # Evaluar reglas ESI por orden de prioridad
        for regla in REGLAS_ESI:
            if self._evaluar_regla_esi(regla, respuestas_dict, contexto_paciente):
                return regla["nivel_esi"]
        
        # Nivel por defecto si ninguna regla aplica
        return 5
    
    def _obtener_respuestas_dict(self, sesion):
        """Obtiene las respuestas de la sesión en formato diccionario."""
        respuestas = Respuesta.objects.filter(sesion=sesion)
        return {resp.pregunta.codigo: resp.valor for resp in respuestas}
    
    def _obtener_contexto_paciente(self, sesion, respuestas_dict):
        """Obtiene el contexto del paciente (embarazo, edad, etc.)."""
        es_embarazada = respuestas_dict.get('embarazo') in ['Sí', 'Si', True, 'True']
        es_adulto_mayor = sesion.paciente.edad > 65
        
        return {
            'es_embarazada': es_embarazada,
            'es_adulto_mayor': es_adulto_mayor
        }
    
    def _evaluar_regla_esi(self, regla, respuestas_dict, contexto_paciente):
        """Evalúa si una regla ESI se cumple con las respuestas dadas."""
        # Verificar si la regla aplica al contexto del paciente
        if not self._regla_aplica_al_contexto(regla, contexto_paciente):
            return False
        
        # Evaluar todas las condiciones de la regla
        return all(
            self._evaluar_condicion(condicion, respuestas_dict)
            for condicion in regla["condiciones"]
        )
    
    def _regla_aplica_al_contexto(self, regla, contexto_paciente):
        """Verifica si una regla aplica al contexto específico del paciente."""
        regla_es_embarazo = self._es_regla_de_embarazo(regla)
        regla_es_adulto_mayor = self._es_regla_de_adulto_mayor(regla)
        
        # Saltar reglas de embarazo si no está embarazada
        if regla_es_embarazo and not contexto_paciente['es_embarazada']:
            return False
        
        # Saltar reglas de adulto mayor si no es adulto mayor
        if regla_es_adulto_mayor and not contexto_paciente['es_adulto_mayor']:
            return False
        
        return True
    
    def _es_regla_de_embarazo(self, regla):
        """Verifica si es una regla específica para embarazadas."""
        return any('embarazo' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    def _es_regla_de_adulto_mayor(self, regla):
        """Verifica si es una regla específica para adultos mayores."""
        return any('adulto_mayor' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    def _evaluar_condicion(self, condicion, respuestas_dict):
        """Evalúa una condición específica de una regla ESI."""
        pregunta_codigo = condicion["pregunta"]
        valor_esperado = condicion["valor"]
        
        # Si la pregunta no fue respondida, la condición no se cumple
        if pregunta_codigo not in respuestas_dict:
            return False
        
        valor_respuesta = respuestas_dict[pregunta_codigo]
        
        # Comparar valores según el tipo
        return self._comparar_valores(valor_respuesta, valor_esperado)
    
    def _comparar_valores(self, valor_respuesta, valor_esperado):
        """Compara el valor de la respuesta con el valor esperado."""
        if isinstance(valor_esperado, list):
            return self._comparar_con_lista(valor_respuesta, valor_esperado)
        else:
            return valor_respuesta == valor_esperado
    
    def _comparar_con_lista(self, valor_respuesta, valor_esperado):
        """Compara un valor de respuesta con una lista de valores esperados."""
        if isinstance(valor_respuesta, list):
            # Respuesta múltiple: al menos un valor debe coincidir
            return any(val in valor_esperado for val in valor_respuesta)
        else:
            # Respuesta simple: debe estar en la lista
            return valor_respuesta in valor_esperado

class IniciarTriage(APIView):
    """
    API para iniciar una nueva sesión de triage y obtener la primera pregunta
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        # Verificar que se proporcione un paciente_id
        paciente_id = request.data.get('paciente')
        if not paciente_id:
            return Response(
                {'error': 'Se requiere un paciente_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Obtener el paciente para verificar su sexo
            paciente = Paciente.objects.get(id=paciente_id)
        except Paciente.DoesNotExist:
            return Response(
                {'error': 'Paciente no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Crear nueva sesión de triage
        sesion_serializer = SesionTriageSerializer(data={'paciente': paciente_id})
        sesion_serializer.is_valid(raise_exception=True)
        sesion = sesion_serializer.save(fecha_inicio=timezone.now())
        
        # Determinar la primera pregunta según la edad y sexo del paciente
        # Prioridad 1: Adultos mayores (>65 años)
        if paciente.edad > 65:
            primera_pregunta_codigo = 'adulto_mayor_ESI1'
        # Prioridad 2: Mujeres (cualquier edad) - preguntar sobre embarazo
        elif paciente.sexo == 'F':
            primera_pregunta_codigo = 'embarazo'
        # Prioridad 3: Flujo normal para otros casos
        else:
            primera_pregunta_codigo = FLUJO_PREGUNTAS.get("inicio", None)
        
        if primera_pregunta_codigo:
            try:
                primera_pregunta = Pregunta.objects.get(codigo=primera_pregunta_codigo)
            except Pregunta.DoesNotExist:
                # Fallback: obtener la primera pregunta según el orden
                primera_pregunta = Pregunta.objects.order_by('orden').first()
        else:
            # Fallback: obtener la primera pregunta según el orden
            primera_pregunta = Pregunta.objects.order_by('orden').first()
        
        if not primera_pregunta:
            return Response(
                {'error': 'No hay preguntas definidas en el sistema'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'sesion': SesionTriageSerializer(sesion).data,
            'primera_pregunta': PreguntaSerializer(primera_pregunta).data
        }, status=status.HTTP_201_CREATED)

class CargarPreguntas(APIView):
    """
    API para cargar preguntas iniciales desde el módulo utils.preguntas
    """
    def post(self, request, format=None):
        cantidad_cargada = 0
        
        # Primero, cargar las preguntas
        for codigo, datos in PREGUNTAS.items():
            Pregunta.objects.update_or_create(
                codigo=codigo,
                defaults={
                    'texto': datos.get('texto', ''),
                    'tipo': datos.get('tipo', 'text'),
                    'opciones': datos.get('opciones', None),
                    'unidad': datos.get('unidad', None),
                    'orden': cantidad_cargada,  # Asignar orden secuencial
                }
            )
            cantidad_cargada += 1
        
        # Luego, cargar las reglas de flujo
        for origen, destinos in FLUJO_PREGUNTAS.items():
            if origen == "inicio":
                continue
                
            pregunta_origen = None
            try:
                pregunta_origen = Pregunta.objects.get(codigo=origen)
            except Pregunta.DoesNotExist:
                continue
                
            # Procesar cada regla de flujo para esta pregunta de origen
            if isinstance(destinos, dict):
                for condicion_valor, destino_codigo in destinos.items():
                    if destino_codigo and condicion_valor not in ["siguiente", "default"]:
                        try:
                            pregunta_destino = Pregunta.objects.get(codigo=destino_codigo)
                            
                            # Crear o actualizar la regla de flujo
                            ReglaFlujo.objects.update_or_create(
                                pregunta_origen=pregunta_origen,
                                condicion={"tipo": "igual", "valor": condicion_valor},
                                defaults={
                                    'pregunta_destino': pregunta_destino,
                                    'prioridad': 10,  # Prioridad predeterminada
                                }
                            )
                        except Pregunta.DoesNotExist:
                            continue
                
                # Procesar regla por defecto si existe
                if "siguiente" in destinos and destinos["siguiente"]:
                    try:
                        pregunta_destino = Pregunta.objects.get(codigo=destinos["siguiente"])
                        
                        # Crear o actualizar la regla de flujo por defecto
                        ReglaFlujo.objects.update_or_create(
                            pregunta_origen=pregunta_origen,
                            condicion={"tipo": "default"},
                            defaults={
                                'pregunta_destino': pregunta_destino,
                                'prioridad': 1,  # Baja prioridad para regla por defecto
                            }
                        )
                    except Pregunta.DoesNotExist:
                        continue
        
        return Response({
            'mensaje': f'Se han cargado {cantidad_cargada} preguntas y actualizado las reglas de flujo'
        }, status=status.HTTP_200_OK)