from rest_framework import serializers
from .models import SesionTriage, Pregunta, Respuesta
from pacientes.serializers import PacienteSerializer
import re

class PreguntaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pregunta
        fields = '__all__'

class ValidacionRespuestasBase:
    def validate_respuesta(self, data):
        """Validar que el valor de la respuesta coincida con el tipo de pregunta."""
        pregunta = data['pregunta']
        valor = data['valor']
        
        # Si pregunta es un string, obtener la instancia
        if isinstance(pregunta, str):
            try:
                pregunta = Pregunta.objects.get(codigo=pregunta)
            except Pregunta.DoesNotExist:
                raise serializers.ValidationError(f"La pregunta con código '{pregunta}' no existe.")
        
        # Boolean
        if pregunta.tipo == 'boolean':
            if not isinstance(valor, bool):
                raise serializers.ValidationError("La respuesta debe ser un valor booleano (true/false)")
        
        # Numérico
        if pregunta.tipo == 'numeric' and not (isinstance(valor, (int, float)) or str(valor).isdigit()):
            raise serializers.ValidationError("La respuesta debe ser un valor numérico")
        
        # Escala
        if pregunta.tipo == 'scale':
            if not isinstance(valor, (int, float)):
                raise serializers.ValidationError("La respuesta de escala debe ser un valor numérico")
            if pregunta.opciones:
                min_val, max_val = min(pregunta.opciones), max(pregunta.opciones)
                if valor < min_val or valor > max_val:
                    raise serializers.ValidationError(f"La respuesta debe estar entre {min_val} y {max_val}")
        
        # Opción única
        if pregunta.tipo == 'choice' and valor not in pregunta.opciones:
            raise serializers.ValidationError(f"La respuesta debe ser una de las opciones válidas: {', '.join(pregunta.opciones)}")
        
        # Texto
        if pregunta.tipo == 'text':
            if not isinstance(valor, str):
                raise serializers.ValidationError("La respuesta debe ser texto")
            if len(valor.strip()) == 0:
                raise serializers.ValidationError("La respuesta de texto no puede estar vacía")
            if len(valor) > 1000:
                raise serializers.ValidationError("La respuesta no puede exceder los 1000 caracteres")
            if re.search(r'[<>"\']', valor):
                raise serializers.ValidationError("La respuesta contiene caracteres no permitidos")
        
        # Validación extra para choice con "Otro"
        if pregunta.tipo == 'choice':
            if isinstance(valor, str) and "Otro (especificar)" in valor and not data.get('informacion_adicional'):
                raise serializers.ValidationError("Debe especificar la información adicional cuando selecciona 'Otro (especificar)'")
        
        # Opción múltiple
        if pregunta.tipo == 'multi_choice':
            if not isinstance(valor, list):
                raise serializers.ValidationError("La respuesta debe ser una lista de opciones")
            if len(valor) == 0:
                raise serializers.ValidationError("Debe seleccionar al menos una opción")
            for v in valor:
                if v not in pregunta.opciones:
                    raise serializers.ValidationError(f"La opción '{v}' no es válida. Opciones válidas: {', '.join(pregunta.opciones)}")
            if "Otro (especificar)" in valor and not data.get('informacion_adicional'):
                raise serializers.ValidationError("Debe especificar la información adicional cuando selecciona 'Otro (especificar)'")
        
        return data

class RespuestaCreateSerializer(ValidacionRespuestasBase, serializers.ModelSerializer):
    pregunta = serializers.CharField()  # Aceptar código de pregunta como string
    
    class Meta:
        model = Respuesta
        fields = ['sesion', 'pregunta', 'valor', 'informacion_adicional']
    
    def validate_pregunta(self, value):
        """Validar que el código de pregunta existe y convertirlo a instancia."""
        try:
            pregunta = Pregunta.objects.get(codigo=value)
            return pregunta
        except Pregunta.DoesNotExist:
            raise serializers.ValidationError(f"La pregunta con código '{value}' no existe.")
    
    def validate(self, data):
        # La pregunta ya está convertida a instancia por validate_pregunta
        return self.validate_respuesta(data)
    
    def create(self, validated_data):
        """Crear la respuesta con la pregunta ya validada."""
        return super().create(validated_data)
    
class RespuestaSerializer(ValidacionRespuestasBase, serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'pregunta', 'valor', 'informacion_adicional', 'timestamp', 'pregunta_siguiente']
        read_only_fields = ['id', 'timestamp', 'pregunta_siguiente']
    
    def validate(self, data):
        return self.validate_respuesta(data)

class SesionTriageSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)
    paciente_detail = PacienteSerializer(source='paciente', read_only=True)
    
    class Meta:
        model = SesionTriage
        fields = ['id', 'paciente', 'paciente_detail', 'fecha_inicio', 'fecha_fin', 'nivel_triage', 'completado', 'respuestas']
        read_only_fields = ['id', 'fecha_inicio', 'fecha_fin']