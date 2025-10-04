"""
Utilidades para el manejo y evaluación de enfermedades crónicas en el sistema de triage.
"""
from .preguntas import FLUJO_PREGUNTAS


class EnfermedadEvaluationHelper:
    """
    Clase auxiliar para centralizar la lógica de evaluación de enfermedades crónicas.
    """
    # Mapeo de nombres de enfermedades a códigos de preguntas
    MAPEO_ENFERMEDADES = {
        "Diabetes 1/2": "diabetes",
        "Asma": "asma", 
        "Accidente cerebrovascular (ACV)": "acv",
        "Insuficiencia cardíaca": "insuficiencia_cardiaca",
        "Fibromialgia": "fibromialgia",
        "Hipertensión arterial": "hipertension",
        "Enfermedad coronaria": "enfermedad_coronaria",
        "Enfermedad pulmonar obstructiva crónica (EPOC)": "epoc"
    }
    
    # Orden de prioridad de evaluación
    ORDEN_EVALUACION = [
        "diabetes", "asma", "acv", "insuficiencia_cardiaca", 
        "fibromialgia", "hipertension", "enfermedad_coronaria", "epoc"
    ]
    
    # Mapeo de prefijos de preguntas específicas por enfermedad
    PREFIJOS_POR_ENFERMEDAD = {
        'diabetes': 'diabetes_',
        'asma': 'asma_',
        'acv': 'acv_',
        'insuficiencia_cardiaca': 'ic_',
        'fibromialgia': 'fm_',
        'hipertension': 'hta_',
        'enfermedad_coronaria': 'ec_',
        'epoc': 'epoc_'
    }
    
    @classmethod
    def obtener_enfermedades_seleccionadas(cls, valor_respuesta):
        """
        Extrae las enfermedades crónicas seleccionadas (excluyendo cáncer).
        """
        enfermedades_seleccionadas = []
        if isinstance(valor_respuesta, list):
            for enfermedad in valor_respuesta:
                if enfermedad in cls.MAPEO_ENFERMEDADES:
                    enfermedades_seleccionadas.append(cls.MAPEO_ENFERMEDADES[enfermedad])
        elif isinstance(valor_respuesta, str) and valor_respuesta in cls.MAPEO_ENFERMEDADES:
            enfermedades_seleccionadas.append(cls.MAPEO_ENFERMEDADES[valor_respuesta])
        
        return enfermedades_seleccionadas
    
    @classmethod
    def obtener_primera_enfermedad_a_evaluar(cls, enfermedades_seleccionadas):
        """
        Obtiene la primera enfermedad a evaluar según el orden de prioridad.
        """
        for enfermedad in cls.ORDEN_EVALUACION:
            if enfermedad in enfermedades_seleccionadas:
                return f'sintoma_relacionado_{enfermedad}'
        return None
    
    @classmethod
    def obtener_enfermedades_de_sesion(cls, sesion):
        """
        Obtiene las enfermedades crónicas originalmente seleccionadas en la sesión.
        """
        from triage.models import Respuesta  # Import local para evitar circular
        
        try:
            # Buscar la respuesta de enfermedades crónicas
            respuesta_enfermedades = Respuesta.objects.get(
                sesion=sesion, 
                pregunta__codigo='antecedentes_enfermedades_cronicas'
            )
            
            if respuesta_enfermedades.informacion_adicional:
                return respuesta_enfermedades.informacion_adicional.split(',')
            
            return cls.obtener_enfermedades_seleccionadas(respuesta_enfermedades.valor)
            
        except Respuesta.DoesNotExist:
            return []
    
    @classmethod
    def obtener_enfermedades_evaluadas(cls, sesion):
        """
        Obtiene las enfermedades que ya han sido completamente evaluadas.
        Una enfermedad se considera completamente evaluada si se respondió 
        la pregunta de síntomas relacionados.
        """
        from triage.models import Respuesta
        
        enfermedades_evaluadas = []
        respuestas = Respuesta.objects.filter(sesion=sesion)
        
        for enfermedad, prefijo in cls.PREFIJOS_POR_ENFERMEDAD.items():
            pregunta_sintoma = f'sintoma_relacionado_{enfermedad}'
            respuesta_sintoma = respuestas.filter(pregunta__codigo=pregunta_sintoma).first()
            
            if respuesta_sintoma:
                if respuesta_sintoma.valor in [False, "False", "No", "false"]:
                    enfermedades_evaluadas.append(enfermedad)
                    continue
                
                respuestas_especificas = respuestas.filter(pregunta__codigo__startswith=prefijo)
                
                if respuestas_especificas.exists():
                    for resp in respuestas_especificas:
                        codigo = resp.pregunta.codigo
                        if (codigo.endswith('_ESI1') or codigo.endswith('_ESI2') or 
                            codigo.endswith('_ESI3') or codigo.endswith('_ESI45') or
                            cls._es_pregunta_final_flujo(codigo)):
                            enfermedades_evaluadas.append(enfermedad)
                            break
        
        return enfermedades_evaluadas
    
    @classmethod
    def _es_pregunta_final_flujo(cls, codigo_pregunta):
        """
        Determina si una pregunta es el final de un flujo específico de enfermedad.
        """
        # Verificar si la pregunta tiene "DINAMICO_SIGUIENTE_ENFERMEDAD" como siguiente
        if codigo_pregunta in FLUJO_PREGUNTAS:
            flujo = FLUJO_PREGUNTAS[codigo_pregunta]
            if isinstance(flujo, dict):
                return flujo.get("siguiente") == "DINAMICO_SIGUIENTE_ENFERMEDAD"
            return flujo == "DINAMICO_SIGUIENTE_ENFERMEDAD"
        return False
    
    @classmethod
    def se_completo_flujo_especifico(cls, sesion):
        """
        Verifica si se completó al menos un flujo específico de enfermedad
        (usuario respondió "Sí" a síntomas relacionados y siguió el flujo específico).
        """
        from triage.models import Respuesta
        
        respuestas = Respuesta.objects.filter(sesion=sesion)
        
        for enfermedad, prefijo in cls.PREFIJOS_POR_ENFERMEDAD.items():
            pregunta_sintoma = f'sintoma_relacionado_{enfermedad}'
            respuesta_sintoma = respuestas.filter(pregunta__codigo=pregunta_sintoma).first()
            
            if respuesta_sintoma and respuesta_sintoma.valor is True:
                respuestas_especificas = respuestas.filter(pregunta__codigo__startswith=prefijo)
                if respuestas_especificas.exists():
                    return True
        
        return False
