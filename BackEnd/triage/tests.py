import os
import sys
import django

# Add the BackEnd directory to Python path to ensure proper imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
django.setup()

from django.conf import settings
from pacientes.models import Paciente
from triage.models import SesionTriage, Pregunta, Respuesta
from triage.utils.preguntas import PREGUNTAS, REGLAS_ESI, FLUJO_PREGUNTAS
from django.utils import timezone

class TriageConsoleTest:
    """Clase para probar el flujo de triage por consola"""
    
    def __init__(self):
        self.sesion = None
        self.paciente = None
        self._enfermedades_en_sesion = []  # Para seguimiento de enfermedades seleccionadas
        self._enfermedades_evaluadas = set()  # Para seguimiento de enfermedades ya evaluadas
        
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
            
            # Si es la pregunta de enfermedades crónicas, mostrar información adicional
            if codigo_pregunta == 'antecedentes_enfermedades_cronicas':
                if isinstance(respuesta_usuario, list) and len(respuesta_usuario) > 1:
                    print(f"[INFO] Se seleccionaron múltiples enfermedades crónicas:")
                    for enfermedad in respuesta_usuario:
                        print(f"  - {enfermedad}")
                    print(f"[INFO] El sistema evaluará cada enfermedad secuencialmente.")
            
            # Determinar siguiente pregunta según FLUJO_PREGUNTAS
            siguiente_codigo = self.obtener_siguiente_pregunta(codigo_pregunta, respuesta_usuario)
            
            if siguiente_codigo:
                print(f"Siguiente pregunta: {siguiente_codigo}")
            else:
                print("Evaluación completada - Calculando nivel ESI...")
                break
                
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
        Utiliza la misma lógica que las vistas reales, incluyendo el manejo de enfermedades crónicas.
        """
        # Lógica especial para enfermedades crónicas (igual que en views.py)
        if codigo_actual == 'antecedentes_enfermedades_cronicas':
            return self._manejar_flujo_enfermedades_cronicas(respuesta)
        
        # Lógica especial para preguntas de síntomas relacionados con enfermedades específicas
        if codigo_actual.startswith('sintoma_relacionado_') and codigo_actual != 'sintoma_relacionado_con_enfermedad_cronica':
            return self._manejar_sintoma_enfermedad_especifica(codigo_actual, respuesta)
        
        # Usar directamente FLUJO_PREGUNTAS para determinar la siguiente pregunta (lógica original)
        if codigo_actual not in FLUJO_PREGUNTAS:
            return None
            
        regla_flujo = FLUJO_PREGUNTAS[codigo_actual]
        
        # Si la regla es simple (string), retornarla directamente
        if not isinstance(regla_flujo, dict):
            return regla_flujo
        
        # Buscar siguiente pregunta por prioridad (como en las vistas)
        siguiente_codigo = (self._buscar_por_valor_exacto(regla_flujo, respuesta) or
                           self._buscar_por_siguiente(regla_flujo))
        
        # Verificar si necesita manejo dinámico de enfermedades
        if siguiente_codigo == "DINAMICO_SIGUIENTE_ENFERMEDAD":
            siguiente_enfermedad = self._obtener_siguiente_enfermedad_a_evaluar_por_codigo(codigo_actual)
            # Solo finalizar si se completó un flujo específico de enfermedad
            if siguiente_enfermedad is None and self._se_completo_flujo_especifico():
                return None
            return siguiente_enfermedad
        
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
    
    def _buscar_por_siguiente(self, regla_flujo):
        """Busca la regla siguiente genérica."""
        return regla_flujo.get("siguiente")
    
    def _manejar_flujo_enfermedades_cronicas(self, respuesta):
        """
        Maneja el flujo específico cuando el usuario selecciona enfermedades crónicas.
        Replica la lógica de _manejar_flujo_enfermedades_cronicas de views.py
        """
        print(f"[DEBUG] Manejando flujo de enfermedades crónicas. Respuesta: {respuesta}")
        
        # Si no seleccionó ninguna enfermedad crónica, ir a alergias
        if not respuesta or respuesta == "Ninguna de las anteriores":
            print("[DEBUG] No se seleccionaron enfermedades crónicas -> antecedentes_alergias")
            return "antecedentes_alergias"
        
        # Si seleccionó cáncer, ir al flujo específico de cáncer
        if isinstance(respuesta, list) and "Cáncer" in respuesta:
            print("[DEBUG] Cáncer detectado en lista -> esta_en_tratamiento")
            return "esta_en_tratamiento"
        elif isinstance(respuesta, str) and respuesta == "Cáncer":
            print("[DEBUG] Cáncer detectado -> esta_en_tratamiento")
            return "esta_en_tratamiento"
        
        # Obtener las enfermedades seleccionadas (excluyendo cáncer)
        enfermedades_seleccionadas = self._obtener_enfermedades_seleccionadas(respuesta)
        print(f"[DEBUG] Enfermedades seleccionadas: {enfermedades_seleccionadas}")
        
        # Almacenar las enfermedades seleccionadas para uso posterior
        self._enfermedades_en_sesion = enfermedades_seleccionadas
        
        # Obtener la primera enfermedad a evaluar
        primera_enfermedad = self._obtener_primera_enfermedad_a_evaluar(enfermedades_seleccionadas)
        print(f"[DEBUG] Primera enfermedad a evaluar: {primera_enfermedad}")
        return f"sintoma_relacionado_{primera_enfermedad}"
    
    def _manejar_sintoma_enfermedad_especifica(self, codigo_pregunta, respuesta):
        """
        Maneja el flujo cuando se responde sobre síntomas de enfermedades específicas.
        Replica la lógica de _manejar_sintoma_enfermedad_especifica de views.py
        """
        print(f"[DEBUG] Manejando síntoma enfermedad específica: {codigo_pregunta}, respuesta: {respuesta}")
        
        # Extraer el nombre de la enfermedad del código de la pregunta
        nombre_enfermedad = codigo_pregunta.replace('sintoma_relacionado_', '')
        print(f"[DEBUG] Enfermedad extraída: {nombre_enfermedad}")
        
        # Verificar si esta enfermedad fue realmente seleccionada por el usuario
        enfermedades_seleccionadas = getattr(self, '_enfermedades_en_sesion', [])
        
        if nombre_enfermedad not in enfermedades_seleccionadas:
            # Esta enfermedad no fue seleccionada, saltar a la siguiente
            print(f"[DEBUG] Enfermedad {nombre_enfermedad} no fue seleccionada, saltando a siguiente")
            return self._obtener_siguiente_enfermedad_a_evaluar(nombre_enfermedad)
        
        # Si el síntoma está relacionado con la enfermedad, ir al flujo específico
        if respuesta in ["Si", "True", True]:
            print(f"[DEBUG] Síntomas relacionados con {nombre_enfermedad} -> iniciando flujo específico")
            siguiente_codigo = self._buscar_por_valor_exacto(FLUJO_PREGUNTAS.get(codigo_pregunta, {}), respuesta)
            if not siguiente_codigo:
                siguiente_codigo = FLUJO_PREGUNTAS.get(codigo_pregunta, {}).get("siguiente")
            return siguiente_codigo
        
        # Si no está relacionado, determinar la siguiente enfermedad a evaluar
        print(f"[DEBUG] Sin síntomas relacionados con {nombre_enfermedad} -> siguiente enfermedad")
        return self._obtener_siguiente_enfermedad_a_evaluar(nombre_enfermedad)
    
    def _obtener_enfermedades_seleccionadas(self, respuesta):
        """
        Extrae las enfermedades crónicas seleccionadas (excluyendo cáncer).
        Replica la lógica de _obtener_enfermedades_seleccionadas de views.py
        """
        # Mapeo de nombres de enfermedades a códigos de preguntas
        mapeo_enfermedades = {
            "Diabetes 1/2": "diabetes",
            "Asma": "asma", 
            "Accidente cerebrovascular (ACV)": "acv",
            "Insuficiencia cardíaca": "insuficiencia_cardiaca",
            "Fibromialgia": "fibromialgia",
            "Hipertensión arterial": "hipertension",
            "Enfermedad coronaria": "enfermedad_coronaria",
            "Enfermedad pulmonar obstructiva crónica (EPOC)": "epoc"
        }
        
        enfermedades_seleccionadas = []
        if isinstance(respuesta, list):
            for enfermedad in respuesta:
                if enfermedad in mapeo_enfermedades:
                    enfermedades_seleccionadas.append(mapeo_enfermedades[enfermedad])
        elif isinstance(respuesta, str) and respuesta in mapeo_enfermedades:
            enfermedades_seleccionadas.append(mapeo_enfermedades[respuesta])
        
        return enfermedades_seleccionadas
    
    def _obtener_primera_enfermedad_a_evaluar(self, enfermedades_seleccionadas):
        """
        Determina cuál es la primera enfermedad a evaluar basada en el orden de prioridad.
        Replica la lógica de _obtener_primera_enfermedad_a_evaluar de views.py
        """
        if not enfermedades_seleccionadas:
            return "antecedentes_alergias"
        
        # Orden de prioridad de evaluación
        orden_evaluacion = [
            "diabetes", "asma", "acv", "insuficiencia_cardiaca", 
            "fibromialgia", "hipertension", "enfermedad_coronaria", "epoc"
        ]
        
        for enfermedad in orden_evaluacion:
            if enfermedad in enfermedades_seleccionadas:
                return enfermedad  # Devolver solo el nombre de la enfermedad
        
        # Si no encuentra ninguna, ir a alergias
        return "antecedentes_alergias"
    
    def _obtener_siguiente_enfermedad_a_evaluar(self, enfermedad_actual):
        """
        Determina cuál es la siguiente enfermedad a evaluar basada en las enfermedades 
        seleccionadas originalmente y cuáles ya se han evaluado.
        """
        # Obtener las enfermedades originalmente seleccionadas
        enfermedades_originales = getattr(self, '_enfermedades_en_sesion', [])
        
        # Obtener las enfermedades ya evaluadas (agregar la actual)
        enfermedades_evaluadas = getattr(self, '_enfermedades_evaluadas', set())
        enfermedades_evaluadas.add(enfermedad_actual)
        self._enfermedades_evaluadas = enfermedades_evaluadas
        
        # Determinar cuáles faltan por evaluar
        enfermedades_pendientes = [e for e in enfermedades_originales if e not in enfermedades_evaluadas]
        
        print(f"[DEBUG] Enfermedades pendientes: {enfermedades_pendientes}")
        
        if enfermedades_pendientes:
            # Obtener la siguiente enfermedad según el orden de prioridad
            siguiente_enfermedad = self._obtener_primera_enfermedad_a_evaluar(enfermedades_pendientes)
            return f"sintoma_relacionado_{siguiente_enfermedad}"
        
        # Si no hay más enfermedades que evaluar, continuar con el flujo normal
        # Solo finalizar si se completaron flujos específicos de síntomas relacionados
        return "antecedentes_alergias"
    
    def _obtener_siguiente_enfermedad_a_evaluar_por_codigo(self, codigo_pregunta_actual):
        """
        Determina la siguiente enfermedad a evaluar basándose en el código de pregunta actual.
        Utilizado cuando se encuentra "DINAMICO_SIGUIENTE_ENFERMEDAD" en FLUJO_PREGUNTAS.
        """
        # Determinar la enfermedad actual basada en el código de pregunta
        enfermedad_actual = None
        
        # Mapeo de códigos de preguntas a enfermedades
        if codigo_pregunta_actual.startswith('diabetes_'):
            enfermedad_actual = 'diabetes'
        elif codigo_pregunta_actual.startswith('asma_'):
            enfermedad_actual = 'asma'
        elif codigo_pregunta_actual.startswith('acv_'):
            enfermedad_actual = 'acv'
        elif codigo_pregunta_actual.startswith('ic_'):
            enfermedad_actual = 'insuficiencia_cardiaca'
        elif codigo_pregunta_actual.startswith('fm_'):
            enfermedad_actual = 'fibromialgia'
        elif codigo_pregunta_actual.startswith('hta_'):
            enfermedad_actual = 'hipertension'
        elif codigo_pregunta_actual.startswith('ec_'):
            enfermedad_actual = 'enfermedad_coronaria'
        elif codigo_pregunta_actual.startswith('epoc_'):
            enfermedad_actual = 'epoc'
        
        if enfermedad_actual:
            print(f"[DEBUG] Terminando flujo de {enfermedad_actual}, determinando siguiente enfermedad")
            return self._obtener_siguiente_enfermedad_a_evaluar(enfermedad_actual)
        
        # Si no se puede determinar la enfermedad, continuar con flujo normal
        print(f"[DEBUG] No se pudo determinar enfermedad para {codigo_pregunta_actual}, continuando con flujo normal")
        return "antecedentes_alergias"
    
    def _se_completo_flujo_especifico(self):
        """
        Verifica si se completó al menos un flujo específico de enfermedad
        en la sesión actual del test.
        """
        # Verificar si hay alguna enfermedad que haya sido evaluada con síntomas específicos
        respuestas = Respuesta.objects.filter(sesion=self.sesion)
        
        # Verificar si hay respuestas a preguntas específicas de enfermedades
        codigos_flujos_especificos = [
            'diabetes_', 'asma_', 'acv_', 'ic_', 'fm_', 'hta_', 'ec_', 'epoc_'
        ]
        
        for respuesta in respuestas:
            codigo = respuesta.pregunta.codigo
            # Si hay respuestas a preguntas específicas de enfermedades, se completó un flujo
            if any(codigo.startswith(prefijo) for prefijo in codigos_flujos_especificos):
                return True
        
        return False
        
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
        enfermedades_cronicas_respuesta = None
        for resp in respuestas:
            print(f"  • {resp.pregunta.codigo}: {resp.valor}")
            if resp.pregunta.codigo == 'antecedentes_enfermedades_cronicas':
                enfermedades_cronicas_respuesta = resp.valor
        
        # Mostrar información específica de enfermedades crónicas si aplica
        if enfermedades_cronicas_respuesta and enfermedades_cronicas_respuesta != "Ninguna de las anteriores":
            print(f"\n[ANÁLISIS DE ENFERMEDADES CRÓNICAS]")
            if isinstance(enfermedades_cronicas_respuesta, list):
                print(f"Enfermedades seleccionadas: {', '.join(enfermedades_cronicas_respuesta)}")
                enfermedades_evaluadas = [resp.pregunta.codigo for resp in respuestas 
                                        if resp.pregunta.codigo.startswith('sintoma_relacionado_')]
                if enfermedades_evaluadas:
                    print(f"Enfermedades evaluadas: {len(enfermedades_evaluadas)}")
                    for codigo_pregunta in enfermedades_evaluadas:
                        enfermedad = codigo_pregunta.replace('sintoma_relacionado_', '')
                        respuesta_sintoma = next((r.valor for r in respuestas if r.pregunta.codigo == codigo_pregunta), "No encontrada")
                        estado = "CON síntomas relacionados" if respuesta_sintoma == "Si" else "SIN síntomas relacionados"
                        print(f"  - {enfermedad.upper()}: {estado}")
            else:
                print(f"Enfermedad seleccionada: {enfermedades_cronicas_respuesta}")
        
        print(f"\n[CLASIFICACIÓN FINAL]")
        esi_descriptions = {
            1: "EMERGENCIA - Atención inmediata",
            2: "URGENCIA CRÍTICA - Atención en minutos",
            3: "URGENCIA NO CRÍTICA - Atención en 30 min",
            4: "CONSULTA PRIORITARIA - Atención en 1-2 horas", 
            5: "CONSULTA EXTERNA - Atención rutinaria"
        }
        descripcion_esi = esi_descriptions.get(nivel_triage, "Nivel no definido")
        print(f"ESI {nivel_triage}: {descripcion_esi}")
        
        return nivel_triage
            
    def calcular_nivel_triage(self, respuestas):
        """
        Determina el nivel ESI (Emergency Severity Index) basado en las respuestas
        de la sesión y las reglas definidas en REGLAS_ESI.
        Esta función replica la lógica de determinar_nivel_triage de las vistas reales.
        Ahora incluye soporte para múltiples enfermedades crónicas.
        """
        # Convertir respuestas a un diccionario para fácil acceso
        respuestas_dict = {resp.pregunta.codigo: resp.valor for resp in respuestas}
        
        # Obtener contexto del paciente
        contexto_paciente = self._obtener_contexto_paciente(respuestas_dict)
        
        niveles_esi_encontrados = []
        
        # Evaluar cada regla ESI por orden de prioridad
        for regla in REGLAS_ESI:
            if self._evaluar_regla_esi(regla, respuestas_dict, contexto_paciente):
                nivel_esi = regla["nivel_esi"]
                niveles_esi_encontrados.append(nivel_esi)
                print(f"[DEBUG] Regla ESI {nivel_esi} aplicada: {regla['condiciones']}")
        
        # Si se encontraron múltiples niveles ESI, seleccionar el más crítico (menor número)
        if niveles_esi_encontrados:
            nivel_final = min(niveles_esi_encontrados)
            if len(niveles_esi_encontrados) > 1:
                print(f"[INFO] Se encontraron múltiples niveles ESI: {sorted(set(niveles_esi_encontrados))}")
                print(f"[INFO] Seleccionando el más crítico: ESI {nivel_final}")
            return nivel_final
        
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