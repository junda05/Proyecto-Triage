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
        fields = ['id', 'pregunta', 'valor', 'timestamp', 'pregunta_siguiente']
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
            raise serializers.ValidationError(f"La respuesta debe ser una de las opciones: {pregunta.opciones}")
            
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
        fields = ['sesion', 'pregunta', 'valor']
