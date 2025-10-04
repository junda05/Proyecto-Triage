"""
Servicios para cálculo de métricas y repor    NOMBRES_ESI = {
        1: "ESI 1",
        2: "ESI 2", 
        3: "ESI 3",
        4: "ESI 4",
        5: "ESI 5"
    }rsión corregida que funciona con datos reales del sistema
"""

from django.db.models import Count, Avg, Max, Min, Q, F, Case, When, IntegerField, FloatField, QuerySet
from django.db.models.functions import Extract
from django.utils import timezone
from datetime import datetime, timedelta, time, date
from pacientes.models import Paciente
from triage.models import SesionTriage
import numpy as np
from typing import Dict, List, Any, Tuple

class ReportesService:
    """
    Servicio principal para generar reportes y métricas del sistema de triage
    """
    
    # Configuración de rangos de edad optimizada para pediatría
    RANGOS_EDAD = [
        (0, 1, "Lactantes (0-1 años)"),
        (2, 5, "Preescolares (2-5 años)"),
        (6, 11, "Escolares (6-11 años)"),
        (12, 17, "Adolescentes (12-17 años)"),
        (18, 39, "Adultos jóvenes (18-39 años)"),
        (40, 64, "Adultos (40-64 años)"),
        (65, 120, "Adultos mayores (65+ años)")
    ]
    

    
    # Colores para niveles ESI
    COLORES_ESI = {
        1: "#DC2626",  # bg-red-600
        2: "#F97316",  # bg-orange-500
        3: "#FACC15",  # bg-yellow-400
        4: "#22C55E",  # bg-green-500
        5: "#3B82F6"   # bg-blue-500
    }
    
    NOMBRES_ESI = {
        1: "ESI 1",
        2: "ESI 2", 
        3: "ESI 3",
        4: "ESI 4",
        5: "ESI 5"
    }
    
    def __init__(self, fecha_inicio: date, fecha_fin: date, filtros: Dict = None):
        """
        Inicializa el servicio con el rango de fechas y filtros opcionales
        """
        self.fecha_inicio = fecha_inicio
        self.fecha_fin = fecha_fin
        self.filtros = filtros or {}
        
        # Convertir fechas a datetime timezone-aware para las consultas
        self.datetime_inicio = timezone.make_aware(datetime.combine(fecha_inicio, time.min))
        self.datetime_fin = timezone.make_aware(datetime.combine(fecha_fin, time(23, 59, 59)))
    
    def get_queryset_base(self) -> 'QuerySet':
        """
        Genera el queryset base filtrado por fechas y criterios adicionales
        Solo incluye pacientes que completaron el triage
        """
        queryset = Paciente.objects.filter(
            creado__range=(self.datetime_inicio, self.datetime_fin),
            sesiones_triage__isnull=False  # Solo pacientes que completaron triage
        ).select_related().distinct()
        
        # Aplicar filtros adicionales
        if self.filtros.get('estados'):
            queryset = queryset.filter(estado__in=self.filtros['estados'])
        
        if self.filtros.get('generos'):
            queryset = queryset.filter(sexo__in=self.filtros['generos'])
            
        # Filtro por rango de edad
        if self.filtros.get('rango_edad_min') is not None:
            edad_min = self.filtros['rango_edad_min']
            fecha_max_nacimiento = date.today() - timedelta(days=edad_min * 365.25)
            queryset = queryset.filter(fecha_nacimiento__lte=fecha_max_nacimiento)
            
        if self.filtros.get('rango_edad_max') is not None:
            edad_max = self.filtros['rango_edad_max']
            fecha_min_nacimiento = date.today() - timedelta(days=(edad_max + 1) * 365.25)
            queryset = queryset.filter(fecha_nacimiento__gte=fecha_min_nacimiento)
        
        return queryset
    
    def get_queryset_sesiones(self) -> 'QuerySet':
        """
        Genera el queryset de sesiones de triage filtradas
        """
        queryset = SesionTriage.objects.filter(
            paciente__creado__range=(self.datetime_inicio, self.datetime_fin)
        ).select_related('paciente')
        
        # Aplicar filtros de ESI si están especificados
        if self.filtros.get('niveles_esi'):
            queryset = queryset.filter(nivel_triage__in=self.filtros['niveles_esi'])
            
        return queryset
    
    def calcular_distribucion_esi(self) -> List[Dict]:
        """
        Calcula la distribución de pacientes por nivel ESI
        """
        try:
            sesiones = self.get_queryset_sesiones()
            
            # Contar por nivel ESI
            distribucion = sesiones.values('nivel_triage').annotate(
                cantidad=Count('id')
            ).order_by('nivel_triage')
            
            # Calcular total para percentajes
            total = sum(item['cantidad'] for item in distribucion)
            
            # Convertir a formato esperado por el serializer
            resultado = []
            for item in distribucion:
                if item['nivel_triage'] is not None:
                    porcentaje = (item['cantidad'] / total * 100) if total > 0 else 0
                    resultado.append({
                        'nivel_esi': item['nivel_triage'],
                        'cantidad': item['cantidad'],
                        'porcentaje': round(porcentaje, 2),
                        'color': self.COLORES_ESI.get(item['nivel_triage'], "#6B7280"),
                        'nombre_nivel': self.NOMBRES_ESI.get(item['nivel_triage'], f"ESI {item['nivel_triage']}")
                    })
            
            return resultado
            
        except Exception as e:
            print(f"Error en calcular_distribucion_esi: {e}")
            return []
    
    def calcular_distribucion_genero(self) -> List[Dict]:
        """
        Calcula la distribución de pacientes por género
        """
        try:
            pacientes = self.get_queryset_base()
            
            distribucion = pacientes.values('sexo').annotate(
                cantidad=Count('id')
            ).order_by('sexo')
            
            # Calcular total para percentajes
            total = sum(item['cantidad'] for item in distribucion)
            
            # Mapeo de nombres de géneros
            nombres_genero = {
                'M': 'Masculino',
                'F': 'Femenino',
                'NA': 'No Aplica'
            }
            
            resultado = []
            for item in distribucion:
                if item['sexo']:
                    porcentaje = (item['cantidad'] / total * 100) if total > 0 else 0
                    resultado.append({
                        'genero': item['sexo'],
                        'cantidad': item['cantidad'],
                        'porcentaje': round(porcentaje, 2),
                        'nombre_genero': nombres_genero.get(item['sexo'], item['sexo'])
                    })
            
            return resultado
            
        except Exception as e:
            print(f"Error en calcular_distribucion_genero: {e}")
            return []
    
    def calcular_edad_paciente(self, fecha_nacimiento: date) -> int:
        """
        Calcula la edad de un paciente en años
        """
        if not fecha_nacimiento:
            return 0
            
        hoy = date.today()
        edad = hoy.year - fecha_nacimiento.year
        
        # Ajustar si no ha cumplido años este año
        if hoy.month < fecha_nacimiento.month or \
           (hoy.month == fecha_nacimiento.month and hoy.day < fecha_nacimiento.day):
            edad -= 1
            
        return max(0, edad)
    
    def calcular_distribucion_edad(self) -> List[Dict]:
        """
        Calcula la distribución de pacientes por rangos de edad
        """
        try:
            pacientes = self.get_queryset_base()
            total_pacientes = pacientes.count()
            resultado = []
            
            for edad_min, edad_max, etiqueta in self.RANGOS_EDAD:
                # Filtrar pacientes en este rango de edad
                fecha_max = date.today() - timedelta(days=edad_min * 365.25)
                fecha_min = date.today() - timedelta(days=(edad_max + 1) * 365.25)
                
                cantidad = pacientes.filter(
                    fecha_nacimiento__lte=fecha_max,
                    fecha_nacimiento__gte=fecha_min
                ).count()
                
                if cantidad > 0:
                    porcentaje = (cantidad / total_pacientes * 100) if total_pacientes > 0 else 0
                    resultado.append({
                        'rango_edad': etiqueta,
                        'edad_min': edad_min,
                        'edad_max': edad_max,
                        'cantidad': cantidad,
                        'porcentaje': round(porcentaje, 2)
                    })
            
            return resultado
            
        except Exception as e:
            print(f"Error en calcular_distribucion_edad: {e}")
            return []
    
    def calcular_tiempos_espera(self) -> Dict:
        """
        Calcula métricas de tiempo de espera basándose en fecha_inicio y fecha_fin
        Solo incluye pacientes que completaron triage y NO fueron marcados como abandono
        """
        try:
            # Filtrar sesiones completadas con fechas válidas y excluir abandonos
            sesiones = self.get_queryset_sesiones().filter(
                fecha_fin__isnull=False,
                completado=True,
                paciente__estado__isnull=False
            ).exclude(
                paciente__estado='ABANDONO'  # Excluir pacientes con estado ABANDONO
            )
            
            # Calcular solo por ESI (único campo usado por frontend)
            por_esi = {}
            for nivel in range(1, 6):
                sesiones_esi = sesiones.filter(nivel_triage=nivel)
                tiempos_esi = []
                for sesion in sesiones_esi:
                    if sesion.fecha_fin and sesion.fecha_inicio:
                        diferencia = sesion.fecha_fin - sesion.fecha_inicio
                        minutos = diferencia.total_seconds() / 60
                        tiempos_esi.append(minutos)
                
                if tiempos_esi:
                    por_esi[nivel] = sum(tiempos_esi) / len(tiempos_esi)
            
            return {
                'por_esi': {str(k): round(v, 2) for k, v in por_esi.items()}
            }
            
        except Exception as e:
            print(f"Error en calcular_tiempos_espera: {e}")
            return {
                'por_esi': {}
            }
    
    def calcular_estadisticas_estado(self) -> List[Dict]:
        """
        Calcula estadísticas por estado de atención
        """
        try:
            pacientes = self.get_queryset_base()
            total_pacientes = pacientes.count()
            
            distribucion = pacientes.values('estado').annotate(
                cantidad=Count('id')
            ).order_by('estado')
            
            # Mapeo de nombres de estados (usando los estados reales del modelo)
            nombres_estado = {
                'EN_ESPERA': 'En Espera',
                'EN_ATENCION': 'En Atención',
                'ATENDIDO': 'Atendido',
                'ABANDONO': 'Abandono'
            }
            
            resultado = []
            for item in distribucion:
                if item['estado']:
                    porcentaje = (item['cantidad'] / total_pacientes * 100) if total_pacientes > 0 else 0
                    resultado.append({
                        'estado': item['estado'],
                        'cantidad': item['cantidad'],
                        'porcentaje': round(porcentaje, 2),
                        'tiempo_promedio_permanencia': 0.0,  # TODO: Implementar cálculo real
                        'nombre_estado': nombres_estado.get(item['estado'], item['estado'])
                    })
            
            return resultado
            
        except Exception as e:
            print(f"Error en calcular_estadisticas_estado: {e}")
            return []
    

    
    def generar_reporte_completo(self) -> Dict:
        """
        Genera el reporte completo con las métricas usadas por frontend
        """
        try:
            total_pacientes = self.get_queryset_base().count()
            tiempos_espera_data = self.calcular_tiempos_espera()
            
            return {
                # Campos requeridos por el serializer base
                'total_pacientes': total_pacientes,
                'fecha_generacion': timezone.now(),
                'periodo_inicio': self.fecha_inicio,
                'periodo_fin': self.fecha_fin,
                
                # Campos específicos del reporte (solo los usados por frontend)
                'distribucion_esi': self.calcular_distribucion_esi(),
                'distribucion_genero': self.calcular_distribucion_genero(),
                'distribucion_edad': self.calcular_distribucion_edad(),
                'tiempos_espera': tiempos_espera_data,
                'estadisticas_estado': self.calcular_estadisticas_estado()
            }
            
        except Exception as e:
            print(f"Error en generar_reporte_completo: {e}")
            raise Exception(f"Error al generar reporte: {str(e)}")
    
    def generar_reporte_completo_avanzado(self) -> Dict:
        """
        Genera el reporte completo incluyendo métricas avanzadas
        """
        try:
            reporte_basico = self.generar_reporte_completo()
            
            # Agregar métricas avanzadas si es necesario
            # Por ahora retornamos el reporte básico
            return reporte_basico
            
        except Exception as e:
            print(f"Error en generar_reporte_completo_avanzado: {e}")
            raise Exception(f"Error al generar reporte avanzado: {str(e)}")