from rest_framework import serializers
from .models import SesionTriage, Pregunta, Respuesta, ReglaFlujo
from pacientes.serializers import PacienteSerializer

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = '__all__'

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'pregunta', 'valor', 'informacion_adicional', 'timestamp', 'pregunta_siguiente']
        read_only_fields = ['id', 'timestamp', 'pregunta_siguiente']
        
    def validate(self, data):
        """Validar que el valor de la respuesta coincida con el tipo de pregunta."""
        pregunta = data['pregunta']
        valor = data['valor']
        
        if pregunta.tipo == 'boolean' and not isinstance(valor, bool):
            raise serializers.ValidationError("La respuesta debe ser un valor booleano (true/false)")
        
        if pregunta.tipo == 'numeric' and not (isinstance(valor, (int, float)) or str(valor).isdigit()):
            raise serializers.ValidationError("La respuesta debe ser un valor numérico")
        
        if pregunta.tipo == 'choice' and valor not in pregunta.opciones:
            raise serializers.ValidationError(f"La respuesta debe ser una de las opciones válidas: {', '.join(pregunta.opciones)}")
        
        if pregunta.tipo == 'text':
            if not isinstance(valor, str):
                raise serializers.ValidationError("La respuesta debe ser texto")
            
            # Validar longitud mínima y máxima
            if len(valor.strip()) == 0:
                raise serializers.ValidationError("La respuesta de texto no puede estar vacía")
            
            if len(valor) > 1000:  # Límite máximo de caracteres
                raise serializers.ValidationError("La respuesta no puede exceder los 1000 caracteres")
            
            # Validar caracteres especiales peligrosos (prevención básica de XSS)
            import re
            if re.search(r'[<>"\']', valor):
                raise serializers.ValidationError("La respuesta contiene caracteres no permitidos")
        
        if pregunta.tipo == 'choice':
            # Validar que si se selecciona "Otro (especificar)", se proporcione información adicional
            if "Otro (especificar)" in valor and not data.get('informacion_adicional'):
                raise serializers.ValidationError("Debe especificar la información adicional cuando selecciona 'Otra (especificar)'")
        
        if pregunta.tipo == 'multi_choice':
            if not isinstance(valor, list):
                raise serializers.ValidationError("La respuesta debe ser una lista de opciones")
            if len(valor) == 0:
                raise serializers.ValidationError("Debe seleccionar al menos una opción")
            for v in valor:
                if v not in pregunta.opciones:
                    raise serializers.ValidationError(f"La opción '{v}' no es válida. Opciones válidas: {', '.join(pregunta.opciones)}")
            
            # Validar que si se selecciona "Otro (especificar)", se proporcione información adicional
            if "Otro (especificar)" in valor and not data.get('informacion_adicional'):
                raise serializers.ValidationError("Debe especificar la información adicional cuando selecciona 'Otra (especificar)'")
            
        return data

class SesionTriageSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)
    # paciente_detail = PacienteSerializer(source='paciente', read_only=True)
    
    class Meta:
        model = SesionTriage
        fields = ['id', 'paciente', 'fecha_inicio', 'fecha_fin', 'nivel_triage', 'completado', 'respuestas']
        read_only_fields = ['id', 'fecha_inicio', 'fecha_fin']

class ReglaFlujoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReglaFlujo
        fields = '__all__'

class RespuestaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['sesion', 'pregunta', 'valor', 'informacion_adicional']
    
    def validate(self, data):
        """Validar que el valor de la respuesta coincida con el tipo de pregunta."""
        pregunta = data['pregunta']
        valor = data['valor']
        
        if pregunta.tipo == 'boolean' and not isinstance(valor, bool):
            raise serializers.ValidationError("La respuesta debe ser un valor booleano (true/false)")
        
        if pregunta.tipo == 'numeric' and not (isinstance(valor, (int, float)) or str(valor).isdigit()):
            raise serializers.ValidationError("La respuesta debe ser un valor numérico")
        
        if pregunta.tipo == 'choice' and valor not in pregunta.opciones:
            raise serializers.ValidationError(f"La respuesta debe ser una de las opciones válidas: {', '.join(pregunta.opciones)}")
        
        if pregunta.tipo == 'text':
            if not isinstance(valor, str):
                raise serializers.ValidationError("La respuesta debe ser texto")
            
            # Validar longitud mínima y máxima
            if len(valor.strip()) == 0:
                raise serializers.ValidationError("La respuesta de texto no puede estar vacía")
            
            if len(valor) > 1000:  # Límite máximo de caracteres
                raise serializers.ValidationError("La respuesta no puede exceder los 1000 caracteres")
            
            # Validar caracteres especiales peligrosos (prevención básica de XSS)
            import re
            if re.search(r'[<>"\']', valor):
                raise serializers.ValidationError("La respuesta contiene caracteres no permitidos")
        
        if pregunta.tipo == 'multi_choice':
            if not isinstance(valor, list):
                raise serializers.ValidationError("La respuesta debe ser una lista de opciones")
            if len(valor) == 0:
                raise serializers.ValidationError("Debe seleccionar al menos una opción")
            for v in valor:
                if v not in pregunta.opciones:
                    raise serializers.ValidationError(f"La opción '{v}' no es válida. Opciones válidas: {', '.join(pregunta.opciones)}")
            
            # Validar que si se selecciona "Otra (especificar)", se proporcione información adicional
            if "Otra (especificar)" in valor and not data.get('informacion_adicional'):
                raise serializers.ValidationError("Debe especificar la información adicional cuando selecciona 'Otra (especificar)'")
            
        return data
