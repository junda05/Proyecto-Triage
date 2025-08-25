import os
import sys
import django

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
django.setup()

from django.conf import settings
from pacientes.models import Paciente
from triage.models import SesionTriage, Pregunta, Respuesta
from utils.preguntas import PREGUNTAS, REGLAS_ESI, FLUJO_PREGUNTAS
from django.utils import timezone

class TriageConsoleTest:
    """Clase para probar el flujo de triage por consola"""
    
    def __init__(self):
        self.sesion = None
        self.paciente = None
        
    def ejecutar_test(self):
        """Ejecuta el test completo del flujo de triage"""
        print("="*60)
        print("SISTEMA DE TRIAGE - TEST POR CONSOLA")
        print("="*60)
        
        # Paso 1: Solicitar ID del paciente
        if not self.obtener_paciente():
            return
            
        # Paso 2: Crear sesión de triage
        if not self.crear_sesion():
            return
            
        # Paso 3: Ejecutar flujo de preguntas
        self.ejecutar_flujo_preguntas()
        
        # Paso 4: Mostrar resultado final
        self.mostrar_resultado_final()
        
    def obtener_paciente(self):
        """Obtiene el paciente por ID ingresado por consola"""
        while True:
            try:
                print("\nPacientes disponibles:")
                pacientes = Paciente.objects.all()[:10]  # Mostrar solo los primeros 10
                
                if not pacientes:
                    print("o hay pacientes en la base de datos.")
                    print("Crea un paciente primero usando el admin de Django.")
                    return False
                    
                for p in pacientes:
                    print(f"ID: {p.id} - {p.primer_nombre} {p.primer_apellido} ({p.numero_documento}) - {p.sexo} - Edad: {p.edad}")
                
                paciente_id = input("\nIngresa el ID del paciente: ").strip()
                
                if not paciente_id:
                    print("❌ Por favor ingresa un ID válido.")
                    continue
                    
                self.paciente = Paciente.objects.get(id=int(paciente_id))
                print(f"Paciente seleccionado: {self.paciente.primer_nombre} {self.paciente.primer_apellido}")
                print(f"Sexo: {self.paciente.sexo}")
                print(f"Edad: {self.paciente.edad} años")
                print(f"Síntomas iniciales: {self.paciente.sintomas_iniciales}")
                return True
                
            except (ValueError, Paciente.DoesNotExist):
                print("ID de paciente no válido. Intenta de nuevo.")
            except KeyboardInterrupt:
                print("\nTest cancelado por el usuario.")
                return False
                
    def crear_sesion(self):
        """Crea una nueva sesión de triage"""
        try:
            self.sesion = SesionTriage.objects.create(
                paciente=self.paciente,
                fecha_inicio=timezone.now()
            )
            print(f"Sesión de triage creada: {self.sesion.id}")
            return True
        except Exception as e:
            print(f"Error al crear sesión: {e}")
            return False
            
    def ejecutar_flujo_preguntas(self):
        """Ejecuta el flujo de preguntas interactivamente"""
        print("\n" + "="*60)
        print("INICIANDO EVALUACIÓN DE TRIAGE")
        print("="*60)
        print("LÓGICA DE PRIORIZACIÓN:")
        print("1. Adultos mayores (>65 años) → Evaluación geriátrica")
        print("2. Mujeres → Evaluación de embarazo")
        print("3. Otros casos → Flujo general")
        print("-" * 60)
        
        # Determinar la primera pregunta según la edad y sexo del paciente
        codigo_pregunta = self.obtener_primera_pregunta()
        
        while codigo_pregunta:
            # Obtener información de la pregunta desde PREGUNTAS
            if codigo_pregunta not in PREGUNTAS:
                print(f"Pregunta '{codigo_pregunta}' no encontrada en el sistema.")
                break
                
            info_pregunta = PREGUNTAS[codigo_pregunta]

            print(f"\nPregunta: {info_pregunta['texto']}")
            
            # Mostrar opciones según el tipo de pregunta
            respuesta_usuario = self.obtener_respuesta(info_pregunta)
            
            if respuesta_usuario is None:  # Usuario canceló
                print("Evaluación cancelada.")
                return
                
            # Crear pregunta en BD si no existe
            pregunta_obj, created = Pregunta.objects.get_or_create(
                codigo=codigo_pregunta,
                defaults={
                    'texto': info_pregunta['texto'],
                    'tipo': info_pregunta['tipo'],
                    'opciones': info_pregunta.get('opciones', [])
                }
            )
            
            # Guardar respuesta
            respuesta_obj = Respuesta.objects.create(
                sesion=self.sesion,
                pregunta=pregunta_obj,
                valor=respuesta_usuario
            )
            
            print(f"Respuesta guardada: {respuesta_usuario}")
            
            # Determinar siguiente pregunta según lógica simple
            codigo_pregunta = self.obtener_siguiente_pregunta(codigo_pregunta, respuesta_usuario)
            
    def obtener_primera_pregunta(self):
        """Determina la primera pregunta basada en la edad y sexo del paciente"""
        # Prioridad 1: Adultos mayores (>65 años)
        if self.paciente.edad > 65:
            print(f"Paciente adulto mayor detectado (edad: {self.paciente.edad}) - Iniciando con evaluación geriátrica")
            return 'adulto_mayor_ESI1'
        # Prioridad 2: Mujeres (cualquier edad) - preguntar sobre embarazo
        elif self.paciente.sexo.lower() in ['femenino', 'mujer', 'f', 'female']:
            print(f"Paciente femenino detectado (edad: {self.paciente.edad}) - Iniciando con preguntas de embarazo")
            return 'embarazo'
        # Prioridad 3: Flujo normal para otros casos
        else:
            print(f"Paciente masculino detectado (edad: {self.paciente.edad}) - Iniciando flujo normal")
            return 'mayor_riesgo'
            
    def obtener_respuesta(self, info_pregunta):
        """Obtiene la respuesta del usuario según el tipo de pregunta"""
        tipo = info_pregunta['tipo']
        opciones = info_pregunta.get('opciones', [])
        
        if tipo == 'boolean':
            while True:
                try:
                    respuesta = input("Respuesta (Si/No): ").strip().lower()
                    if respuesta in ['si', 'sí', 's', 'yes', 'y']:
                        return 'Si'
                    elif respuesta in ['no', 'n']:
                        return 'No'
                    else:
                        print("Respuesta no válida. Ingresa 'Si' o 'No'.")
                except KeyboardInterrupt:
                    return None
                    
        elif tipo == 'choice':
            print("Opciones:")
            for i, opcion in enumerate(opciones, 1):
                print(f"  {i}. {opcion}")
                
            while True:
                try:
                    seleccion = input(f"Selecciona una opción (1-{len(opciones)}): ").strip()
                    indice = int(seleccion) - 1
                    if 0 <= indice < len(opciones):
                        return opciones[indice]
                    else:
                        print(f"Selección no válida. Ingresa un número entre 1 y {len(opciones)}.")
                except (ValueError, KeyboardInterrupt):
                    if KeyboardInterrupt:
                        return None
                    print("Por favor ingresa un número válido.")
                    
        return "Respuesta no capturada"
        
    def obtener_siguiente_pregunta(self, codigo_actual, respuesta):
        """
        Determina la siguiente pregunta basada en la respuesta usando FLUJO_PREGUNTAS.
        Esta función replica la lógica de determinar_siguiente_pregunta de las vistas reales.
        """
        # Manejo específico para el flujo de adultos mayores
        if codigo_actual == 'adulto_mayor_ESI1':
            if respuesta == 'Ninguna de las anteriores':
                # Si no tiene síntomas de ESI 1, continuar con ESI 2
                return 'adulto_mayor_ESI2'
            else:
                return None  # Finalizar - síntoma grave detectado (ESI 1)
        
        elif codigo_actual == 'adulto_mayor_ESI2':
            if respuesta == 'Ninguna de las anteriores':
                # Si no tiene síntomas de ESI 2, continuar con ESI 3
                return 'adulto_mayor_ESI3'
            else:
                return None  # Finalizar - síntoma ESI 2 detectado
                
        elif codigo_actual == 'adulto_mayor_ESI3':
            if respuesta == 'Ninguna de las anteriores':
                # Si no tiene síntomas de ESI 3, continuar con ESI 4/5
                return 'adulto_mayor_ESI45'
            else:
                return None  # Finalizar - síntoma ESI 3 detectado
                
        elif codigo_actual == 'adulto_mayor_ESI45':
            # Siempre finalizar después de esta pregunta
            return None
        
        # Manejo específico para el flujo de embarazo (similar a las vistas reales)
        elif codigo_actual == 'embarazo':
            if respuesta in ['Sí', 'Si', True, 'True', 'si', 'sí']:
                return 'semanas_embarazo'
            else:
                return 'mayor_riesgo'
                
        elif codigo_actual == 'semanas_embarazo':
            return 'sintomas_graves_embarazo_ESI1'
            
        elif codigo_actual == 'sintomas_graves_embarazo_ESI1':
            if respuesta == 'Ninguna de las anteriores':
                return 'sintomas_moderados_embarazo_ESI23'
            else:
                return None  # Finalizar - síntoma grave detectado
                
        elif codigo_actual == 'sintomas_moderados_embarazo_ESI23':
            if respuesta == 'Ninguna de las anteriores':
                return 'sintomas_leves_embarazo_ESI45'
            else:
                return None  # Finalizar - síntoma moderado detectado
                
        elif codigo_actual == 'sintomas_leves_embarazo_ESI45':
            if respuesta == 'Ninguna de las anteriores':
                return 'mayor_riesgo'  # Continuar con flujo general
            else:
                return None  # Finalizar - síntoma leve detectado
        
        # Usar la lógica de FLUJO_PREGUNTAS para el resto de preguntas
        if codigo_actual not in FLUJO_PREGUNTAS:
            return None
            
        # Obtener regla de flujo para esta pregunta
        regla_flujo = FLUJO_PREGUNTAS[codigo_actual]
        
        # Determinar el siguiente código de pregunta
        siguiente_codigo = None
        
        # Si valor_respuesta coincide con alguna clave específica en la regla
        if isinstance(respuesta, (str, bool)) and str(respuesta) in regla_flujo:
            siguiente_codigo = regla_flujo[str(respuesta)]
        # Si hay un valor por defecto en la regla
        elif "default" in regla_flujo:
            siguiente_codigo = regla_flujo["default"]
        # Si hay un valor "siguiente" genérico
        elif "siguiente" in regla_flujo:
            siguiente_codigo = regla_flujo["siguiente"]
        
        # Retornar el siguiente código (puede ser None si debe finalizar)
        return siguiente_codigo
        
    def mostrar_resultado_final(self):
        """Muestra el resultado final del triage"""
        print("\n" + "="*60)
        print("EVALUACIÓN COMPLETADA")
        print("="*60)
        
        # Marcar sesión como completada
        self.sesion.completado = True
        self.sesion.fecha_fin = timezone.now()
        
        # Calcular nivel de triage básico basado en respuestas
        respuestas = Respuesta.objects.filter(sesion=self.sesion)
        nivel_triage = self.calcular_nivel_triage(respuestas)
        self.sesion.nivel_triage = nivel_triage
        self.sesion.save()
        
        print(f"Paciente: {self.paciente.primer_nombre} {self.paciente.primer_apellido}")
        print(f"Sesión: {self.sesion.id}")
        print(f"Duración: {(self.sesion.fecha_fin - self.sesion.fecha_inicio).total_seconds():.0f} segundos")
        print(f"Nivel ESI asignado: {nivel_triage}")
        print(f"Total de respuestas: {respuestas.count()}")
        
        # Mostrar resumen de respuestas
        print(f"\nResumen de respuestas:")
        for resp in respuestas:
            print(f"  • {resp.pregunta.codigo}: {resp.valor}")
            
    def calcular_nivel_triage(self, respuestas):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        Esta función replica la lógica de determinar_nivel_triage de las vistas reales.
        """
        # Convertir respuestas a un diccionario para fácil acceso
        respuestas_dict = {resp.pregunta.codigo: resp.valor for resp in respuestas}
        
        # Verificar si es una paciente embarazada
        es_embarazada = respuestas_dict.get('embarazo') in ['Sí', 'Si', True, 'True', 'si', 'sí']
        
        # Evaluar cada regla ESI - las reglas de embarazo y adulto mayor tienen prioridad
        for regla in REGLAS_ESI:
            condiciones_cumplidas = True
            
            # Para reglas de embarazo, verificar que la paciente esté embarazada
            regla_es_embarazo = any('embarazo' in condicion.get('pregunta', '') for condicion in regla["condiciones"])
            
            if regla_es_embarazo and not es_embarazada:
                continue  # Saltar reglas de embarazo si no está embarazada
            
            # Para reglas de adultos mayores, verificar que el paciente tenga >65 años
            regla_es_adulto_mayor = any('adulto_mayor' in condicion.get('pregunta', '') for condicion in regla["condiciones"])
            
            if regla_es_adulto_mayor and self.paciente.edad <= 65:
                continue  # Saltar reglas de adulto mayor si no tiene >65 años
            
            for condicion in regla["condiciones"]:
                pregunta_codigo = condicion["pregunta"]
                valor_esperado = condicion["valor"]
                
                # Si la pregunta no fue respondida, la condición no se cumple
                if pregunta_codigo not in respuestas_dict:
                    condiciones_cumplidas = False
                    break
                
                valor_respuesta = respuestas_dict[pregunta_codigo]
                
                # Verificar si la condición se cumple
                if isinstance(valor_esperado, list):
                    # Si valor_esperado es una lista, verificar si la respuesta está en ella
                    if valor_respuesta not in valor_esperado:
                        condiciones_cumplidas = False
                        break
                else:
                    # Si es un valor único, comparar directamente
                    if valor_respuesta != valor_esperado:
                        condiciones_cumplidas = False
                        break
            
            # Si todas las condiciones se cumplen, retornar el nivel ESI de esta regla
            if condiciones_cumplidas:
                print(f"Regla ESI {regla['nivel_esi']} aplicada basada en las respuestas.")
                return regla["nivel_esi"]
        
        # Si ninguna regla aplica, considerar factores adicionales
        # Adultos mayores sin síntomas específicos → ESI 3
        if self.paciente.edad > 65:
            print(f"Aplicando ESI 3 por edad avanzada (>{self.paciente.edad} años) sin síntomas específicos.")
            return 3
        
        # Si ninguna regla aplica, retornar nivel por defecto (4 - menos urgente)
        print("Aplicando ESI 4 por defecto - no se encontraron condiciones específicas.")
        return 4


def main():
    """Función principal para ejecutar el test"""
    try:
        test = TriageConsoleTest()
        test.ejecutar_test()
    except Exception as e:
        print(f"Error durante la ejecución: {e}")
        
if __name__ == "__main__":
    main()