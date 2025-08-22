"""
Módulo que contiene la definición de las preguntas para el sistema de triage.
Las preguntas están basadas en el diagrama de flujo del archivo:
"Flujos de decisión PRETRIAGE.drawio.xml"
"""

# Definición de preguntas para el sistema de triage
PREGUNTAS = {
    # Preguntas de evaluación inicial
    "mayor_riesgo": {
        "texto": "¿Presenta alguno de estos síntomas de mayor riesgo?",
        "tipo": "choice",
        "opciones": ["Dolor intenso", "Sangrado", "Fiebre alta", "Dificultad para respirar", "Ninguno"]
    },
    "embarazo": {
        "texto": "¿Está embarazada?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "semanas_embarazo": {
        "texto": "¿Cuántas semanas de embarazo tiene?",
        "tipo": "numeric",
        "unidad": "semanas"
    },
    "sangrado_embarazo": {
        "texto": "¿Presenta sangrado vaginal?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_abdominal_embarazo": {
        "texto": "¿Presenta dolor abdominal intenso?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre dificultad respiratoria
    "dificultad_respiratoria": {
        "texto": "¿Experimenta sensación de ahogo o falta de aire?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dificultad_respirar_esfuerzo": {
        "texto": "¿En reposo o con mínimo esfuerzo?",
        "tipo": "choice",
        "opciones": ["En reposo", "Con esfuerzo mínimo", "Solo con actividad intensa"]
    },
    "habla_entrecortada": {
        "texto": "¿Al hablar, tiene que parar para tomar aire entre cada 2-3 palabras para respirar?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "silbido_respirar": {
        "texto": "¿Al respirar hace un silbido como de asma?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre dolor en el pecho
    "dolor_pecho": {
        "texto": "¿Tiene dolor en el pecho?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_pecho_sudoracion": {
        "texto": "¿Con sudoración fría o irradiación?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_pecho_tipo": {
        "texto": "¿El dolor de pecho es como un peso aplastante o quemazón?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_pecho_respirar": {
        "texto": "¿El dolor empeora al respirar hondo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre parálisis o debilidad
    "debilidad_extremidades": {
        "texto": "¿No puede mover un brazo/pierna de repente?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre dolor abdominal
    "dolor_abdominal": {
        "texto": "¿Tiene dolor abdominal intenso o vómitos?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_abdominal_intensidad": {
        "texto": "¿El dolor es tan fuerte que no encuentra posición cómoda?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "vomito_sangre": {
        "texto": "¿El vómito tiene sangre o parece café molido (negro)?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "incapacidad_caminar": {
        "texto": "¿Tiene incapacidad para caminar?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre hemorragias
    "tos_sangre": {
        "texto": "¿Tose sangre o flemas con sangre fresca?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre síntomas principales
    "sintoma_principal": {
        "texto": "¿Qué síntoma principal tiene?",
        "tipo": "choice",
        "opciones": ["Dificultad respiratoria", "Dolor abdominal", "Dolor de cabeza", "Ninguna de las anteriores"]
    },
    "respiracion_rapida": {
        "texto": "¿Respira más rápido de lo normal (más de 1 respiración por segundo)?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_abdomen_postura": {
        "texto": "¿El dolor es tan fuerte que no puede pararse derecho?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "estreñimiento_hinchazón": {
        "texto": "¿Ha dejado de ir al baño por más de 3 días con hinchazón?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_cabeza_intenso": {
        "texto": "¿El dolor de cabeza es el peor que ha sentido en su vida?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "vision_alterada": {
        "texto": "¿Ve luces brillantes o pierde visión por segundos?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre estado mental
    "confusion": {
        "texto": "¿Tiene confusión?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "perdida_memoria": {
        "texto": "¿Ha tenido momentos donde no recuerda qué hizo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "alucinaciones": {
        "texto": "¿Ve luces o formas raras que no existen?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas para adultos mayores
    "mareo_severo": {
        "texto": "¿Se ha sentido tan mareado que casi se cae al pararse?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "escalofrios_severos": {
        "texto": "¿Ha tenido escalofríos tan fuertes que le tiembla el cuerpo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "cianosis": {
        "texto": "¿Se le han puesto los labios o uñas morados?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "palpitaciones": {
        "texto": "¿Siente el corazón tan acelerado que lo escucha en sus oídos como si hubiera corrido estando quieto?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "dolor_opresivo": {
        "texto": "¿El dolor de pecho es como si alguien le estuviera pisando fuerte?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "fiebre_sintomas": {
        "texto": "¿Qué le duele o molesta más?",
        "tipo": "choice",
        "opciones": ["Cabeza", "Garganta", "Cuerpo", "Estómago", "Pecho", "Otro"]
    },
    "sintomas_generales": {
        "texto": "¿Presenta alguno de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Sudoración", "Escalofríos", "Dolor de cabeza", "Dolores musculares", "Pérdida de apetito", "Irritabilidad", "Debilidad general", "Ninguno"]
    },
    
    # Preguntas sobre síntomas leves
    "sintomas_leves": {
        "texto": "¿Tiene síntomas leves (tos, dolor de garganta, diarrea)?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas sobre antecedentes médicos
    "alergia_relacionada": {
        "texto": "¿Su síntoma está relacionado con sus alergias?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "condicion_medica_relacionada": {
        "texto": "¿Su síntoma está relacionado con su condición médica?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para diabetes
    "diabetes_inestabilidad": {
        "texto": "¿El paciente presenta signos de inestabilidad vital?",
        "tipo": "multi_choice",
        "opciones": ["Respiración rápida", "Confusión", "Pérdida del conocimiento", "Piel fría/húmeda", "Pulso débil", "Ninguno"]
    },
    "diabetes_sintomas": {
        "texto": "¿Hay síntomas como?",
        "tipo": "multi_choice",
        "opciones": ["Vómitos persistentes", "Dolor abdominal intenso", "Deshidratación grave", "Hormigueo intenso", "Ninguno"]
    },
    "diabetes_vision": {
        "texto": "¿Tiene visión borrosa, debilidad extrema o fatiga, pérdida de peso?",
        "tipo": "multi_choice",
        "opciones": ["Visión borrosa", "Debilidad extrema", "Fatiga", "Pérdida de peso", "Ninguno"]
    },
    "diabetes_sintomas_leves": {
        "texto": "¿Presenta hambre aumentada o irritabilidad leve, no presenta más síntomas graves?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "diabetes_control": {
        "texto": "¿Control rutinario de diabetes sin síntomas nuevos?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para asma
    "asma_inestabilidad": {
        "texto": "¿El paciente presenta signos como inestabilidad o fallo respiratorio?",
        "tipo": "multi_choice",
        "opciones": ["Labios azulados", "Alteración del estado mental", "Incapacidad para caminar por dificultad respiratoria", "Ninguno"]
    },
    "asma_sibilancias": {
        "texto": "¿Tiene sibilancias en la respiración, uso del inhalador sin mejora?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "asma_tos": {
        "texto": "¿Presenta tos, necesidad de usar inhalador más de dos veces por semana?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "asma_leve": {
        "texto": "¿Presenta tos ocasional que mejora con el inhalador, sibilancias leves durante ejercicios o exposición a alérgenos?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "asma_control": {
        "texto": "¿Control rutinario de asma estable?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para ACV (Accidente Cerebrovascular)
    "acv_inconciencia": {
        "texto": "¿El paciente presenta pérdida de conciencia, convulsiones activas, vómitos, postura decorticada?",
        "tipo": "multi_choice",
        "opciones": ["Pérdida de conciencia", "Convulsiones", "Vómitos", "Postura decorticada", "Ninguno"]
    },
    "acv_sintomas": {
        "texto": "¿Hay asimetría facial al sonreír, hay debilidad o incapacidad para levantar el brazo, dificultad para hablar o para entender el lenguaje?",
        "tipo": "multi_choice",
        "opciones": ["Asimetría facial", "Debilidad en brazos", "Dificultad para hablar", "Dificultad para entender", "Ninguno"]
    },
    "acv_sintomas_leves": {
        "texto": "¿Los síntomas desaparecen después de horas, mareos aislados sin otros síntomas, dolor de cabeza leves?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "acv_seguimiento": {
        "texto": "¿Consulta para seguimiento o síntomas no relacionados?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para insuficiencia cardiaca
    "ic_inestabilidad": {
        "texto": "¿El paciente presenta signos como?",
        "tipo": "multi_choice",
        "opciones": ["Falta de aire extrema", "Tos con esputo rosado", "Crepitantes pulmonares", "Piel fría/húmeda", "Taquicardia", "Ninguno"]
    },
    "ic_retencion": {
        "texto": "¿Presenta aumento repentino de peso con retención de líquidos, disnea en reposo, dolor torácico sospechoso, hinchazón severa en piernas/abdomen con dificultad para moverse?",
        "tipo": "multi_choice",
        "opciones": ["Aumento de peso", "Retención de líquidos", "Disnea en reposo", "Dolor torácico", "Hinchazón severa", "Ninguno"]
    },
    "ic_sintomas_cronicos": {
        "texto": "¿Presenta síntomas crónicos que limitan las actividades diarias como: fatiga extrema al caminar, hinchazón moderada en piernas que mejora con reposo, palpitaciones ocasionales sin arritmia?",
        "tipo": "multi_choice",
        "opciones": ["Fatiga extrema", "Hinchazón moderada", "Palpitaciones ocasionales", "Ninguno"]
    },
    "ic_sintomas_leves": {
        "texto": "¿Hinchazón leve en tobillos, control de peso sin ganancia rápida, responde a diuréticos orales?",
        "tipo": "multi_choice",
        "opciones": ["Hinchazón leve", "Control de peso estable", "Responde a diuréticos", "Ninguno"]
    },
    "ic_medicacion": {
        "texto": "¿Revisión de medicación sin síntomas nuevos?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para hipertensión arterial
    "hta_dolor_cabeza": {
        "texto": "¿Tiene dolor de cabeza + visión borrosa?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "hta_manchas_vision": {
        "texto": "¿Ve manchas o lucecitas?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "hta_dolor_cabeza_intenso": {
        "texto": "¿Le duele la cabeza como nunca antes?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "hta_mareo": {
        "texto": "¿Tiene mareo severo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para enfermedad coronaria
    "ec_dolor_pecho_irradiado": {
        "texto": "¿Dolor en pecho como peso que irradia a brazo/mandíbula?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "ec_opresion_intensa": {
        "texto": "¿Siente que un elefante le pisó el pecho?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "ec_dolor_irradiado": {
        "texto": "¿El dolor le llega hasta el cuello/brazo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "ec_dolor_sudor": {
        "texto": "¿Dolor opresivo con sudor frío?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para EPOC
    "epoc_labios_azules": {
        "texto": "¿Labios/uñas azules + no puede hablar?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "epoc_silbido_respirar": {
        "texto": "¿Al respirar hace sonido de pitillo?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "epoc_tos_pegamento": {
        "texto": "¿Tose como si tuviera pegamento en los pulmones?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "epoc_silbidos_flemas": {
        "texto": "¿Silbidos al respirar + flemas verdes/amarillas?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    
    # Preguntas específicas para fibromialgia
    "fm_autolesion": {
        "texto": "¿El paciente presenta síntomas asociados a la autolesión?",
        "tipo": "boolean",
        "opciones": ["Sí", "No"]
    },
    "fm_deshidratacion": {
        "texto": "¿El paciente tiene deshidratación severa, síndrome de colon irritable, síncopes o taquicardia extrema, dolor torácico o sospecha de causa cardiaca?",
        "tipo": "multi_choice",
        "opciones": ["Deshidratación severa", "Síndrome de colon irritable", "Síncopes", "Taquicardia extrema", "Dolor torácico", "Ninguno"]
    },
    "fm_dolor_migraña": {
        "texto": "¿Migraña refractiva con vómitos y resistencia a analgesia, crisis de ansiedad o pánico con hiperventilación o rigidez muscular, dolor generalizado extremo?",
        "tipo": "multi_choice",
        "opciones": ["Migraña refractiva", "Crisis de ansiedad", "Dolor generalizado extremo", "Ninguno"]
    },
    "fm_dolor_moderado": {
        "texto": "¿Dolor moderado generalizado, trastornos del sueño graves como insomnio, síndrome de piernas inquietas?",
        "tipo": "multi_choice",
        "opciones": ["Dolor moderado", "Insomnio grave", "Síndrome de piernas inquietas", "Ninguno"]
    }
}

# Mapa de flujo de preguntas (qué pregunta sigue después de cada respuesta)
FLUJO_PREGUNTAS = {
    # Flujo básico inicial
    "inicio": "mayor_riesgo",
    
    # Flujo para preguntas de riesgo
    "mayor_riesgo": {
        "siguiente": "dificultad_respiratoria",
        "Ninguno": "dificultad_respiratoria",
        "default": "dificultad_respiratoria"  # Por defecto continuar con dificultad respiratoria
    },
    
    # Flujo para embarazo
    "embarazo": {
        "siguiente": "dificultad_respiratoria",
        "True": "semanas_embarazo"
    },
    "semanas_embarazo": {
        "siguiente": "sangrado_embarazo"
    },
    "sangrado_embarazo": {
        "siguiente": "dolor_abdominal_embarazo"
    },
    "dolor_abdominal_embarazo": {
        "siguiente": "dificultad_respiratoria"
    },
    
    # Flujo para dificultad respiratoria
    "dificultad_respiratoria": {
        "siguiente": "dolor_pecho",
        "True": "dificultad_respirar_esfuerzo"
    },
    "dificultad_respirar_esfuerzo": {
        "siguiente": "habla_entrecortada",
        "En reposo": "habla_entrecortada"
    },
    "habla_entrecortada": {
        "siguiente": "silbido_respirar"
    },
    "silbido_respirar": {
        "siguiente": "dolor_pecho"
    },
    
    # Flujo para dolor en el pecho
    "dolor_pecho": {
        "siguiente": "dolor_abdominal",
        "True": "dolor_pecho_sudoracion"
    },
    "dolor_pecho_sudoracion": {
        "siguiente": "dolor_pecho_tipo",
        "True": "dolor_pecho_tipo"
    },
    "dolor_pecho_tipo": {
        "siguiente": "debilidad_extremidades"
    },
    "dolor_pecho_respirar": {
        "siguiente": "debilidad_extremidades"
    },
    
    # Flujo para parálisis/debilidad
    "debilidad_extremidades": {
        "siguiente": "dolor_abdominal",
        "True": "dolor_abdominal"  # ESI 1 si es positivo, pero seguimos preguntando
    },
    
    # Flujo para dolor abdominal
    "dolor_abdominal": {
        "siguiente": "tos_sangre",
        "True": "dolor_abdominal_intensidad"
    },
    "dolor_abdominal_intensidad": {
        "siguiente": "incapacidad_caminar"
    },
    "vomito_sangre": {
        "siguiente": "tos_sangre"
    },
    "incapacidad_caminar": {
        "siguiente": "tos_sangre"
    },
    
    # Flujo para hemorragias
    "tos_sangre": {
        "siguiente": "sintoma_principal"
    },
    
    # Flujo para síntomas principales
    "sintoma_principal": {
        "siguiente": "confusion",
        "Dificultad respiratoria": "respiracion_rapida",
        "Dolor abdominal": "dolor_abdomen_postura",
        "Dolor de cabeza": "dolor_cabeza_intenso"
    },
    "respiracion_rapida": {
        "siguiente": "confusion"
    },
    "dolor_abdomen_postura": {
        "siguiente": "estreñimiento_hinchazón"
    },
    "estreñimiento_hinchazón": {
        "siguiente": "confusion"
    },
    "dolor_cabeza_intenso": {
        "siguiente": "vision_alterada"
    },
    "vision_alterada": {
        "siguiente": "confusion"
    },
    
    # Flujo para estado mental
    "confusion": {
        "siguiente": "sintomas_leves",
        "True": "perdida_memoria"
    },
    "perdida_memoria": {
        "siguiente": "alucinaciones"
    },
    "alucinaciones": {
        "siguiente": "sintomas_leves"
    },
    
    # Flujo para síntomas leves - último en el flujo normal
    "sintomas_leves": {
        "siguiente": None  # Fin del cuestionario
    },
    
    # Flujos específicos para condiciones médicas previas
    "alergia_relacionada": {
        "siguiente": "condicion_medica_relacionada"
    },
    "condicion_medica_relacionada": {
        "siguiente": "dificultad_respiratoria",
        "True": "diabetes_inestabilidad"  # Asumimos diabetes como ejemplo, pero esto dependerá de la condición médica específica
    },
    
    # Flujo específico para diabetes
    "diabetes_inestabilidad": {
        "siguiente": "diabetes_sintomas"
    },
    "diabetes_sintomas": {
        "siguiente": "diabetes_vision"
    },
    "diabetes_vision": {
        "siguiente": "diabetes_sintomas_leves"
    },
    "diabetes_sintomas_leves": {
        "siguiente": "diabetes_control"
    },
    "diabetes_control": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para asma
    "asma_inestabilidad": {
        "siguiente": "asma_sibilancias"
    },
    "asma_sibilancias": {
        "siguiente": "asma_tos"
    },
    "asma_tos": {
        "siguiente": "asma_leve"
    },
    "asma_leve": {
        "siguiente": "asma_control"
    },
    "asma_control": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para ACV
    "acv_inconciencia": {
        "siguiente": "acv_sintomas"
    },
    "acv_sintomas": {
        "siguiente": "acv_sintomas_leves"
    },
    "acv_sintomas_leves": {
        "siguiente": "acv_seguimiento"
    },
    "acv_seguimiento": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para insuficiencia cardiaca
    "ic_inestabilidad": {
        "siguiente": "ic_retencion"
    },
    "ic_retencion": {
        "siguiente": "ic_sintomas_cronicos"
    },
    "ic_sintomas_cronicos": {
        "siguiente": "ic_sintomas_leves"
    },
    "ic_sintomas_leves": {
        "siguiente": "ic_medicacion"
    },
    "ic_medicacion": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para hipertensión arterial
    "hta_dolor_cabeza": {
        "siguiente": "hta_manchas_vision",
        "True": "hta_manchas_vision",
        "False": "hta_mareo"
    },
    "hta_manchas_vision": {
        "siguiente": "hta_dolor_cabeza_intenso"
    },
    "hta_dolor_cabeza_intenso": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    "hta_mareo": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para enfermedad coronaria
    "ec_dolor_pecho_irradiado": {
        "siguiente": "ec_opresion_intensa",
        "True": "ec_opresion_intensa",
        "False": "ec_dolor_sudor"
    },
    "ec_opresion_intensa": {
        "siguiente": "ec_dolor_irradiado"
    },
    "ec_dolor_irradiado": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    "ec_dolor_sudor": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para EPOC
    "epoc_labios_azules": {
        "siguiente": "epoc_silbido_respirar",
        "True": "epoc_silbido_respirar",
        "False": "epoc_silbidos_flemas"
    },
    "epoc_silbido_respirar": {
        "siguiente": "epoc_tos_pegamento"
    },
    "epoc_tos_pegamento": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    "epoc_silbidos_flemas": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    },
    
    # Flujo específico para fibromialgia
    "fm_autolesion": {
        "siguiente": "fm_deshidratacion"
    },
    "fm_deshidratacion": {
        "siguiente": "fm_dolor_migraña"
    },
    "fm_dolor_migraña": {
        "siguiente": "fm_dolor_moderado"
    },
    "fm_dolor_moderado": {
        "siguiente": "dificultad_respiratoria"  # Volver al flujo principal
    }
}

# Reglas de clasificación ESI basadas en respuestas
REGLAS_ESI = [
    # Reglas para ESI 1 (Emergencia)
    {
        "condiciones": [
            {"pregunta": "mayor_riesgo", "valor": ["Dolor intenso", "Sangrado", "Fiebre alta", "Dificultad para respirar"]},
            {"pregunta": "dificultad_respirar_esfuerzo", "valor": "En reposo"},
            {"pregunta": "habla_entrecortada", "valor": True},
            {"pregunta": "dolor_pecho_tipo", "valor": True},
            {"pregunta": "debilidad_extremidades", "valor": True},
            {"pregunta": "cianosis", "valor": True},
            {"pregunta": "dolor_opresivo", "valor": True},
            {"pregunta": "dolor_cabeza_intenso", "valor": True},
            {"pregunta": "perdida_memoria", "valor": True},
            {"pregunta": "acv_inconciencia", "valor": ["Pérdida de conciencia", "Convulsiones"]},
            {"pregunta": "ic_inestabilidad", "valor": ["Falta de aire extrema", "Tos con esputo rosado"]},
            {"pregunta": "ec_opresion_intensa", "valor": True},
            {"pregunta": "epoc_labios_azules", "valor": True}
        ],
        "nivel_esi": 1
    },
    # Reglas para ESI 2 (Urgencia Crítica)
    {
        "condiciones": [
            {"pregunta": "silbido_respirar", "valor": True},
            {"pregunta": "dolor_pecho_respirar", "valor": True},
            {"pregunta": "dolor_pecho_sudoracion", "valor": True},
            {"pregunta": "vomito_sangre", "valor": True},
            {"pregunta": "incapacidad_caminar", "valor": True},
            {"pregunta": "tos_sangre", "valor": True},
            {"pregunta": "respiracion_rapida", "valor": True},
            {"pregunta": "dolor_abdomen_postura", "valor": True},
            {"pregunta": "estreñimiento_hinchazón", "valor": True},
            {"pregunta": "alucinaciones", "valor": True},
            {"pregunta": "mareo_severo", "valor": True},
            {"pregunta": "escalofrios_severos", "valor": True},
            {"pregunta": "diabetes_inestabilidad", "valor": ["Respiración rápida", "Confusión"]},
            {"pregunta": "asma_inestabilidad", "valor": ["Labios azulados", "Alteración del estado mental"]},
            {"pregunta": "acv_sintomas", "valor": ["Asimetría facial", "Debilidad en brazos", "Dificultad para hablar"]},
            {"pregunta": "ic_retencion", "valor": ["Disnea en reposo", "Dolor torácico"]},
            {"pregunta": "hta_manchas_vision", "valor": True},
            {"pregunta": "ec_dolor_sudor", "valor": True},
            {"pregunta": "epoc_silbido_respirar", "valor": True},
            {"pregunta": "fm_deshidratacion", "valor": ["Deshidratación severa", "Taquicardia extrema", "Dolor torácico"]}
        ],
        "nivel_esi": 2
    },
    # Reglas para ESI 3 (Urgencia No Crítica)
    {
        "condiciones": [
            {"pregunta": "dificultad_respiratoria", "valor": True},
            {"pregunta": "dolor_pecho", "valor": True},
            {"pregunta": "dolor_abdominal", "valor": True},
            {"pregunta": "vision_alterada", "valor": True},
            {"pregunta": "confusion", "valor": True},
            {"pregunta": "diabetes_sintomas", "valor": ["Vómitos persistentes", "Dolor abdominal intenso"]},
            {"pregunta": "diabetes_vision", "valor": ["Visión borrosa", "Debilidad extrema"]},
            {"pregunta": "asma_tos", "valor": True},
            {"pregunta": "ic_sintomas_cronicos", "valor": ["Fatiga extrema", "Hinchazón moderada"]},
            {"pregunta": "fm_dolor_migraña", "valor": ["Migraña refractiva", "Dolor generalizado extremo"]}
        ],
        "nivel_esi": 3
    },
    # Reglas para ESI 4 (Consulta Prioritaria)
    {
        "condiciones": [
            {"pregunta": "sintomas_leves", "valor": True},
            {"pregunta": "diabetes_sintomas_leves", "valor": True},
            {"pregunta": "asma_leve", "valor": True},
            {"pregunta": "acv_sintomas_leves", "valor": True},
            {"pregunta": "ic_sintomas_leves", "valor": ["Hinchazón leve"]},
            {"pregunta": "fm_dolor_moderado", "valor": ["Dolor moderado", "Insomnio grave"]}
        ],
        "nivel_esi": 4
    },
    # Reglas para ESI 5 (Consulta Externa)
    {
        "condiciones": [
            {"pregunta": "sintomas_leves", "valor": False},
            {"pregunta": "diabetes_control", "valor": True},
            {"pregunta": "asma_control", "valor": True},
            {"pregunta": "acv_seguimiento", "valor": True},
            {"pregunta": "ic_medicacion", "valor": True}
        ],
        "nivel_esi": 5
    }
]