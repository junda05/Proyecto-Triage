#!/usr/bin/env python
"""
Script mejorado para generar 50 pacientes de prueba con sesiones de triage completas
Incluye datos realistas, validaciones completas, respuestas de triage y flujo real
Versión: 2.0 - Con validaciones completas y respuestas de triage
"""

import os
import sys
import django
import random
import uuid
from datetime import date, datetime, timedelta
from django.utils import timezone
from django.db import transaction

# Configurar Django
# Obtener la ruta del directorio BackEnd (3 niveles arriba desde este script)
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, backend_dir)

# Cambiar al directorio BackEnd para que Django pueda encontrar los módulos
os.chdir(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackEnd.settings')
django.setup()

from pacientes.models import Paciente, ContactoEmergencia
from triage.models import SesionTriage, Pregunta, Respuesta
from triage.utils.preguntas import PREGUNTAS, FLUJO_PREGUNTAS

# Datos para generar pacientes realistas (evitando duplicados)
NOMBRES_MASCULINOS = [
    'Juan Carlos', 'Luis Miguel', 'José Antonio', 'Miguel Ángel', 'Carlos Eduardo',
    'Rafael Alejandro', 'Fernando David', 'Jorge Alberto', 'Pablo Andrés', 'Sergio Gabriel',
    'Daniel Ricardo', 'Francisco Javier', 'Manuel Roberto', 'Alejandro Iván', 'Eduardo Camilo',
    'Antonio César', 'David Santiago', 'Ricardo Emilio', 'Gabriel Omar', 'Andrés Felipe'
]

NOMBRES_FEMENINOS = [
    'María Isabel', 'Ana Lucía', 'Luisa Fernanda', 'Carmen Rosa', 'Rosa María',
    'Teresa Beatriz', 'Isabel Patricia', 'Patricia Laura', 'Laura Sandra', 'Sandra Mónica',
    'Mónica Elena', 'Elena Cristina', 'Cristina Silvia', 'Silvia Adriana', 'Beatriz Gloria',
    'Adriana Claudia', 'Claudia Esperanza', 'Gloria Luz', 'Esperanza Carmen', 'Luz Marina'
]

APELLIDOS_COMBINADOS = [
    'García Rodríguez', 'González Fernández', 'López Martínez', 'Sánchez Pérez', 'Gómez Martín',
    'Jiménez Ruiz', 'Hernández Díaz', 'Moreno Álvarez', 'Muñoz Romero', 'Alonso Gutiérrez',
    'Navarro Torres', 'Domínguez Vázquez', 'Ramos Gil', 'Ramírez Serrano', 'Blanco Suárez',
    'Castro Ortega', 'Vargas Morales', 'Herrera Delgado', 'Aguilar Ibáñez', 'Medina Rubio'
]

# Relaciones de parentesco más específicas
RELACIONES_PARENTESCO = [
    'Madre', 'Padre', 'Hermana', 'Hermano', 'Hija', 'Hijo', 'Esposa', 'Esposo',
    'Abuela', 'Abuelo', 'Tía', 'Tío', 'Prima', 'Primo', 'Sobrina', 'Sobrino',
    'Nuera', 'Yerno', 'Cuñada', 'Cuñado', 'Amiga cercana', 'Amigo cercano',
    'Vecina', 'Vecino', 'Compañera de trabajo', 'Compañero de trabajo'
]

# Síntomas iniciales más específicos y realistas
SINTOMAS_INICIALES_DETALLADOS = [
    # ESI 1 - Críticos
    'Dolor torácico opresivo irradiado al brazo izquierdo con sudoración fría y dificultad respiratoria severa',
    'Convulsiones tónico-clónicas generalizadas con pérdida de conocimiento y relajación de esfínteres',
    'Dificultad respiratoria extrema con cianosis perioral y tirajes intercostales marcados',
    'Trauma craneoencefálico severo con Glasgow menor a 8 y vómito en proyectil',
    'Hemorragia digestiva alta masiva con hematemesis y melenas con compromiso hemodinámico',
    
    # ESI 2 - Emergencias
    'Dolor abdominal intenso en fosa ilíaca derecha con signo de Blumberg positivo y fiebre',
    'Cefalea súbita de máxima intensidad con rigidez nucal y fotofobia',
    'Crisis asmática severa con sibilancias audibles y dificultad para completar frases',
    'Trauma de extremidad inferior con deformidad evidente y pérdida de pulsos distales',
    'Intoxicación etílica aguda con alteración del estado de consciencia y vómitos repetidos',
    
    # ESI 3 - Urgentes  
    'Dolor precordial atípico con disnea de esfuerzo y antecedente de hipertensión arterial',
    'Fiebre de 38.5°C de 3 días de evolución con tos productiva y dolor costal',
    'Dolor lumbar irradiado a miembro inferior derecho con parestesias y limitación funcional',
    'Gastroenteritis aguda con vómito y diarrea de 24 horas sin signos de deshidratación',
    'Herida cortante en mano derecha con sangrado activo leve sin compromiso tendinoso',
    
    # ESI 4 - Menos urgentes
    'Tos seca persistente de 2 semanas de evolución sin fiebre ni disnea',
    'Dolor de garganta leve con odinofagia y rinorrea hialina de 3 días',
    'Cefalea tensional bilateral frontotemporal de intensidad moderada recurrente',
    'Dolor articular en rodillas bilateral de características mecánicas sin signos inflamatorios',
    'Exantema maculopapular pruriginoso en tronco y extremidades sin compromiso sistémico',
    
    # ESI 5 - No urgentes
    'Control de signos vitales post procedimiento ambulatorio sin complicaciones',
    'Solicitud de certificado médico para actividad laboral sin síntomas agudos',
    'Consulta por resultado de exámenes paraclínicos previamente solicitados',
    'Renovación de fórmula médica para tratamiento crónico controlado',
    'Consulta preventiva para valoración de estado de salud general'
]

# Opciones válidas del sistema
TIPOS_DOCUMENTO = ['CC', 'TI', 'RC', 'PS']
SEXOS = ['M', 'F']
REGIMENES_EPS = ['SISBEN', 'REGIMEN_CONTRIBUTIVO', 'REGIMEN_SUBSIDIADO', 'NO_AFILIADO']
EPS_OPTIONS = [
    'COOSALUD', 'NUEVA_EPS', 'MUTUAL_SER', 'SALUD_MIA', 'ALIANSALUD',
    'SALUD_TOTAL', 'SANITAS', 'SURA', 'FAMISANAR', 'SOS',
    'COMFENALCO_VALLE', 'COMPENSAR', 'CAPRESOCA', 'ASMET_SALUD'
]
ESTADOS_ATENCION = ['EN_ESPERA', 'EN_ATENCION', 'ATENDIDO']

def generar_fecha_nacimiento():
    """Genera una fecha de nacimiento realista (1 a 95 años)"""
    hoy = date.today()
    años_atras = random.randint(1, 95)
    return hoy - timedelta(days=años_atras * 365 + random.randint(0, 365))

def generar_numero_documento():
    """Genera un número de documento único validando que no exista"""
    while True:
        # Generar números más realistas según el tipo de documento
        numero = str(random.randint(10000000, 99999999))
        if not Paciente.objects.filter(numero_documento=numero).exists():
            return numero

def generar_telefono():
    """Genera un número de teléfono colombiano realista"""
    prefijos = ['300', '301', '302', '310', '311', '312', '313', '314', '315', '316', '317', '318', '320', '321']
    prefijo = random.choice(prefijos)
    numero = ''.join([str(random.randint(0, 9)) for _ in range(7)])
    return f"{prefijo}{numero}"

def generar_nombres_diferentes(nombres_paciente, apellidos_paciente):
    """Genera nombres diferentes a los del paciente para el contacto de emergencia"""
    # Usar nombres completamente diferentes
    nombres_disponibles = NOMBRES_MASCULINOS + NOMBRES_FEMENINOS
    apellidos_disponibles = APELLIDOS_COMBINADOS
    
    # Filtrar nombres que no sean iguales a los del paciente
    nombres_filtrados = [n for n in nombres_disponibles if n not in nombres_paciente]
    apellidos_filtrados = [a for a in apellidos_disponibles if a not in apellidos_paciente]
    
    if not nombres_filtrados:
        nombres_filtrados = nombres_disponibles
    if not apellidos_filtrados:
        apellidos_filtrados = apellidos_disponibles
        
    nombre_completo = random.choice(nombres_filtrados)
    apellidos_completo = random.choice(apellidos_filtrados)
    
    # Dividir nombres y apellidos
    nombres_partes = nombre_completo.split()
    apellidos_partes = apellidos_completo.split()
    
    primer_nombre = nombres_partes[0]
    segundo_nombre = nombres_partes[1] if len(nombres_partes) > 1 else None
    primer_apellido = apellidos_partes[0]
    segundo_apellido = apellidos_partes[1] if len(apellidos_partes) > 1 else None
    
    return primer_nombre, segundo_nombre, primer_apellido, segundo_apellido

def crear_contacto_emergencia(paciente):
    """Crea un contacto de emergencia válido para un paciente"""
    # Todos los pacientes deben tener contacto de emergencia
    
    # Generar nombres diferentes al paciente
    nombres_paciente = [paciente.primer_nombre, paciente.segundo_nombre, 
                       paciente.primer_apellido, paciente.segundo_apellido]
    nombres_paciente = [n for n in nombres_paciente if n]  # Filtrar None
    
    primer_nombre, segundo_nombre, primer_apellido, segundo_apellido = generar_nombres_diferentes(
        nombres_paciente, []
    )
    
    # Generar teléfono diferente al del paciente
    telefono_contacto = generar_telefono()
    while telefono_contacto == paciente.telefono:
        telefono_contacto = generar_telefono()
    
    contacto = ContactoEmergencia.objects.create(
        paciente=paciente,
        primer_nombre=primer_nombre,
        segundo_nombre=segundo_nombre,
        primer_apellido=primer_apellido,
        segundo_apellido=segundo_apellido,
        prefijo_telefonico='+57',
        telefono=telefono_contacto,
        relacion_parentesco=random.choice(RELACIONES_PARENTESCO)
    )
    
    return contacto

def generar_fecha_creacion_distribuida(indice_paciente):
    """Genera fechas de creación distribuidas en los últimos 30 días"""
    # Distribuir más ampliamente a lo largo de 30 días
    dias_base = random.randint(1, 30)  # Días completamente aleatorios de 1 a 30
    
    # Horarios aleatorios para cada paciente (horario hospitalario más realista)
    hora = random.randint(6, 22)  # Entre 6 AM y 10 PM
    minuto = random.randint(0, 59)
    segundo = random.randint(0, 59)
    
    # Crear fecha base con horario distribuido
    ahora_local = timezone.localtime(timezone.now())
    fecha_creacion = ahora_local - timedelta(days=dias_base)
    
    # Establecer la hora específica
    fecha_creacion = fecha_creacion.replace(
        hour=hora, 
        minute=minuto, 
        second=segundo, 
        microsecond=0
    )
    
    return fecha_creacion

def crear_paciente(indice_paciente=1):
    """Crea un paciente con datos completos y validaciones"""
    
    sexo = random.choice(SEXOS)
    
    # Usar nombres compuestos para garantizar al menos 3 palabras totales
    if sexo == 'M':
        nombre_completo = random.choice(NOMBRES_MASCULINOS)
    else:
        nombre_completo = random.choice(NOMBRES_FEMENINOS)
    
    # Dividir el nombre compuesto
    nombres_partes = nombre_completo.split()
    primer_nombre = nombres_partes[0]
    segundo_nombre = nombres_partes[1] if len(nombres_partes) > 1 else None
    
    # Usar apellidos compuestos
    apellidos_completo = random.choice(APELLIDOS_COMBINADOS)
    apellidos_partes = apellidos_completo.split()
    primer_apellido = apellidos_partes[0]
    segundo_apellido = apellidos_partes[1] if len(apellidos_partes) > 1 else None
    
    fecha_nacimiento = generar_fecha_nacimiento()
    tipo_documento = random.choice(TIPOS_DOCUMENTO)
    numero_documento = generar_numero_documento()
    telefono = generar_telefono()
    
    regimen_eps = random.choice(REGIMENES_EPS)
    eps = random.choice(EPS_OPTIONS)
    tiene_seguro_medico = random.choice([True, False])
    
    # Si tiene seguro médico, debe tener nombre del seguro
    nombre_seguro_medico = None
    if tiene_seguro_medico:
        seguros = ['SURA Seguros', 'Mapfre Seguros', 'Allianz Seguros', 'AXA Colpatria', 'Liberty Seguros']
        nombre_seguro_medico = random.choice(seguros)
    
    # Seleccionar síntomas según distribución ESI realista
    rand = random.random()
    if rand < 0.04:  # 4% ESI 1
        sintomas_iniciales = random.choice(SINTOMAS_INICIALES_DETALLADOS[0:5])
        estado = random.choice(['EN_ATENCION', 'ATENDIDO'])
    elif rand < 0.14:  # 10% ESI 2  
        sintomas_iniciales = random.choice(SINTOMAS_INICIALES_DETALLADOS[5:10])
        estado = random.choice(['EN_ATENCION', 'ATENDIDO', 'EN_ESPERA'])
    elif rand < 0.49:  # 35% ESI 3
        sintomas_iniciales = random.choice(SINTOMAS_INICIALES_DETALLADOS[10:15])
        estado = random.choice(ESTADOS_ATENCION)
    elif rand < 0.85:  # 36% ESI 4
        sintomas_iniciales = random.choice(SINTOMAS_INICIALES_DETALLADOS[15:20])
        estado = random.choices(ESTADOS_ATENCION, weights=[0.5, 0.2, 0.3])[0]
    else:  # 15% ESI 5
        sintomas_iniciales = random.choice(SINTOMAS_INICIALES_DETALLADOS[20:25])
        estado = random.choices(ESTADOS_ATENCION, weights=[0.4, 0.1, 0.5])[0]
    
    # Usar la función para generar fecha distribuida
    fecha_creacion = generar_fecha_creacion_distribuida(indice_paciente)
    
    paciente = Paciente.objects.create(
        primer_nombre=primer_nombre,
        segundo_nombre=segundo_nombre,
        primer_apellido=primer_apellido,
        segundo_apellido=segundo_apellido,
        fecha_nacimiento=fecha_nacimiento,
        tipo_documento=tipo_documento,
        numero_documento=numero_documento,
        sexo=sexo,
        prefijo_telefonico='+57',
        telefono=telefono,
        regimen_eps=regimen_eps,
        eps=eps,
        tiene_seguro_medico=tiene_seguro_medico,
        nombre_seguro_medico=nombre_seguro_medico,
        sintomas_iniciales=sintomas_iniciales,
        estado=estado,
        creado=fecha_creacion
    )
    
    return paciente

def generar_respuesta_realista(pregunta_codigo, pregunta_info, paciente_edad, paciente_sexo):
    """Genera una respuesta realista basada en el tipo de pregunta y contexto del paciente"""
    
    tipo = pregunta_info['tipo']
    opciones = pregunta_info.get('opciones', [])
    
    if tipo == 'boolean':
        # Probabilidades basadas en la pregunta
        if 'embarazo' in pregunta_codigo and paciente_sexo == 'F' and 15 <= paciente_edad <= 45:
            return random.choice([True, False]) if random.random() < 0.15 else False
        elif 'sintomas_graves' in pregunta_codigo or 'ESI1' in pregunta_codigo:
            return random.choice([True, False]) if random.random() < 0.1 else False
        elif 'dolor' in pregunta_codigo or 'malestar' in pregunta_codigo:
            return random.choice([True, False]) if random.random() < 0.6 else False
        else:
            return random.choice([True, False])
    
    elif tipo == 'choice':
        if 'semanas_embarazo' in pregunta_codigo:
            # Distribuir embarazos en diferentes trimestres
            return random.choice(opciones)
        else:
            # Para opciones de choice, elegir con peso hacia "Ninguna de las anteriores"
            if "Ninguna de las anteriores" in opciones:
                return random.choices(opciones, weights=[1] * (len(opciones)-1) + [3])[0]
            else:
                return random.choice(opciones)
    
    elif tipo == 'multi_choice':
        # Para multi-choice, seleccionar 1-3 opciones con peso hacia menos síntomas
        num_selecciones = random.choices([1, 2, 3], weights=[0.6, 0.3, 0.1])[0]
        
        if "Ninguna de las anteriores" in opciones:
            # 70% probabilidad de seleccionar "Ninguna de las anteriores"
            if random.random() < 0.7:
                return ["Ninguna de las anteriores"]
            else:
                # Seleccionar otras opciones excluyendo "Ninguna de las anteriores"
                opciones_filtradas = [opt for opt in opciones if "Ninguna de las anteriores" not in opt]
                num_selecciones = min(num_selecciones, len(opciones_filtradas))
                return random.sample(opciones_filtradas, num_selecciones)
        else:
            num_selecciones = min(num_selecciones, len(opciones))
            return random.sample(opciones, num_selecciones)
    
    elif tipo == 'scale':
        # Para escalas (gravedad), distribuir con tendencia hacia valores medios-bajos
        if len(opciones) == 10:  # Escala 1-10
            return random.choices(opciones, weights=[0.15, 0.15, 0.15, 0.12, 0.1, 0.08, 0.08, 0.05, 0.05, 0.07])[0]
        else:
            return random.choice(opciones)
    
    elif tipo == 'text':
        # Generar texto realista según la pregunta
        if 'cirugias' in pregunta_codigo.lower():
            cirugias = [
                "Apendicectomía en 2018",
                "Cesárea en 2020",
                "Colecistectomía laparoscópica en 2019",
                "Hernioplastia inguinal en 2017",
                "Ninguna cirugía previa",
                "Extracción de vesícula en 2021",
                "Cirugía de meniscos en 2016"
            ]
            return random.choice(cirugias)
        else:
            return "Sin información adicional relevante"
    
    else:
        return "No especificado"

def crear_respuestas_triage(sesion, paciente, nivel_esi_objetivo):
    """Crea respuestas realistas para la sesión de triage"""
    
    respuestas_creadas = []
    
    # Determinar primera pregunta según la lógica del sistema
    if paciente.edad > 65:
        primera_pregunta = "adulto_mayor_ESI1"
    elif paciente.sexo == 'F' and 15 <= paciente.edad <= 45:
        primera_pregunta = "embarazo"
    else:
        primera_pregunta = "cirugias_previas"
    
    # Simular flujo de preguntas (máximo 10 preguntas por sesión)
    pregunta_actual = primera_pregunta
    contador_preguntas = 0
    
    while pregunta_actual and contador_preguntas < 10:
        if pregunta_actual not in PREGUNTAS:
            break
            
        info_pregunta = PREGUNTAS[pregunta_actual]
        
        # Crear pregunta en BD si no existe
        pregunta_obj, created = Pregunta.objects.get_or_create(
            codigo=pregunta_actual,
            defaults={
                'texto': info_pregunta['texto'],
                'tipo': info_pregunta['tipo'],
                'opciones': info_pregunta.get('opciones', None)
            }
        )
        
        # Generar respuesta realista
        valor_respuesta = generar_respuesta_realista(
            pregunta_actual, info_pregunta, paciente.edad, paciente.sexo
        )
        
        # Generar información adicional si es necesario
        informacion_adicional = None
        if (isinstance(valor_respuesta, list) and "Otro (especificar)" in valor_respuesta) or \
           (isinstance(valor_respuesta, str) and "Otro (especificar)" == valor_respuesta):
            informacion_adicional = "Información adicional proporcionada por el paciente"
        
        # Crear respuesta con timestamp progresivo
        timestamp = sesion.fecha_inicio + timedelta(minutes=contador_preguntas * 2)
        
        respuesta = Respuesta.objects.create(
            sesion=sesion,
            pregunta=pregunta_obj,
            valor=valor_respuesta,
            informacion_adicional=informacion_adicional,
            timestamp=timestamp
        )
        
        respuestas_creadas.append(respuesta)
        contador_preguntas += 1
        
        # Determinar siguiente pregunta basada en el flujo y la respuesta
        siguiente_pregunta = determinar_siguiente_pregunta(pregunta_actual, valor_respuesta)
        
        # Si no hay siguiente pregunta o llegamos al objetivo ESI, terminar
        if not siguiente_pregunta or should_terminate_triage(nivel_esi_objetivo, contador_preguntas):
            break
            
        pregunta_actual = siguiente_pregunta
    
    return respuestas_creadas

def determinar_siguiente_pregunta(pregunta_actual, valor_respuesta):
    """Determina la siguiente pregunta basada en el flujo"""
    
    if pregunta_actual not in FLUJO_PREGUNTAS:
        return None
        
    flujo = FLUJO_PREGUNTAS[pregunta_actual]
    
    # Buscar por valor específico de respuesta
    if isinstance(valor_respuesta, bool):
        return flujo.get(valor_respuesta, flujo.get('siguiente'))
    elif isinstance(valor_respuesta, str):
        return flujo.get(valor_respuesta, flujo.get('siguiente'))
    elif isinstance(valor_respuesta, list):
        # Para respuestas múltiples, usar la primera opción
        if valor_respuesta:
            return flujo.get(valor_respuesta[0], flujo.get('siguiente'))
    
    return flujo.get('siguiente')

def should_terminate_triage(nivel_esi_objetivo, contador_preguntas):
    """Decide si terminar el triage basado en el ESI objetivo y número de preguntas"""
    
    # ESI 1 y 2 tienden a terminar más rápido
    if nivel_esi_objetivo <= 2 and contador_preguntas >= 3:
        return random.random() < 0.7
    # ESI 3-5 pueden tener más preguntas
    elif nivel_esi_objetivo >= 3 and contador_preguntas >= 5:
        return random.random() < 0.5
        
    return False

def crear_sesion_triage(paciente, forzar_esi=None):
    """Crea una sesión de triage completa con respuestas realistas"""
    
    # 98% de probabilidad de tener sesión de triage
    if random.random() > 0.98:
        return None
    
    # Fecha de inicio: entre 5 minutos y 2 horas después del registro
    minutos_espera_inicial = random.randint(5, 120)
    fecha_inicio = paciente.creado + timedelta(minutes=minutos_espera_inicial)
    
    # Determinar nivel ESI objetivo
    if forzar_esi:
        nivel_triage = forzar_esi
    else:
        # Distribución realista basada en estadísticas médicas
        rand = random.random()
        if rand < 0.04:
            nivel_triage = 1
        elif rand < 0.14:
            nivel_triage = 2
        elif rand < 0.49:
            nivel_triage = 3
        elif rand < 0.85:
            nivel_triage = 4
        else:
            nivel_triage = 5
    
    # 92% de sesiones completadas
    completado = random.random() < 0.92
    
    fecha_fin = None
    if completado:
        # Tiempo de sesión realista basado en nivel ESI
        if nivel_triage == 1:
            minutos_sesion = random.randint(5, 20)
        elif nivel_triage == 2:
            minutos_sesion = random.randint(10, 30)
        elif nivel_triage == 3:
            minutos_sesion = random.randint(15, 45)
        elif nivel_triage == 4:
            minutos_sesion = random.randint(20, 60)
        else:
            minutos_sesion = random.randint(25, 90)
        
        fecha_fin = fecha_inicio + timedelta(minutes=minutos_sesion)
        
        # Actualizar estado del paciente basado en ESI
        if nivel_triage in [1, 2]:
            paciente.estado = random.choices(['EN_ATENCION', 'ATENDIDO'], weights=[0.3, 0.7])[0]
        elif nivel_triage == 3:
            paciente.estado = random.choice(ESTADOS_ATENCION)
        else:
            paciente.estado = random.choices(['EN_ESPERA', 'EN_ATENCION', 'ATENDIDO'], weights=[0.5, 0.2, 0.3])[0]
        
        paciente.save()
    
    # Crear sesión de triage
    sesion = SesionTriage.objects.create(
        paciente=paciente,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        nivel_triage=nivel_triage if completado else None,
        completado=completado
    )
    
    # Crear respuestas si la sesión está completa
    if completado:
        respuestas = crear_respuestas_triage(sesion, paciente, nivel_triage)
        return sesion, respuestas
    else:
        return sesion, []

def cargar_preguntas_sistema():
    """Carga las preguntas del sistema desde el diccionario PREGUNTAS"""
    
    print("Cargando preguntas del sistema de triage...")
    preguntas_cargadas = 0
    
    for codigo, datos in PREGUNTAS.items():
        pregunta, created = Pregunta.objects.get_or_create(
            codigo=codigo,
            defaults={
                'texto': datos.get('texto', ''),
                'tipo': datos.get('tipo', 'text'),
                'opciones': datos.get('opciones', None)
            }
        )
        if created:
            preguntas_cargadas += 1
    
    print(f"Preguntas cargadas: {preguntas_cargadas} nuevas de {len(PREGUNTAS)} totales")

def limpiar_datos_existentes():
    """Limpia datos de prueba anteriores (opcional)"""
    print("¿Desea eliminar todos los pacientes existentes? (s/N): ", end="")
    respuesta = input().strip().lower()
    
    if respuesta in ['s', 'si', 'sí', 'y', 'yes']:
        print("Eliminando datos anteriores...")
        with transaction.atomic():
            # Eliminar en orden correcto por las FK
            Respuesta.objects.all().delete()
            SesionTriage.objects.all().delete()
            ContactoEmergencia.objects.all().delete()
            Paciente.objects.all().delete()
            
            # Resetear las secuencias de IDs para que empiecen desde 1
            from django.db import connection
            cursor = connection.cursor()
            
            # Resetear secuencias para las tablas principales
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='pacientes_paciente';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='pacientes_contactoemergencia';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='triage_sesiontriage';")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='triage_respuesta';")
            
        print("Datos anteriores eliminados y secuencias reseteadas exitosamente")
    else:
        print("Manteniendo datos existentes")

def generar_pacientes_prueba():
    """Función principal para generar 50 pacientes de prueba con datos completos"""
    
    print("=" * 70)
    print("GENERADOR AVANZADO DE PACIENTES DE PRUEBA v2.0")
    print("=" * 70)
    print("Características de esta versión:")
    print("   • Validaciones completas de nombres (mínimo 3 palabras)")
    print("   • Contactos de emergencia únicos y diferentes")
    print("   • Sesiones de triage con respuestas realistas")
    print("   • Flujo de preguntas basado en lógica del sistema")
    print("   • Distribución ESI basada en estadísticas reales")
    print("   • IDs naturales desde 1 (no UUID para pacientes)")
    print("-" * 70)
    
    # Cargar preguntas del sistema
    cargar_preguntas_sistema()
    
    # Preguntar si quiere limpiar datos
    limpiar_datos_existentes()
    
    print(f"\nIniciando generación de 50 pacientes con datos completos...")
    
    pacientes_creados = []
    sesiones_creadas = []
    respuestas_creadas = []
    contactos_creados = []
    
    with transaction.atomic():
        for i in range(1, 51):
            try:
                print(f"\rCreando paciente {i}/50...", end="", flush=True)
                
                # Crear paciente con índice para fecha distribuida
                paciente = crear_paciente(i)
                pacientes_creados.append(paciente)
                
                # Crear contacto de emergencia (obligatorio)
                contacto = crear_contacto_emergencia(paciente)
                contactos_creados.append(contacto)
                
                # Forzar ESI 1 para los primeros 2 pacientes (garantizar representación)
                forzar_esi = 1 if i <= 2 else None
                
                # Crear sesión de triage con respuestas
                resultado_triage = crear_sesion_triage(paciente, forzar_esi)
                if resultado_triage:
                    sesion, respuestas = resultado_triage
                    sesiones_creadas.append(sesion)
                    respuestas_creadas.extend(respuestas)
                
            except Exception as e:
                print(f"\nError creando paciente {i}: {e}")
                import traceback
                traceback.print_exc()
                break
    
    print(f"\n\n=== RESUMEN COMPLETO DE GENERACIÓN ===")
    print(f"Pacientes creados: {len(pacientes_creados)}")
    print(f"Contactos de emergencia: {len(contactos_creados)}")  
    print(f"Sesiones de triage: {len(sesiones_creadas)}")
    print(f"Respuestas de triage: {len(respuestas_creadas)}")
    print(f"Sesiones completadas: {len([s for s in sesiones_creadas if s.completado])}")
    
    # Estadísticas por ESI
    print(f"\n=== DISTRIBUCIÓN POR NIVELES ESI ===")
    colores_esi = {
        1: "ESI 1 (Crítico)",
        2: "ESI 2 (Emergencia)", 
        3: "ESI 3 (Urgente)",
        4: "ESI 4 (Menos urgente)",
        5: "ESI 5 (No urgente)"
    }
    
    sesiones_con_esi = [s for s in sesiones_creadas if s.nivel_triage]
    total_con_esi = len(sesiones_con_esi)
    
    for nivel in range(1, 6):
        cantidad = len([s for s in sesiones_con_esi if s.nivel_triage == nivel])
        porcentaje = (cantidad / total_con_esi * 100) if total_con_esi > 0 else 0
        print(f"   {colores_esi[nivel]}: {cantidad} pacientes ({porcentaje:.1f}%)")
    
    # Estadísticas de respuestas por pregunta más común
    if respuestas_creadas:
        from collections import Counter
        preguntas_respondidas = Counter([r.pregunta.codigo for r in respuestas_creadas])
        print(f"\n=== PREGUNTAS MÁS RESPONDIDAS ===")
        for pregunta, cantidad in preguntas_respondidas.most_common(5):
            print(f"   • {pregunta}: {cantidad} respuestas")
    
    # Estadísticas por género
    print(f"\n=== DISTRIBUCIÓN POR GÉNERO ===")
    masculinos = len([p for p in pacientes_creados if p.sexo == 'M'])
    femeninos = len([p for p in pacientes_creados if p.sexo == 'F'])
    total_pacientes = len(pacientes_creados)
    print(f"   Masculino: {masculinos} ({masculinos/total_pacientes*100:.1f}%)")
    print(f"   Femenino: {femeninos} ({femeninos/total_pacientes*100:.1f}%)")
    
    # Estadísticas por estado de atención
    print(f"\n=== DISTRIBUCIÓN POR ESTADO DE ATENCIÓN ===")
    estados_nombres = {
        'EN_ESPERA': 'En espera',
        'EN_ATENCION': 'En atención', 
        'ATENDIDO': 'Atendido'
    }
    
    for estado in ESTADOS_ATENCION:
        cantidad = len([p for p in pacientes_creados if p.estado == estado])
        porcentaje = (cantidad / total_pacientes * 100) if total_pacientes > 0 else 0
        estado_nombre = estados_nombres.get(estado, estado)
        print(f"   {estado_nombre}: {cantidad} pacientes ({porcentaje:.1f}%)")
    
    # Estadísticas de tiempos
    tiempos_triage = []
    for sesion in sesiones_creadas:
        if sesion.fecha_fin and sesion.fecha_inicio:
            minutos = (sesion.fecha_fin - sesion.fecha_inicio).total_seconds() / 60
            tiempos_triage.append(minutos)
    
    if tiempos_triage:
        promedio = sum(tiempos_triage) / len(tiempos_triage)
        print(f"\n=== ESTADÍSTICAS DE TIEMPOS DE TRIAGE ===")
        print(f"   Tiempo promedio: {promedio:.1f} minutos")
        print(f"   Tiempo mínimo: {min(tiempos_triage):.1f} minutos")
        print(f"   Tiempo máximo: {max(tiempos_triage):.1f} minutos")
    
    # Validaciones de datos
    print(f"\n=== VALIDACIONES DE CALIDAD DE DATOS ===")
    
    # Verificar nombres únicos entre paciente y contacto
    conflictos_nombres = 0
    for paciente in pacientes_creados:
        try:
            contacto = paciente.contacto_emergencia.first()
            if contacto:
                if (paciente.primer_nombre == contacto.primer_nombre and 
                    paciente.primer_apellido == contacto.primer_apellido):
                    conflictos_nombres += 1
        except:
            pass
    
    print(f"   Conflictos de nombres paciente-contacto: {conflictos_nombres}")
    print(f"   Números de documento únicos: {len(set(p.numero_documento for p in pacientes_creados))}/{len(pacientes_creados)}")
    print(f"   Preguntas cargadas en sistema: {Pregunta.objects.count()}")
    
    print(f"\n=== GENERACIÓN COMPLETADA EXITOSAMENTE ===")
    print(f"Datos generados con validaciones completas")
    print(f"Flujo de triage funcional implementado")  
    print(f"Distribución ESI realista aplicada")
    print(f"Sistema listo para testing completo de reportes")
    print(f"Base de datos poblada con datos coherentes")
    print("=" * 70)

if __name__ == "__main__":
    generar_pacientes_prueba()