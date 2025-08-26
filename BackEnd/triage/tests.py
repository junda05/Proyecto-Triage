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
                    print("Por favor ingresa un ID válido.")
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
        
        contador_preguntas = 0
        while codigo_pregunta and contador_preguntas < 50:  # Límite de seguridad
            contador_preguntas += 1
            
            # Obtener información de la pregunta desde PREGUNTAS
            if codigo_pregunta not in PREGUNTAS:
                print(f"Pregunta '{codigo_pregunta}' no encontrada en el sistema.")
                break
                
            info_pregunta = PREGUNTAS[codigo_pregunta]

            print(f"\n[Pregunta {contador_preguntas}] Código: {codigo_pregunta}")
            print(f"{info_pregunta['texto']}")
            
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
            
            # Determinar siguiente pregunta según FLUJO_PREGUNTAS
            siguiente_codigo = self.obtener_siguiente_pregunta(codigo_pregunta, respuesta_usuario)
            
            if siguiente_codigo:
                print(f"Siguiente pregunta: {siguiente_codigo}")
            else:
                print("Fin del flujo de preguntas.")
                
            codigo_pregunta = siguiente_codigo
            
        if contador_preguntas >= 50:
            print("Se alcanzó el límite máximo de preguntas (50). Finalizando evaluación.")
        
        print(f"\nTotal de preguntas respondidas: {contador_preguntas}")
            
    def obtener_primera_pregunta(self):
        """Determina la primera pregunta basada en la edad y sexo del paciente siguiendo la lógica de las vistas"""
        # Prioridad 1: Adultos mayores (>65 años)
        if self.paciente.edad > 65:
            print(f"Paciente adulto mayor detectado (edad: {self.paciente.edad}) - Iniciando con evaluación geriátrica")
            return 'adulto_mayor_ESI1'
        # Prioridad 2: Mujeres (cualquier edad) - preguntar sobre embarazo
        elif self.paciente.sexo == 'F':
            print(f"Paciente femenino detectado (edad: {self.paciente.edad}) - Iniciando con preguntas de embarazo")
            return 'embarazo'
        # Prioridad 3: Flujo normal para otros casos - usar inicio del flujo
        else:
            primera_pregunta_codigo = FLUJO_PREGUNTAS.get("inicio", 'cirugias_previas')
            print(f"Paciente detectado (edad: {self.paciente.edad}) - Iniciando flujo normal con: {primera_pregunta_codigo}")
            return primera_pregunta_codigo
            
    def obtener_respuesta(self, info_pregunta):
        """Obtiene la respuesta del usuario según el tipo de pregunta"""
        tipo = info_pregunta['tipo']
        opciones = info_pregunta.get('opciones', [])
        
        if tipo == 'boolean':
            while True:
                try:
                    respuesta = input("Respuesta (Si/No): ").strip().lower()
                    if respuesta in ['si', 'sí', 's', 'yes', 'y', 'true']:
                        return 'Si'
                    elif respuesta in ['no', 'n', 'false']:
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
        
        elif tipo == 'multi_choice':
            print("Opciones (puedes seleccionar múltiples separadas por comas):")
            for i, opcion in enumerate(opciones, 1):
                print(f"  {i}. {opcion}")
                
            while True:
                try:
                    seleccion = input(f"Selecciona opciones (ej: 1,3,5 o solo 2): ").strip()
                    if not seleccion:
                        print("Debes seleccionar al menos una opción.")
                        continue
                        
                    # Procesar múltiples selecciones
                    indices = []
                    for parte in seleccion.split(','):
                        indice = int(parte.strip()) - 1
                        if 0 <= indice < len(opciones):
                            indices.append(indice)
                        else:
                            raise ValueError(f"Opción {parte.strip()} no válida")
                    
                    # Retornar las opciones seleccionadas
                    respuestas_seleccionadas = [opciones[i] for i in indices]
                    return respuestas_seleccionadas
                    
                except (ValueError, KeyboardInterrupt):
                    if KeyboardInterrupt:
                        return None
                    print("Por favor ingresa números válidos separados por comas.")
        
        elif tipo == 'text':
            try:
                respuesta = input("Ingresa tu respuesta: ").strip()
                return respuesta if respuesta else ""
            except KeyboardInterrupt:
                return None
                    
        return "Respuesta no capturada"
        
    def obtener_siguiente_pregunta(self, codigo_actual, respuesta):
        """
        Determina la siguiente pregunta basada en la respuesta usando FLUJO_PREGUNTAS.
        Utiliza la misma lógica que las vistas reales.
        """
        # Usar directamente FLUJO_PREGUNTAS para determinar la siguiente pregunta
        if codigo_actual not in FLUJO_PREGUNTAS:
            return None
            
        regla_flujo = FLUJO_PREGUNTAS[codigo_actual]
        
        # Si la regla es simple (string), retornarla directamente
        if not isinstance(regla_flujo, dict):
            return regla_flujo
        
        # Buscar siguiente pregunta por prioridad (como en las vistas)
        siguiente_codigo = (self._buscar_por_valor_exacto(regla_flujo, respuesta) or
                           self._buscar_por_default(regla_flujo) or
                           self._buscar_por_siguiente(regla_flujo))
        
        return siguiente_codigo
    
    def _buscar_por_valor_exacto(self, regla_flujo, respuesta):
        """Busca coincidencia exacta con el valor de la respuesta."""
        # Para respuestas múltiples, verificar si alguna opción está en la regla
        if isinstance(respuesta, list):
            for valor in respuesta:
                if str(valor) in regla_flujo:
                    return regla_flujo[str(valor)]
        else:
            # Para respuestas simples, buscar coincidencia directa
            if str(respuesta) in regla_flujo:
                return regla_flujo[str(respuesta)]
        
        return None
    
    def _buscar_por_default(self, regla_flujo):
        """Busca la regla por defecto."""
        return regla_flujo.get("default")
    
    def _buscar_por_siguiente(self, regla_flujo):
        """Busca la regla siguiente genérica."""
        return regla_flujo.get("siguiente")
        
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
        
        # Obtener contexto del paciente
        contexto_paciente = self._obtener_contexto_paciente(respuestas_dict)
        
        # Evaluar cada regla ESI por orden de prioridad
        for regla in REGLAS_ESI:
            if self._evaluar_regla_esi(regla, respuestas_dict, contexto_paciente):
                print(f"Regla ESI {regla['nivel_esi']} aplicada basada en las respuestas.")
                return regla["nivel_esi"]
        
        # Si ninguna regla aplica, considerar factores adicionales
        # Adultos mayores sin síntomas específicos → ESI 3
        if self.paciente.edad > 65:
            print(f"Aplicando ESI 3 por edad avanzada ({self.paciente.edad} años) sin síntomas específicos.")
            return 3
        
        # Si ninguna regla aplica, retornar nivel por defecto (5 - menos urgente)
        print("Aplicando ESI 5 por defecto - no se encontraron condiciones específicas.")
        return 5
    
    def _obtener_contexto_paciente(self, respuestas_dict):
        """Obtiene el contexto del paciente (embarazo, edad, etc.)."""
        es_embarazada = respuestas_dict.get('embarazo') in ['Sí', 'Si', True, 'True', 'si', 'sí']
        es_adulto_mayor = self.paciente.edad > 65
        
        return {
            'es_embarazada': es_embarazada,
            'es_adulto_mayor': es_adulto_mayor
        }
    
    def _evaluar_regla_esi(self, regla, respuestas_dict, contexto_paciente):
        """Evalúa si una regla ESI se cumple con las respuestas dadas."""
        # Verificar si la regla aplica al contexto del paciente
        if not self._regla_aplica_al_contexto(regla, contexto_paciente):
            return False
        
        # Evaluar todas las condiciones de la regla
        return all(
            self._evaluar_condicion(condicion, respuestas_dict)
            for condicion in regla["condiciones"]
        )
    
    def _regla_aplica_al_contexto(self, regla, contexto_paciente):
        """Verifica si una regla aplica al contexto específico del paciente."""
        regla_es_embarazo = self._es_regla_de_embarazo(regla)
        regla_es_adulto_mayor = self._es_regla_de_adulto_mayor(regla)
        
        # Saltar reglas de embarazo si no está embarazada
        if regla_es_embarazo and not contexto_paciente['es_embarazada']:
            return False
        
        # Saltar reglas de adulto mayor si no es adulto mayor
        if regla_es_adulto_mayor and not contexto_paciente['es_adulto_mayor']:
            return False
        
        return True
    
    def _es_regla_de_embarazo(self, regla):
        """Verifica si es una regla específica para embarazadas."""
        return any('embarazo' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    def _es_regla_de_adulto_mayor(self, regla):
        """Verifica si es una regla específica para adultos mayores."""
        return any('adulto_mayor' in condicion.get('pregunta', '') 
                   for condicion in regla["condiciones"])
    
    def _evaluar_condicion(self, condicion, respuestas_dict):
        """Evalúa una condición específica de una regla ESI."""
        pregunta_codigo = condicion["pregunta"]
        valor_esperado = condicion["valor"]
        
        # Si la pregunta no fue respondida, la condición no se cumple
        if pregunta_codigo not in respuestas_dict:
            return False
        
        valor_respuesta = respuestas_dict[pregunta_codigo]
        
        # Comparar valores según el tipo
        return self._comparar_valores(valor_respuesta, valor_esperado)
    
    def _comparar_valores(self, valor_respuesta, valor_esperado):
        """Compara el valor de la respuesta con el valor esperado."""
        if isinstance(valor_esperado, list):
            return self._comparar_con_lista(valor_respuesta, valor_esperado)
        else:
            return valor_respuesta == valor_esperado
    
    def _comparar_con_lista(self, valor_respuesta, valor_esperado):
        """Compara un valor de respuesta con una lista de valores esperados."""
        if isinstance(valor_respuesta, list):
            # Respuesta múltiple: al menos un valor debe coincidir
            return any(val in valor_esperado for val in valor_respuesta)
        else:
            # Respuesta simple: debe estar en la lista
            return valor_respuesta in valor_esperado


def main():
    """Función principal para ejecutar el test"""
    try:
        test = TriageConsoleTest()
        test.ejecutar_test()
    except Exception as e:
        print(f"Error durante la ejecución: {e}")
        
if __name__ == "__main__":
    main()