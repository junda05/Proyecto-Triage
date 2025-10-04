from rest_framework import serializers
from django.db.models import Count, Avg, Max, Min, Q, F
from django.utils import timezone
from datetime import datetime, timedelta
from pacientes.models import Paciente
from triage.models import SesionTriage
import numpy as np

class ReportFiltersSerializer(serializers.Serializer):
    """
    Serializer para validar filtros de reportes
    """
    fecha_inicio = serializers.DateField(required=True)
    fecha_fin = serializers.DateField(required=True)
    niveles_esi = serializers.ListField(
        child=serializers.IntegerField(min_value=1, max_value=5),
        required=False,
        allow_empty=True
    )
    estados = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    generos = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    turnos = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )
    rango_edad_min = serializers.IntegerField(required=False, min_value=0)
    rango_edad_max = serializers.IntegerField(required=False, min_value=0)

    def validate(self, data):
        if data['fecha_inicio'] > data['fecha_fin']:
            raise serializers.ValidationError(
                "La fecha de inicio no puede ser posterior a la fecha de fin"
            )
        return data

class MetricaBaseSerializer(serializers.Serializer):
    """
    Serializer base para métricas
    """
    total_pacientes = serializers.IntegerField()
    fecha_generacion = serializers.DateTimeField()
    periodo_inicio = serializers.DateField()
    periodo_fin = serializers.DateField()

class DistribucionESISerializer(serializers.Serializer):
    """
    Serializer para distribución por niveles ESI
    """
    nivel_esi = serializers.IntegerField()
    cantidad = serializers.IntegerField()
    porcentaje = serializers.FloatField()
    color = serializers.CharField()
    nombre_nivel = serializers.CharField()

class DistribucionGeneroSerializer(serializers.Serializer):
    """
    Serializer para distribución por género
    """
    genero = serializers.CharField()
    cantidad = serializers.IntegerField()
    porcentaje = serializers.FloatField()
    nombre_genero = serializers.CharField()

class DistribucionEdadSerializer(serializers.Serializer):
    """
    Serializer para distribución por rangos de edad
    """
    rango_edad = serializers.CharField()
    cantidad = serializers.IntegerField()
    porcentaje = serializers.FloatField()
    edad_min = serializers.IntegerField()
    edad_max = serializers.IntegerField()

class TiemposEsperaSerializer(serializers.Serializer):
    """
    Serializer para métricas de tiempos de espera (solo por ESI)
    """
    por_esi = serializers.DictField(child=serializers.FloatField())

class EstadisticasEstadoSerializer(serializers.Serializer):
    """
    Serializer para estadísticas por estado de atención
    """
    estado = serializers.CharField()
    cantidad = serializers.IntegerField()
    porcentaje = serializers.FloatField()
    tiempo_promedio_permanencia = serializers.FloatField()
    nombre_estado = serializers.CharField()

class MetricasTurnoSerializer(serializers.Serializer):
    """
    Serializer para métricas por turno
    """
    turno = serializers.CharField()
    nombre_turno = serializers.CharField()
    cantidad_pacientes = serializers.IntegerField()
    tiempo_promedio_espera = serializers.FloatField()
    hora_inicio = serializers.TimeField()
    hora_fin = serializers.TimeField()

class TendenciaTemporalSerializer(serializers.Serializer):
    """
    Serializer para análisis de tendencias temporales
    """
    fecha = serializers.DateField()
    cantidad_pacientes = serializers.IntegerField()
    tiempo_promedio_espera = serializers.FloatField()
    nivel_esi_predominante = serializers.IntegerField()
    porcentaje_atencion_rapida = serializers.FloatField()  # % atendidos en < 30 min

class AnalisisEficienciaSerializer(serializers.Serializer):
    """
    Serializer para análisis de eficiencia del sistema
    """
    throughput_pacientes_hora = serializers.FloatField()
    tasa_utilizacion_sistema = serializers.FloatField()  # % tiempo sistema ocupado
    tiempo_ciclo_promedio = serializers.FloatField()  # tiempo total desde llegada hasta alta
    indice_congestion = serializers.FloatField()  # métrica personalizada de congestión
    pacientes_abandonaron = serializers.IntegerField()
    tasa_reingreso = serializers.FloatField()

class PatronFlujoSerializer(serializers.Serializer):
    """
    Serializer para análisis de patrones de flujo
    """
    transicion = serializers.CharField()  # ej: "EN_ESPERA->EN_ATENCION"
    cantidad_transiciones = serializers.IntegerField()
    tiempo_promedio_transicion = serializers.FloatField()
    tiempo_p90_transicion = serializers.FloatField()
    cuello_botella_score = serializers.FloatField()  # score de qué tan problemática es esta transición

class AnalisisTemporalHorarioSerializer(serializers.Serializer):
    """
    Serializer para análisis por hora del día
    """
    hora = serializers.IntegerField(min_value=0, max_value=23)
    cantidad_llegadas = serializers.IntegerField()
    cantidad_altas = serializers.IntegerField()
    tiempo_espera_promedio = serializers.FloatField()
    nivel_ocupacion = serializers.FloatField()  # % de capacidad ocupada
    factor_estacionalidad = serializers.FloatField()  # vs promedio del día

class MetricasCalidadSerializer(serializers.Serializer):
    """
    Serializer para métricas de calidad de atención
    """
    cumplimiento_tiempos_esi = serializers.DictField()  # % cumplimiento por nivel ESI
    pacientes_criticos_tiempo_objetivo = serializers.FloatField()  # % ESI 1-2 atendidos rápido
    tiempo_puerta_medico = serializers.FloatField()  # tiempo desde llegada hasta ver médico
    reingresos_72h = serializers.IntegerField()
    satisfaccion_estimada = serializers.FloatField()  # basada en tiempos

class ComparativaPeriodicaSerializer(serializers.Serializer):
    """
    Serializer para comparativas entre períodos
    """
    periodo_actual = serializers.CharField()
    periodo_anterior = serializers.CharField()
    variacion_volumen = serializers.FloatField()  # % cambio en volumen
    variacion_tiempos = serializers.FloatField()  # % cambio en tiempos
    variacion_eficiencia = serializers.FloatField()
    tendencia = serializers.CharField()  # "MEJORA", "EMPEORA", "ESTABLE"
    alertas = serializers.ListField(child=serializers.CharField(), required=False)

class PrediccionesSerializer(serializers.Serializer):
    """
    Serializer para predicciones simples basadas en tendencias
    """
    prediccion_volumen_siguiente_semana = serializers.IntegerField()
    prediccion_tiempo_espera = serializers.FloatField()
    horas_pico_predichas = serializers.ListField(child=serializers.IntegerField())
    recomendaciones = serializers.ListField(child=serializers.CharField())

class ResumenMetricasAvanzadasSerializer(serializers.Serializer):
    """
    Serializer para métricas avanzadas completas
    """
    tendencias_temporales = TendenciaTemporalSerializer(many=True)
    analisis_eficiencia = AnalisisEficienciaSerializer()
    patrones_flujo = PatronFlujoSerializer(many=True)
    analisis_horario = AnalisisTemporalHorarioSerializer(many=True)
    metricas_calidad = MetricasCalidadSerializer()
    comparativa_periodica = ComparativaPeriodicaSerializer()
    predicciones = PrediccionesSerializer()
    fecha_analisis = serializers.DateTimeField()

class ResumenMetricasSerializer(MetricaBaseSerializer):
    """
    Serializer principal que agrupa todas las métricas básicas
    """
    distribucion_esi = DistribucionESISerializer(many=True)
    distribucion_genero = DistribucionGeneroSerializer(many=True)
    distribucion_edad = DistribucionEdadSerializer(many=True)
    tiempos_espera = TiemposEsperaSerializer()
    estadisticas_estado = EstadisticasEstadoSerializer(many=True)

class ResumenCompletoSerializer(MetricaBaseSerializer):
    """
    Serializer que combina métricas básicas y avanzadas
    """
    # Métricas básicas
    distribucion_esi = DistribucionESISerializer(many=True)
    distribucion_genero = DistribucionGeneroSerializer(many=True)
    distribucion_edad = DistribucionEdadSerializer(many=True)
    tiempos_espera = TiemposEsperaSerializer()
    estadisticas_estado = EstadisticasEstadoSerializer(many=True)
    
    # Métricas avanzadas
    metricas_avanzadas = ResumenMetricasAvanzadasSerializer(required=False)
