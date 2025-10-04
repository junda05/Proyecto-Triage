"""
Utilidades para la evaluación y determinación de niveles de triage ESI.
"""
from .preguntas import REGLAS_ESI


class TriageEvaluationHelper:
    """
    Clase auxiliar para centralizar la lógica de evaluación de niveles de triage ESI.
    """
    
    @classmethod
    def determinar_nivel_triage(cls, sesion):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        Para múltiples enfermedades crónicas, selecciona el ESI más crítico (menor número).
        """
        respuestas_dict = cls._obtener_respuestas_dict(sesion)
        contexto_paciente = cls._obtener_contexto_paciente(sesion, respuestas_dict)
        
        niveles_esi_encontrados = []
        
        # Evaluar reglas ESI por orden de prioridad
        for regla in REGLAS_ESI:
            if cls._evaluar_regla_esi(regla, respuestas_dict, contexto_paciente):
                niveles_esi_encontrados.append(regla["nivel_esi"])
        
        # Si se encontraron múltiples niveles ESI, seleccionar el más crítico (menor número)
        if niveles_esi_encontrados:
            return min(niveles_esi_encontrados)
        
        # Nivel por defecto si ninguna regla aplica
        return 5
    
    @classmethod
    def _obtener_respuestas_dict(cls, sesion):
        """Obtiene las respuestas de la sesión en formato diccionario."""
        from triage.models import Respuesta  # Import local para evitar circular
        
        respuestas = Respuesta.objects.filter(sesion=sesion)
        return {resp.pregunta.codigo: resp.valor for resp in respuestas}
    
    @classmethod
    def _obtener_contexto_paciente(cls, sesion, respuestas_dict):
        """Obtiene el contexto del paciente (embarazo, edad, etc.)."""
        es_embarazada = respuestas_dict.get('embarazo') in ['Sí', 'Si', True, 'True']
        es_adulto_mayor = sesion.paciente.edad > 65
        
        return {
            'es_embarazada': es_embarazada,
            'es_adulto_mayor': es_adulto_mayor
        }
    
    @classmethod
    def _evaluar_regla_esi(cls, regla, respuestas_dict, contexto_paciente):
        """Evalúa si una regla ESI se cumple con las respuestas dadas."""
        # Verificar si la regla aplica al contexto del paciente
        if not cls._regla_aplica_al_contexto(regla, contexto_paciente):
            return False
        
        # Evaluar todas las condiciones de la regla
        return all(
            cls._evaluar_condicion(condicion, respuestas_dict)
            for condicion in regla["condiciones"]
        )
    
    @classmethod
    def _regla_aplica_al_contexto(cls, regla, contexto_paciente):
        """Verifica si una regla aplica al contexto específico del paciente."""
        regla_es_embarazo = cls._es_regla_de_embarazo(regla)
        regla_es_adulto_mayor = cls._es_regla_de_adulto_mayor(regla)
        
        # Saltar reglas de embarazo si no está embarazada
        if regla_es_embarazo and not contexto_paciente['es_embarazada']:
            return False
        
        # Saltar reglas de adulto mayor si no es adulto mayor
        if regla_es_adulto_mayor and not contexto_paciente['es_adulto_mayor']:
            return False
        
        return True
    
    @classmethod
    def _es_regla_de_embarazo(cls, regla):
        """Verifica si es una regla específica para embarazadas."""
        return any('embarazo' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    @classmethod
    def _es_regla_de_adulto_mayor(cls, regla):
        """Verifica si es una regla específica para adultos mayores."""
        return any('adulto_mayor' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    @classmethod
    def _evaluar_condicion(cls, condicion, respuestas_dict):
        """Evalúa una condición específica de una regla ESI."""
        pregunta_codigo = condicion["pregunta"]
        valor_esperado = condicion["valor"]
        operador = condicion.get("operador", "==")  # Operador por defecto es igualdad
        
        # Si la pregunta no fue respondida, la condición no se cumple
        if pregunta_codigo not in respuestas_dict:
            return False
        
        valor_respuesta = respuestas_dict[pregunta_codigo]
        
        # Comparar valores según el operador
        return cls._comparar_valores_con_operador(valor_respuesta, valor_esperado, operador)
    
    @classmethod
    def _comparar_valores_con_operador(cls, valor_respuesta, valor_esperado, operador):
        """Compara el valor de la respuesta con el valor esperado usando el operador especificado."""
        if operador == "==":
            # Comparación de igualdad (comportamiento original)
            if isinstance(valor_esperado, list):
                return cls._comparar_con_lista(valor_respuesta, valor_esperado)
            else:
                return valor_respuesta == valor_esperado
        elif operador == "in":
            # Verificar si el valor está en la lista esperada
            if isinstance(valor_esperado, list):
                try:
                    return float(valor_respuesta) in [float(x) for x in valor_esperado]
                except (ValueError, TypeError):
                    return valor_respuesta in valor_esperado
            else:
                return valor_respuesta == valor_esperado
        elif operador == ">=":
            # Mayor o igual (para valores numéricos)
            try:
                return float(valor_respuesta) >= float(valor_esperado)
            except (ValueError, TypeError):
                return False
        elif operador == "<=":
            # Menor o igual (para valores numéricos)
            try:
                return float(valor_respuesta) <= float(valor_esperado)
            except (ValueError, TypeError):
                return False
        elif operador == ">":
            # Mayor que (para valores numéricos)
            try:
                return float(valor_respuesta) > float(valor_esperado)
            except (ValueError, TypeError):
                return False
        elif operador == "<":
            # Menor que (para valores numéricos)
            try:
                return float(valor_respuesta) < float(valor_esperado)
            except (ValueError, TypeError):
                return False
        else:
            # Operador no reconocido, usar igualdad por defecto
            return valor_respuesta == valor_esperado
    
    @classmethod
    def _comparar_con_lista(cls, valor_respuesta, valor_esperado):
        """Compara un valor de respuesta con una lista de valores esperados."""
        if isinstance(valor_respuesta, list):
            # Respuesta múltiple: al menos un valor debe coincidir
            return any(val in valor_esperado for val in valor_respuesta)
        else:
            # Respuesta simple: debe estar en la lista
            return valor_respuesta in valor_esperado
