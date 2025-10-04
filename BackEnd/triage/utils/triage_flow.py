"""
Utilidades para la gestión del flujo de preguntas del triage.
"""
from .preguntas import FLUJO_PREGUNTAS
from .enfermedad_helpers import EnfermedadEvaluationHelper


class TriageFlowHelper:
    """
    Clase auxiliar para centralizar la lógica de flujo de preguntas del triage.
    """
    
    @classmethod
    def determinar_primera_pregunta(cls, paciente):
        """
        Determina la primera pregunta según la edad y sexo del paciente
        """
        from triage.models import Pregunta  # Import local para evitar circular
        
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
                return Pregunta.objects.get(codigo=primera_pregunta_codigo)
            except Pregunta.DoesNotExist:
                # Fallback: usar cirugias_previas como primera pregunta
                try:
                    return Pregunta.objects.get(codigo="cirugias_previas")
                except Pregunta.DoesNotExist:
                    return None
        else:
            # Fallback: usar cirugias_previas como primera pregunta
            try:
                return Pregunta.objects.get(codigo="cirugias_previas")
            except Pregunta.DoesNotExist:
                return None
    
    @classmethod
    def obtener_siguiente_codigo(cls, codigo_pregunta, valor_respuesta):
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
        return (cls._buscar_por_valor_exacto(regla_flujo, valor_respuesta) or
                cls._buscar_por_siguiente(regla_flujo))
    
    @classmethod
    def _buscar_por_valor_exacto(cls, regla_flujo, valor_respuesta):
        """Busca coincidencia exacta con el valor de la respuesta."""
        # Si valor_respuesta es una lista, buscar cada elemento individualmente
        if isinstance(valor_respuesta, list):
            for valor in valor_respuesta:
                if valor in regla_flujo:
                    return regla_flujo.get(valor)
            return None
                
        # Si es un valor simple, buscar directamente
        # Solo aceptar el valor original (boolean, string, etc.) sin conversiones
        if valor_respuesta in regla_flujo:
            return regla_flujo.get(valor_respuesta)
        
        return None
    
    @classmethod
    def _buscar_por_siguiente(cls, regla_flujo):
        """Busca la regla siguiente genérica."""
        return regla_flujo.get("siguiente")
    
    @classmethod
    def buscar_pregunta_por_codigo(cls, codigo):
        """Busca una pregunta por su código."""
        from triage.models import Pregunta  # Import local para evitar circular
        
        if not codigo:
            return None
        
        try:
            return Pregunta.objects.get(codigo=codigo)
        except Pregunta.DoesNotExist:
            return None
    
    @classmethod
    def manejar_flujo_enfermedades_cronicas(cls, respuesta):
        """
        Maneja el flujo específico cuando el usuario selecciona enfermedades crónicas.
        Determina cuál es la primera pregunta específica a hacer basada en las enfermedades seleccionadas.
        """
        valor_respuesta = respuesta.valor
        
        # Si no seleccionó ninguna enfermedad crónica, ir a alergias
        # Verificar tanto si viene como string o como lista con "Ninguna de las anteriores"
        if (not valor_respuesta or 
            valor_respuesta == "Ninguna de las anteriores" or
            (isinstance(valor_respuesta, list) and ("Ninguna de las anteriores" in valor_respuesta or len(valor_respuesta) == 0))):
            return cls.buscar_pregunta_por_codigo("antecedentes_alergias")
        
        # Si seleccionó cáncer, ir al flujo específico de cáncer
        if isinstance(valor_respuesta, list) and "Cáncer" in valor_respuesta:
            return cls.buscar_pregunta_por_codigo("esta_en_tratamiento")
        elif isinstance(valor_respuesta, str) and valor_respuesta == "Cáncer":
            return cls.buscar_pregunta_por_codigo("esta_en_tratamiento")
        
        # Almacenar las enfermedades seleccionadas para el flujo secuencial
        enfermedades_seleccionadas = EnfermedadEvaluationHelper.obtener_enfermedades_seleccionadas(valor_respuesta)
        respuesta.informacion_adicional = ','.join(enfermedades_seleccionadas)
        respuesta.save()
        
        # Obtener la primera enfermedad a evaluar
        primera_enfermedad = EnfermedadEvaluationHelper.obtener_primera_enfermedad_a_evaluar(enfermedades_seleccionadas)
        return cls.buscar_pregunta_por_codigo(primera_enfermedad)
    
    @classmethod
    def manejar_sintoma_enfermedad_especifica(cls, respuesta):
        """
        Maneja el flujo cuando se responde sobre síntomas de enfermedades específicas.
        """
        codigo_pregunta = respuesta.pregunta.codigo
        valor_respuesta = respuesta.valor
        
        nombre_enfermedad = codigo_pregunta.replace('sintoma_relacionado_', '')
        enfermedades_seleccionadas = EnfermedadEvaluationHelper.obtener_enfermedades_de_sesion(respuesta.sesion)
        
        if nombre_enfermedad not in enfermedades_seleccionadas:
            return cls.obtener_siguiente_enfermedad_a_evaluar(respuesta)
        
        if valor_respuesta is True:
            siguiente_codigo = cls.obtener_siguiente_codigo(codigo_pregunta, valor_respuesta)
            return cls.buscar_pregunta_por_codigo(siguiente_codigo)
        
        return cls.obtener_siguiente_enfermedad_a_evaluar(respuesta)
    
    @classmethod
    def obtener_siguiente_enfermedad_a_evaluar(cls, respuesta):
        """
        Determina cuál es la siguiente enfermedad a evaluar basada en las enfermedades 
        seleccionadas originalmente y cuáles ya se han evaluado completamente.
        """
        enfermedades_originales = EnfermedadEvaluationHelper.obtener_enfermedades_de_sesion(respuesta.sesion)
        enfermedades_evaluadas = EnfermedadEvaluationHelper.obtener_enfermedades_evaluadas(respuesta.sesion)
        enfermedades_pendientes = [e for e in enfermedades_originales if e not in enfermedades_evaluadas]
        
        if enfermedades_pendientes:
            siguiente_enfermedad = EnfermedadEvaluationHelper.obtener_primera_enfermedad_a_evaluar(enfermedades_pendientes)
            return cls.buscar_pregunta_por_codigo(siguiente_enfermedad)
        
        if not EnfermedadEvaluationHelper.se_completo_flujo_especifico(respuesta.sesion):
            return cls.buscar_pregunta_por_codigo("antecedentes_alergias")
        
        return None
