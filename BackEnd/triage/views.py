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
        codigo_pregunta_actual = respuesta.pregunta.codigo
        valor_respuesta = respuesta.valor
        
        # Manejo específico para el flujo de embarazo
        if codigo_pregunta_actual == 'embarazo':
            if valor_respuesta in ['Sí', 'Si', True, 'True']:
                try:
                    return Pregunta.objects.get(codigo='semanas_embarazo')
                except Pregunta.DoesNotExist:
                    pass
            else:
                # Si no está embarazada, seguir con el flujo normal
                try:
                    return Pregunta.objects.get(codigo='antecedentes')
                except Pregunta.DoesNotExist:
                    pass
                
        elif codigo_pregunta_actual == 'semanas_embarazo':
            try:
                return Pregunta.objects.get(codigo='sintomas_graves_embarazo_ESI1')
            except Pregunta.DoesNotExist:
                pass
                
        elif codigo_pregunta_actual == 'sintomas_graves_embarazo_ESI1':
            if valor_respuesta == 'Ninguna de las anteriores':
                try:
                    return Pregunta.objects.get(codigo='sintomas_moderados_embarazo_ESI23')
                except Pregunta.DoesNotExist:
                    pass
            else:
                # Si presenta síntomas graves, asignar ESI 1 y finalizar triage
                # Estos síntomas requieren atención inmediata
                sintomas_esi1 = [
                    "Sangrado vaginal abundante o con coágulos",
                    "Dolor abdominal intenso o persistente", 
                    "Pérdida súbita de líquido por vagina",
                    "Fiebre alta con escalofríos",
                    "Mareo intenso o pérdida de conciencia",
                    "Movimientos fetales ausentes",
                    "Convulsiones o visión borrosa"
                ]
                if valor_respuesta in sintomas_esi1:
                    # Finalizar triage - ESI 1 ya asignado por reglas
                    return None
                # Para otros síntomas, continuar flujo normal
                try:
                    return Pregunta.objects.get(codigo='antecedentes')
                except Pregunta.DoesNotExist:
                    pass
                
        elif codigo_pregunta_actual == 'sintomas_moderados_embarazo_ESI23':
            if valor_respuesta == 'Ninguna de las anteriores':
                try:
                    return Pregunta.objects.get(codigo='sintomas_leves_embarazo_ESI45')
                except Pregunta.DoesNotExist:
                    pass
            else:
                # Clasificar según el tipo de síntoma y finalizar si corresponde
                sintomas_esi2 = [
                    "Disminución de movimientos fetales",
                    "Náuseas o vómitos persistentes", 
                    "Presión alta conocida o sospechada"
                ]
                sintomas_esi3 = [
                    "Sangrado vaginal leve o manchado",
                    "Dolor abdominal leve o intermitente",
                    "Dolor de cabeza fuerte sin otros síntomas"
                ]
                
                if valor_respuesta in sintomas_esi2 or valor_respuesta in sintomas_esi3:
                    # Finalizar triage - ESI 2 o 3 ya asignado por reglas
                    return None
                # Para otros síntomas, continuar flujo normal
                try:
                    return Pregunta.objects.get(codigo='antecedentes')
                except Pregunta.DoesNotExist:
                    pass
                
        elif codigo_pregunta_actual == 'sintomas_leves_embarazo_ESI45':
            # Evaluar síntomas leves y finalizar si hay clasificación ESI
            sintomas_esi4 = [
                "Flujo vaginal sin mal olor ni coloración anormal",
                "Dolor lumbar leve"
            ]
            sintomas_esi5 = [
                "Náuseas leves o vómitos ocasionales",
                "Fatiga o somnolencia"
            ]
            
            if valor_respuesta in sintomas_esi4 or valor_respuesta in sintomas_esi5:
                # Finalizar triage - ESI 4 o 5 ya asignado por reglas
                return None
            # Para otros síntomas, continuar flujo normal
            try:
                return Pregunta.objects.get(codigo='antecedentes')
            except Pregunta.DoesNotExist:
                pass
        
        # Continuar con la lógica existente para otras preguntas
        if codigo_pregunta_actual not in FLUJO_PREGUNTAS:
            return None
            
        # Obtener regla de flujo para esta pregunta
        regla_flujo = FLUJO_PREGUNTAS[codigo_pregunta_actual]
        
        # Determinar el siguiente código de pregunta
        siguiente_codigo = None
        
        # Si valor_respuesta coincide con alguna clave específica en la regla
        if isinstance(valor_respuesta, (str, bool)) and str(valor_respuesta) in regla_flujo:
            siguiente_codigo = regla_flujo[str(valor_respuesta)]
        # Si hay un valor por defecto en la regla
        elif "default" in regla_flujo:
            siguiente_codigo = regla_flujo["default"]
        # Si hay un valor "siguiente" genérico
        elif "siguiente" in regla_flujo:
            siguiente_codigo = regla_flujo["siguiente"]
        
        # Si encontramos un siguiente código, buscar la pregunta correspondiente
        if siguiente_codigo:
            try:
                return Pregunta.objects.get(codigo=siguiente_codigo)
            except Pregunta.DoesNotExist:
                return None
        
        return None
    
    def determinar_nivel_triage(self, sesion):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        """
        # Obtener todas las respuestas de la sesión
        respuestas = Respuesta.objects.filter(sesion=sesion)
        
        # Convertir respuestas a un diccionario para fácil acceso
        respuestas_dict = {resp.pregunta.codigo: resp.valor for resp in respuestas}
        
        # Verificar si es una paciente embarazada
        es_embarazada = respuestas_dict.get('embarazo') in ['Sí', 'Si', True, 'True']
        
        # Verificar si es un adulto mayor (>65 años)
        es_adulto_mayor = sesion.paciente.edad > 65
        
        # Evaluar cada regla ESI - las reglas de embarazo y adulto mayor tienen prioridad
        for regla in REGLAS_ESI:
            condiciones_cumplidas = True
            
            # Para reglas de embarazo, verificar que la paciente esté embarazada
            regla_es_embarazo = any('embarazo' in condicion.get('pregunta', '') for condicion in regla["condiciones"])
            
            if regla_es_embarazo and not es_embarazada:
                continue  # Saltar reglas de embarazo si no está embarazada
            
            # Para reglas de adultos mayores, verificar que el paciente tenga >65 años
            regla_es_adulto_mayor = any('adulto_mayor' in condicion.get('pregunta', '') for condicion in regla["condiciones"])
            
            if regla_es_adulto_mayor and not es_adulto_mayor:
                continue  # Saltar reglas de adulto mayor si no tiene >65 años
            
            for condicion in regla["condiciones"]:
                pregunta_codigo = condicion["pregunta"]
                valor_esperado = condicion["valor"]
                
                # Si la pregunta no fue respondida, la condición no se cumple
                if pregunta_codigo not in respuestas_dict:
                    condiciones_cumplidas = False
                    break
                
                valor_respuesta = respuestas_dict[pregunta_codigo]
                
                # Comparar el valor de la respuesta con el valor esperado
                if isinstance(valor_esperado, list):
                    # Para listas (multi_choice), verificar si algún valor coincide
                    if isinstance(valor_respuesta, list):
                        if not any(val in valor_esperado for val in valor_respuesta):
                            condiciones_cumplidas = False
                            break
                    else:
                        if valor_respuesta not in valor_esperado:
                            condiciones_cumplidas = False
                            break
                else:
                    # Para valores simples, comparación directa
                    if valor_respuesta != valor_esperado:
                        condiciones_cumplidas = False
                        break
            
            # Si todas las condiciones se cumplen, retornar el nivel ESI de esta regla
            if condiciones_cumplidas:
                return regla["nivel_esi"]
        
        # Si ninguna regla aplica, retornar nivel por defecto (5 - menos urgente)
        return 5

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