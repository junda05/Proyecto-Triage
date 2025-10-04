"""
Módulo que contiene la definición de las preguntas para el sistema de triage"
"""

# Formato de petición para las preguntas de tipo multi-choice o que tenga "Otra (especificar)"

    #   "pregunta": "antecedentes_alergias",
    #   "valor": ["Penicilina", "Otra (especificar)"], Si es tipo "choice" sin las llaves de la lista
    #   "informacion_adicional": "Alergia al polen de girasol",

# Definición de preguntas para el sistema de triage
PREGUNTAS = {
    # Preguntas para embarazo
    "embarazo": {
        "texto": "¿Está embarazada?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "semanas_embarazo": {
        "texto": "¿Cuántas semanas de embarazo tiene?",
        "tipo": "choice",
        "opciones": ["1-4 semanas", "5-8 semanas", "9-13 semanas", "14-17 semanas", 
                     "18-22 semanas", "23-27 semanas", "28-31 semanas", "32-35 semanas",
                     "36-40 semanas"]
    },
    "sintomas_graves_embarazo_ESI1": {
        "texto": "¿Presenta alguno(s) de los siguientes síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Sangrado vaginal muy abundante o con coágulos grandes", "Dolor fuerte en el vientre que no se quita", "Salida repentina de líquido por la vagina (como si se rompiera una bolsa)", 
                     "Fiebre alta con escalofríos", "Mareo muy fuerte o desmayo", "No siente que el bebé se mueva (si tiene más de 5 meses)", "Convulsiones o visión borrosa",
                     "Ninguna de las anteriores"]
    },
    "sintomas_moderados_embarazo_ESI2": {
        "texto": "¿Presenta alguno(s) de los siguientes síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Sangrado leve o pequeñas manchas de sangre", "Dolor leve en el vientre que va y viene", "Vómitos que no paran", 
                     "Dolor de cabeza muy fuerte", "El bebé se mueve menos de lo normal (si tiene más de 7 meses)", "Le han dicho que tiene la presión alta o lo sospecha",
                     "Ninguna de las anteriores"]
    },
    "sintomas_moderados_embarazo_ESI3": {
        "texto": "¿Presenta alguno(s) de los siguientes síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Vómitos o náuseas frecuentes pero no graves", "Dolor en la espalda que molesta al caminar o moverse", 
                     "Cansancio extremo o mucho sueño", "Flujo vaginal diferente (color raro, mal olor, más cantidad)",
                     "Ninguna de las anteriores"]
    },
    "sintomas_leves_embarazo_ESI4": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Náuseas leves o vómitos ocasionales", "Dolor leve en la espalda",
                     "Cansancio leve o sueño normal", "Flujo vaginal normal (sin mal olor ni color extraño)", "Picazón o irritación en la piel sin otros síntomas graves", "Ninguna de las anteriores"]
    },
    "sintomas_leves_embarazo_ESI5": {
        "texto": "Seleccione la(s) opción(es) que le apliquen:",
        "tipo": "multi_choice",
        "opciones": ["Está embarazada pero se siente bien", "Solo quiere información o recomendaciones",
                     "Está en control prenatal regular"]
    },
    
    # Preguntas para adulto mayor
    "adulto_mayor_ESI1": {
        "texto": "¿Presenta alguno(s) de los siguientes síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Dificultad para respirar muy fuerte", "Dolor en el pecho muy intenso", "Confusión o desorientación repentina",
                     "Fiebre muy alta junto con debilidad extrema", "Ninguna de las anteriores"]
    },
    "adulto_mayor_ESI2": {
        "texto": "¿Tiene alguno(s) de estos sintomas repentinos?",
        "tipo": "multi_choice",
        "opciones": ["Vómitos persistentes", "Una caída con posible golpe fuerte o fractura", "Confusión repentina o dificultad para pensar claramente",
                     "Fiebre acompañada de escalofríos fuertes", "Dificultad para comer, beber o moverse por sí mismo", "Ninguna de las anteriores"]
    },
    "adulto_mayor_ESI3": {
        "texto": "¿Ha notado alguno(s) de estos malestares?",
        "tipo": "multi_choice",
        "opciones": ["Tos que no mejora", "Cansancio o fatiga constante", "Pérdida del apetito", "Dolor leve pero molesto",
                     "Sensación de decaimiento o falta de energía", "Ninguna de las anteriores"]
    },
    "adulto_mayor_ESI45": {
        "texto": "¿Viene por algunas de estas razones?",
        "tipo": "multi_choice",
        "opciones": ["Dolor localizado y controlable", "Necesidad de un medicamento o receta", "Exámenes o pruebas que le solicitó su médico",
                     "Tiene una herida que desee revisar", "Ninguna de las anteriores"]
    },
    
    # Preguntas de antecedentes médicos
    "cirugias_previas": {
        "texto": "¿Ha tenido cirugías previas? (Describa brevemente cada cirugía y el año aproximado)",
        "tipo": "text",
        "placeholder": "Ejemplo: Apendicectomía en 2018, Cesárea en 2020...",
        "max_length": 1000,
        "required": False
    },
     
    "antecedentes_enfermedades_cronicas": {
        "texto": "Enfermedades Crónicas (puede seleccionar múltiples opciones)",
        "tipo": "multi_choice",
        "opciones": [
            "Diabetes 1/2",
            "Asma",
            "Acidente cerebrovascular (ACV)",
            "Insuficiencia cardíaca",
            "Fibromialgia",
            "Hipertensión arterial",
            "Enfermedad coronaria",
            "Enfermedad pulmonar obstructiva crónica (EPOC)",
            "Cáncer",
            "Otro (especificar)",
            "Ninguna de las anteriores"
        ]
    },

    "esta_en_tratamiento": {
        "texto": "¿Se encuentra en en tratamiento oncológico o hematologico?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    # Preguntas específicas por enfermedad crónica específica
    "sintoma_relacionado_diabetes": {
        "texto": "¿Presenta algún síntoma relacionado con su Diabetes?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_asma": {
        "texto": "¿Presenta algún síntoma relacionado con su Asma?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_acv": {
        "texto": "¿Presenta algún síntoma relacionado con su Accidente Cerebrovascular (ACV)?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_insuficiencia_cardiaca": {
        "texto": "¿Presenta algún síntoma relacionado con su Insuficiencia Cardíaca?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_fibromialgia": {
        "texto": "¿Presenta algún síntoma relacionado con su Fibromialgia?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_hipertension": {
        "texto": "¿Presenta algún síntoma relacionado con su Hipertensión Arterial?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_enfermedad_coronaria": {
        "texto": "¿Presenta algún síntoma relacionado con su Enfermedad Coronaria?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    "sintoma_relacionado_epoc": {
        "texto": "¿Presenta algún síntoma relacionado con su EPOC?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas de alergias
    "antecedentes_alergias": {
        "texto": "¿A qué es alérgico(a)?",
        "tipo": "choice",
        "opciones": [
            "A ciertos alimentos (me da picazón, hinchazón, ronchas o vómito, y en casos graves falta de aire)",
            "Al polvo, polen o pelo de animales (me da estornudos, tos, nariz tapada, picazón en ojos o falta de aire en casos graves)",
            "A medicamentos (me da ronchas, hinchazón, falta de aire o en casos graves reacción fuerte/choque)",
            "A picaduras de insectos (como abejas o avispas, me da dolor, hinchazón, ronchas o falta de aire en casos graves)",
            "Al tocar ciertos materiales (como metales, látex, cosméticos o plantas, me da enrojecimiento, picazón o ronchas en la piel)",
            "Ninguna de las anteriores"
        ]
    },
    
    # Pregunta de gravedad de alergia (Escala Likert 1-10)
    "gravedad_alergia": {
        "texto": "En una escala del 1 al 10, ¿qué tan grave considera que es su alergia?",
        "tipo": "scale",
        "opciones": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },  
    
    # Preguntas específicas para diabetes
    "diabetes_inestabilidad_ESI1": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Respiración rápida", "Confusión", "Pérdida del conocimiento", "Piel fría/húmeda", "Pulso débil", "Ninguno de los anteriores"]
    },
    "diabetes_sintomas_ESI2": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Vómitos persistentes", "Dolor abdominal intenso", "Deshidratación grave", "Hormigueo intenso", "Ninguno de los anteriores"]
    },
    "diabetes_sintomas_ESI3": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Visión borrosa", "Debilidad extrema", "Fatiga", "Pérdida de peso", "Ninguno de los anteriores"]
    },
    "diabetes_sintomas_leves_ESI45": {
        "texto": "¿Presenta hambre aumentada o irritabilidad leve?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas específicas para asma
    "asma_inestabilidad_ESI1": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Labios azulados", "Alteración del estado mental", "Incapacidad para caminar por dificultad respiratoria", "Ninguno de los anteriores"]
    },
    "asma_sibilancias_ESI2": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": [
            "Siente silbidos o ruidos en el pecho al respirar",
            "A pesar de usar su inhalador, continúa con dificultad para respirar",
            "Ninguno de los anteriores"
        ]
    },
    "asma_tos_ESI3": {
        "texto": "¿Presenta tos, o necesidad de usar inhalador más de dos veces por semana?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "asma_leve_ESI45": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": [
            "Tos ocasional que mejora al usar el inhalador",
            "Silbidos o ruidos leves al respirar durante ejercicio o exposición a alérgenos",
            "Ninguno de los anteriores"
        ]
    },
    
    # Preguntas específicas para ACV (Accidente Cerebrovascular)
    "acv_sintomas_ESI1": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Debilidad o entumecimiento repentino en la cara, brazo o pierna", "dificultad para hablar", "Dérdida de equilibrio", 
                     "Dolor de cabeza muy fuerte que empezó de repente", "Ninguno de los anteriores"]
    },
    "acv_sintomas_ESI2": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Dificultad para respirar incluso estando quieto", "Dolor fuerte en el pecho o en la cabeza", "Visión borrosa",
                     "Hinchazón en la cara o garganta que le dificulte tragar", "Malestar que apareció de forma repentina y no mejora" ,"Ninguno de los anteriores"]
    },
    "acv_sintomas_ESI3": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Dolor de cabeza o mareo continuos", "Fiebre con escalofríos", "Dolor en el pecho cuando respira",
                     "Vómitos" ,"Ninguno de los anteriores"]
    },
    "acv_sintomas_ESI45": {
        "texto": "¿Lo que siente ahora es una molestia leve, como dolor de cabeza o mareo ocasional, que no le impide realizar sus actividades?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas específicas para insuficiencia cardiaca
    "ic_sintomas_ESI1": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Falta de aire extrema", "Bota flema con color rosado o con espuma", 
                     "Al respirar se escuchan ruidos parecidos a burbujas o chasquidos en el pecho", "Piel fría/húmeda", "Taquicardia", 
                     "Ninguno de los anteriores"]
    },
    "ic_sintomas_ESI2": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": [
            "Subió de peso rápido y nota que el cuerpo retiene líquidos (hinchazón repentina)",
            "Le falta el aire incluso estando en reposo (sentado o acostado)",
            "Dolor fuerte o presión en el pecho que puede ser de preocupación",
            "Hinchazón muy marcada en piernas o abdomen que le dificulta moverse",
            "Ninguno de los anteriores"
        ]
    },
    "ic_sintomas_ESI3": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": ["Fatiga extrema al caminar", "Hinchazón moderada en las piernas que mejora al descansar o al ponerlas en alto",
        "Siente palpitaciones o el corazón acelerado en ocasiones, pero sin otros síntomas", "Ninguno de los anteriores"]
    },
    "ic_sintomas_ESI45": {
        "texto": "¿Presenta alguno(s) de estos síntomas?",
        "tipo": "multi_choice",
        "opciones": [
            "Hinchazón leve en los tobillos",
            "Su peso se ha mantenido estable, sin subir de golpe",
            "Mejora cuando toma los medicamentos para orinar (diuréticos) que le recetó el médico",
            "Ninguno de los anteriores"
        ]
    },
    
    # Preguntas específicas para fibromialgia
    "fm_sintomas_ESI1": {
        "texto": "¿Presenta un dolor intenso en todo el cuerpo que no le permite moverse, fatiga tan fuerte que apenas puede mantenerse despierto, o problemas de memoria y concentración que le impiden comunicarse o realizar actividades básicas?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "fm_sintomas_ESI2": {
        "texto": "¿Ahora mismo su dolor, el cansancio o los problemas de sueño son tan intensos que, aunque puede hablar o moverse se siente inestable?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "fm_sintomas_ESI3": {
        "texto": "¿En este momento presenta dolor en varias partes del cuerpo junto con cansancio o falta de concentración, que le dificultan hacer sus actividades normales y lo hacen sentir incómodo a lo largo del día?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "fm_sintomas_ESI45": {
        "texto": "¿Lo que siente ahora es un dolor localizado, cansancio leve o problemas de sueño que le molestan, pero que no le impiden caminar, hablar ni realizar sus actividades cotidianas?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas específicas para hipertensión arterial
    "hta_inicio": {
        "texto": "¿Tiene dolor de cabeza o visión borrosa?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "hta_sintomas_ESI1": {
        "texto": "¿Ve manchas o lucecitas?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "hta_sintomas_ESI23": {
        "texto": "¿Le duele la cabeza como nunca antes?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "hta_sintomas_ESI45": {
        "texto": "¿Tiene mareo severo?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas específicas para enfermedad coronaria
    "ec_sintomas_inicio": {
        "texto": "¿Dolor en pecho como peso que irradia a brazo/mandíbula?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "ec_sintomas_ESI1": {
        "texto": "¿Siente que un elefante le pisó el pecho?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "ec_sintomas_ESI23": {
        "texto": "¿El dolor le llega hasta el cuello/brazo?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "ec_sintomas_ESI45": {
        "texto": "¿Dolor opresivo con sudor frío?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas específicas para EPOC
    "epoc_sintomas_inicio": {
        "texto": "¿Labios/uñas azules y no puede hablar?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "epoc_sintomas_ESI1": {
        "texto": "¿Al respirar hace sonido de pitillo?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "epoc_sintomas_ESI23": {
        "texto": "¿Tose como si tuviera pegamento en los pulmones?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "epoc_sintomas_ESI45": {
        "texto": "¿Siente silbidos al respirar y flemas verdes/amarillas?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Signos y sintomas generales
    # Preguntas sobre mareo, escalofríos y cianosis
    "mareo_severo": {
        "texto": "¿Ha sentido mareos tan fuertes que casi pierde el equilibrio o se cae al ponerse de pie?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "escalofrios_severos": {
        "texto": " ¿Ha sentido escalofríos tan intensos que todo su cuerpo tiembla?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "cianosis": {
        "texto": "¿Ha notado que sus labios o uñas se ponen morados?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre palpitaciones rápidas y dolor en el pecho
    "palpitaciones_rápidas": {
        "texto": "¿Ha sentido que su corazón late muy rápido o con mucha fuerza incluso cuando está en reposo?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_pecho_opresivo": {
        "texto": "¿Ha sentido que su pecho está apretado u oprimido?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_opresivo_respirar": {
        "texto": "¿Ha notado que el dolor empeora cuando respira?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre dificultad respiratoria
    "dificultad_respiratoria": {
        "texto": "¿Experimenta sensación de ahogo o falta de aire?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dificultad_respirar_esfuerzo": {
        "texto": "¿Experimenta esta sensación en reposo o al realizar un esfuerzo mínimo?",
        "tipo": "choice",
        "opciones": ["En reposo", "Con esfuerzo mínimo"]
    },
    "habla_entrecortada": {
        "texto": "¿Al hablar, tiene que parar para tomar aire entre cada 2-3 palabras para respirar?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "silbido_respirar": {
        "texto": "¿Al respirar hace un silbido como de asma?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre dolor en el pecho
    "dolor_pecho": {
        "texto": "¿Tiene dolor en el pecho?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_pecho_sudoracion": {
        "texto": "¿Con sudoración fría o irradiación?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_pecho_quemazon": {
        "texto": "¿Ha sentido que el dolor en el pecho se percibe como un peso aplastante o una sensación de quemazón?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_pecho_respirar": {
        "texto": "¿El dolor empeora al respirar?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre dolor abdominal
    "dolor_abdominal": {
        "texto": "¿Tiene dolor abdominal intenso o vómitos?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "dolor_abdominal_intensidad": {
        "texto": "¿El dolor es tan fuerte que no encuentra alguna posición cómoda?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "incapacidad_caminar": {
        "texto": "¿Ha experimentado alguna dificultad o incapacidad para caminar?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "vomito_sangre": {
        "texto": "¿Ha tenido vómitos que contengan sangre o que se vean muy oscuros?",
        "tipo": "boolean",
        "opciones": [True, False]
    },

    # Preguntas sobre hemorragias
    "tos_sangre": {
        "texto": "¿Ha tosido sangre o flemas con sangre recientemente?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre síntomas principales
    "sintoma_principal": {
        "texto": "¿Qué síntoma principal tiene?",
        "tipo": "choice",
        "opciones": ["Dificultad respiratoria", "Dolor abdominal", "Dolor de cabeza", 
                     "Ninguno de los anteriores"]
    },
    # Preguntas para dolor abdominal
    "dolor_abdomen_postura": {
        "texto": "¿El dolor es tan fuerte que no puede pararse derecho?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "estreñimiento_hinchazón": {
        "texto": "¿Ha dejado de ir al baño por más de 3 días con hinchazón?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    # Preguntas para dolor de cabeza
    "dolor_cabeza_intenso": {
        "texto": "¿Ha tenido un dolor de cabeza tan intenso que lo considera el peor que ha sentido en su vida?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "vision_alterada": {
        "texto": "¿Ha visto destellos de luz o ha perdido la visión por unos segundos?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    # Preguntas para dificultad respiratoria
    "respiracion_rapida": {
        "texto": "¿Su respiración se ha acelerado más de lo habitual últimamente?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas confusión o dificultad para pensar con claridad
    "confusion": {
        "texto": "¿Ha sentido confusión o dificultad para pensar con claridad?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "perdida_memoria": {
        "texto": "¿Ha tenido momentos en los que no recuerda lo que hizo?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    "alucinaciones": {
        "texto": "¿Ha visto luces, destellos o formas que otras personas no pueden ver?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
    
    # Preguntas sobre síntomas leves
    "sintomas_leves": {
        "texto": "¿Tiene síntomas leves (tos, dolor de garganta, diarrea)?",
        "tipo": "boolean",
        "opciones": [True, False]
    },
}

# Mapa de flujo de preguntas (qué pregunta sigue después de cada respuesta)
FLUJO_PREGUNTAS = {
    
    # Flujo para embarazo
    "embarazo": {
        "siguiente": "cirugias_previas",  # Si no está embarazada, continúa con flujo general
        True: "semanas_embarazo",     # Si está embarazada, va al flujo específico
    },
    "semanas_embarazo": {
        "siguiente": "sintomas_graves_embarazo_ESI1"
    },
    "sintomas_graves_embarazo_ESI1": {
        "siguiente": None,  # Finalizar evaluación - ESI 1
        "Ninguna de las anteriores": "sintomas_moderados_embarazo_ESI2",
    },
    "sintomas_moderados_embarazo_ESI2": {
        "siguiente": None,  # Finalizar evaluación - ESI 2
        "Ninguna de las anteriores": "sintomas_moderados_embarazo_ESI3",
    },
    "sintomas_moderados_embarazo_ESI3": {
        "siguiente": None,  # Finalizar evaluación - ESI 3
        "Ninguna de las anteriores": "sintomas_leves_embarazo_ESI4",
    },
    "sintomas_leves_embarazo_ESI4": {
        "siguiente": None,  # Finalizar evaluación - ESI 4 según síntoma
        "Ninguna de las anteriores": "sintomas_leves_embarazo_ESI5",
    },
    "sintomas_leves_embarazo_ESI5": {
        "siguiente": None,  # Finalizar evaluación - ESI 5
    },
    
    # Flujo para >65 años
    "adulto_mayor_ESI1": {
        "siguiente": None,
        "Ninguna de las anteriores": "adulto_mayor_ESI2",
    },
    "adulto_mayor_ESI2": {
        "siguiente": None,
        "Ninguna de las anteriores": "adulto_mayor_ESI3",
    },
    "adulto_mayor_ESI3": {
        "siguiente": None,
        "Ninguna de las anteriores": "adulto_mayor_ESI45",
    },
    "adulto_mayor_ESI45": {
        "siguiente": None,
       
    },
    
    # Inicio formal para pacientes no embarazos y <65 años
    "inicio": "cirugias_previas",
    
    # Flujo para preguntas de antecedentes médicos
    "cirugias_previas": {
        "siguiente": "antecedentes_enfermedades_cronicas",
    },
    "antecedentes_enfermedades_cronicas": {
        "siguiente": "antecedentes_alergias",
        "Ninguna de las anteriores": "antecedentes_alergias",
        "Cáncer": "esta_en_tratamiento"                            # Si tiene cáncer, ir al flujo específico
        # NOTA: La lógica para otras enfermedades crónicas se maneja dinámicamente en views.py
    },
    
    "esta_en_tratamiento": {
        "siguiente": None,
        False: "antecedentes_alergias"
    },

    # Flujos condicionales para preguntas específicas por enfermedad
    "sintoma_relacionado_diabetes": {
        "siguiente": "sintoma_relacionado_asma",
        True: "diabetes_inestabilidad_ESI1"
    },
    
    "sintoma_relacionado_asma": {
        "siguiente": "sintoma_relacionado_acv", 
        True: "asma_inestabilidad_ESI1"
    },
    
    "sintoma_relacionado_acv": {
        "siguiente": "sintoma_relacionado_insuficiencia_cardiaca",
        True: "acv_sintomas_ESI1"
    },
    
    "sintoma_relacionado_insuficiencia_cardiaca": {
        "siguiente": "sintoma_relacionado_fibromialgia",
        True: "ic_sintomas_ESI1"
    },
    
    "sintoma_relacionado_fibromialgia": {
        "siguiente": "sintoma_relacionado_hipertension",
        True: "fm_sintomas_ESI1"
    },
    
    "sintoma_relacionado_hipertension": {
        "siguiente": "sintoma_relacionado_enfermedad_coronaria",
        True: "hta_inicio"
    },
    
    "sintoma_relacionado_enfermedad_coronaria": {
        "siguiente": "sintoma_relacionado_epoc",
        True: "ec_sintomas_inicio"
    },
    
    "sintoma_relacionado_epoc": {
        "siguiente": "antecedentes_alergias",  # Continúa con el flujo normal
        True: "epoc_sintomas_inicio"
    },

    # Flujo específico para diabetes
    "diabetes_inestabilidad_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "diabetes_sintomas_ESI2"
    },
    "diabetes_sintomas_ESI2": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "diabetes_sintomas_ESI3"
    },
    "diabetes_sintomas_ESI3": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "diabetes_sintomas_leves_ESI45"
    },
    "diabetes_sintomas_leves_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },

    # Flujo específico para asma
    "asma_inestabilidad_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "asma_sibilancias_ESI2"
    },
    "asma_sibilancias_ESI2": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "asma_tos_ESI3"
    },
    "asma_tos_ESI3": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",  # Continuar con siguiente enfermedad después de evaluar
        "Ninguno de los anteriores": "asma_leve_ESI45"
    },
    "asma_leve_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },
    
    # Flujo específico para ACV
    "acv_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "acv_sintomas_ESI2"
    },
    "acv_sintomas_ESI2": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "acv_sintomas_ESI3"
    },
    "acv_sintomas_ESI3": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "acv_sintomas_ESI45"
    },
    "acv_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"  # Se maneja dinámicamente en views.py
    },
    
    # Flujo específico para insuficiencia cardiaca
    "ic_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "ic_sintomas_ESI2"
    },
    "ic_sintomas_ESI2": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "ic_sintomas_ESI3"
    },
    "ic_sintomas_ESI3": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        "Ninguno de los anteriores": "ic_sintomas_ESI45"
    },
    "ic_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },
    
    # Flujo específico para hipertensión arterial
    "hta_inicio": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        True: "hta_sintomas_ESI1",
        False: "hta_sintomas_ESI45"
    },
    "hta_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "hta_sintomas_ESI23"
    },
    "hta_sintomas_ESI23": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
    },
    "hta_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"  # Se maneja dinámicamente en views.py
    },
    
    # Flujo específico para enfermedad coronaria
    "ec_sintomas_inicio": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        True: "ec_sintomas_ESI1",
        False: "ec_sintomas_ESI45"
    },
    "ec_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "ec_sintomas_ESI23"
    },
    "ec_sintomas_ESI23": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
    },
    "ec_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"  # Se maneja dinámicamente en views.py
    },
    
    # Flujo específico para EPOC
    "epoc_sintomas_inicio": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        True: "epoc_sintomas_ESI1",
        False: "epoc_sintomas_ESI45"
    },
    "epoc_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "epoc_sintomas_ESI23"
    },
    "epoc_sintomas_ESI23": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },
    "epoc_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },
    
    # Flujo específico para fibromialgia
    "fm_sintomas_ESI1": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "fm_sintomas_ESI2"
    },
    "fm_sintomas_ESI2": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "fm_sintomas_ESI3"
    },
    "fm_sintomas_ESI3": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD",
        False: "fm_sintomas_ESI45"
    },
    "fm_sintomas_ESI45": {
        "siguiente": "DINAMICO_SIGUIENTE_ENFERMEDAD"
    },
    
    # Flujo para alergias
    "antecedentes_alergias": {
        "siguiente": "gravedad_alergia",
        "Ninguna de las anteriores": "mareo_severo",
    },
    
    # Flujo para gravedad de alergia - Termina el triage
    "gravedad_alergia": {
        "siguiente": None,  # Termina el triage aquí
    },
    "embarazo": {
        "siguiente": "cirugias_previas",  # Si no está embarazada, continúa con flujo general
        True: "semanas_embarazo",     # Si está embarazada, va al flujo específico
    },

    # Signos y sintomas
    "mareo_severo": {
        "siguiente": "escalofrios_severos",
        True: None,
    },
    "escalofrios_severos": {
        "siguiente": "cianosis",
        True: None,
    },
    "cianosis": {
        "siguiente": "palpitaciones_rápidas",
        True: None,
    },
    "palpitaciones_rápidas": {
        "siguiente": "dificultad_respiratoria",
        True: "dolor_pecho_opresivo",
    },
    "dolor_pecho_opresivo": {
        "siguiente": "dolor_opresivo_respirar",
        True: None,
    },
    "dolor_opresivo_respirar": {
        "siguiente": None,
    },
    
    # Flujo para dificultad respiratoria
    "dificultad_respiratoria": {
        "siguiente": "dolor_pecho",
        True: "dificultad_respirar_esfuerzo"
    },
    "dificultad_respirar_esfuerzo": {
        "Con esfuerzo mínimo": "silbido_respirar",
        "En reposo": "habla_entrecortada",
    },
    "habla_entrecortada": {
        "siguiente": None, 
    },
    "silbido_respirar": {
        "siguiente": None,
    },
    
    # Flujo para dolor en el pecho
    "dolor_pecho": {
        "siguiente": "dolor_abdominal",
        True: "dolor_pecho_sudoracion"
    },
    "dolor_pecho_sudoracion": {
        "siguiente": "dolor_pecho_respirar",
        True: "dolor_pecho_quemazon"
    },
    "dolor_pecho_quemazon": {
        "siguiente": None, 
    },
    "dolor_pecho_respirar": {
        "siguiente": None,
    },
    
    # Flujo para dolor abdominal
    "dolor_abdominal": {
        "siguiente": "tos_sangre",
        True: "dolor_abdominal_intensidad"
    },
    "dolor_abdominal_intensidad": {
        "siguiente": "vomito_sangre",
        True: "incapacidad_caminar",
    },
    "vomito_sangre": {
        "siguiente": None, 
    },
    "incapacidad_caminar": {
        "siguiente": None, 
    },
    
    # Flujo para hemorragias
    "tos_sangre": {
        "siguiente": "sintoma_principal",
        True: None,
    },
    
    # Flujo para síntomas principales
    "sintoma_principal": {
        "Dolor abdominal": "dolor_abdomen_postura",
        "Dolor de cabeza": "dolor_cabeza_intenso",
        "Dificultad respiratoria": "respiracion_rapida",
        "Ninguno de los anteriores": "confusion",
    },
    "dolor_abdomen_postura": {
        "siguiente": "estreñimiento_hinchazón",
        True: None,
    },
    "estreñimiento_hinchazón": {
        "siguiente": None,
    },
    "dolor_cabeza_intenso": {
        "siguiente": "vision_alterada",
        True: None,
    },
    "vision_alterada": {
        "siguiente": None,
    },
    "respiracion_rapida": {
        "siguiente": None,
    },
    
    # Flujo para estado mental
    "confusion": {
        "siguiente": "sintomas_leves",
        True: "perdida_memoria"
    },
    "perdida_memoria": {
        "siguiente": "alucinaciones",
        True: None,
    },
    "alucinaciones": {
        "siguiente": None,
    },
    
    # Flujo para síntomas leves - último en el flujo normal
    "sintomas_leves": {
        "siguiente": None  # Fin del cuestionario
    },
}

# Reglas de clasificación ESI basadas en respuestas
REGLAS_ESI = [
    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
    # Reglas para ESI 1 (Emergencia) - Adultos Mayores
    {"condiciones": [{"pregunta": "adulto_mayor_ESI1", "valor": ["Dificultad para respirar muy fuerte", "Dolor en el pecho muy intenso",
                                                                 "Confusión o desorientación repentina", "Fiebre muy alta junto con debilidad extrema"
                                                                 ]}], "nivel_esi": 1},
    
    # Reglas para ESI 1 (Emergencia) - Mujeres Embarazadas
    {"condiciones": [{"pregunta": "sintomas_graves_embarazo_ESI1", "valor": ["Sangrado vaginal muy abundante o con coágulos grandes", 
                                                                             "Dolor fuerte en el vientre que no se quita", 
                                                                             "Salida repentina de líquido por la vagina (como si se rompiera una bolsa)", 
                                                                             "Fiebre alta con escalofríos", "Mareo muy fuerte o desmayo", 
                                                                             "No siente que el bebé se mueva (si tiene más de 5 meses)", 
                                                                             "Convulsiones o visión borrosa"]}], "nivel_esi": 1},
    
    # Reglas para ESI 1 (Emergencia) - Pacientes con cancer en tratamiento oncológico o hematologico
    {"condiciones": [{"pregunta":"esta_en_tratamiento", "valor": True}], "nivel_esi": 1},

    # Reglas ESI 1 para Diabetes
    {"condiciones": [{"pregunta": "diabetes_inestabilidad_ESI1", "valor": ["Respiración rápida", "Confusión", "Pérdida del conocimiento", 
                                                                           "Piel fría/húmeda", "Pulso débil"]}], "nivel_esi": 1},

    # Reglas ESI 1 para Asma
    {"condiciones": [{"pregunta": "asma_inestabilidad_ESI1", "valor": ["Labios azulados", "Alteración del estado mental",
                                                                       "Incapacidad para caminar por dificultad respiratoria"]}], "nivel_esi": 1},
    
    # Reglas ESI 1 para ACV
    {"condiciones": [{"pregunta": "acv_sintomas_ESI1", "valor": ["Debilidad o entumecimiento repentino en la cara, brazo o pierna", "dificultad para hablar", 
                                                                 "Dérdida de equilibrio", "Dolor de cabeza muy fuerte que empezó de repente"]}], "nivel_esi": 1},
    
    # Reglas ESI 1 para Insuficiencia Cardíaca
    {"condiciones": [{"pregunta": "ic_sintomas_ESI1", "valor": ["Falta de aire extrema", "Bota flema con color rosado o con espuma", 
                     "Al respirar se escuchan ruidos parecidos a burbujas o chasquidos en el pecho", "Piel fría/húmeda", "Taquicardia"]}], "nivel_esi": 1},
    
    # Reglas ESI 1 para casos críticos de Fibromialgia
    {"condiciones": [{"pregunta": "fm_sintomas_ESI1", "valor": True}], "nivel_esi": 1},
    
    # Reglas ESI 1 para Hipertensión Arterial
    {"condiciones": [{"pregunta": "hta_sintomas_ESI1", "valor": True}], "nivel_esi": 1},
    
    # Reglas ESI 1 para Enfermedad Coronaria
    {"condiciones": [{"pregunta": "ec_sintomas_ESI1", "valor": True}], "nivel_esi": 1},
    
    # Reglas ESI 1 para EPOC
    {"condiciones": [{"pregunta": "epoc_sintomas_ESI1", "valor": True}], "nivel_esi": 1},
    
    # ESI 1: Gravedad 6-10 (Muy grave, puede requerir atención inmediata)
    {"condiciones": [{"pregunta": "gravedad_alergia", "valor": [6, 7, 8, 9, 10], "operador": "in"}], "nivel_esi": 1},

    # Reglas generales para ESI 1 (Emergencia)
    {"condiciones": [{"pregunta": "mareo_severo", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "escalofrios_severos", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "dolor_pecho_opresivo", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "habla_entrecortada", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "dolor_pecho_quemazon", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "dolor_pecho_respirar", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "dolor_cabeza_intenso", "valor": True}], "nivel_esi": 1},
    {"condiciones": [{"pregunta": "perdida_memoria", "valor": True}], "nivel_esi": 1},
    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
    

    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
    # Reglas para ESI 2 (Urgencia Crítica) - Adultos Mayores
    {"condiciones": [{"pregunta": "adulto_mayor_ESI2", "valor": ["Vómitos persistentes", "Una caída con posible golpe fuerte o fractura", 
                                                                 "Confusión repentina o dificultad para pensar claramente", "Fiebre acompañada de escalofríos fuertes",
                                                                 "Dificultad para comer, beber o moverse por sí mismo"]}], "nivel_esi": 2},
    
    # Reglas para ESI 2 (Urgencia Crítica) - Mujeres Embarazadas
    {"condiciones": [{"pregunta": "sintomas_moderados_embarazo_ESI2", "valor": ["Sangrado leve o pequeñas manchas de sangre", "Dolor leve en el vientre que va y viene",
                                                                                "Vómitos que no paran", "Dolor de cabeza muy fuerte", 
                                                                                "El bebé se mueve menos de lo normal (si tiene más de 7 meses)", 
                                                                                "Le han dicho que tiene la presión alta o lo sospecha"]}], "nivel_esi": 2},
    
    # Reglas ESI 2 para Diabetes  
    {"condiciones": [{"pregunta": "diabetes_sintomas_ESI2", "valor": ["Vómitos persistentes", "Dolor abdominal intenso", "Deshidratación grave", "Hormigueo intenso"]}], "nivel_esi": 2},
    
    # Reglas ESI 2 para Asma
    {"condiciones": [{"pregunta": "asma_sibilancias_ESI2", "valor": ["Siente silbidos o ruidos en el pecho al respirar", 
                                                                     "A pesar de usar su inhalador, continúa con dificultad para respirar"]}], "nivel_esi": 2},
    
    # Reglas ESI 2 para ACV
    {"condiciones": [{"pregunta": "acv_sintomas_ESI2", "valor": ["Dificultad para respirar incluso estando quieto", "Dolor fuerte en el pecho o en la cabeza", 
                                                                 "Visión borrosa", "Hinchazón en la cara o garganta que le dificulte tragar", 
                                                                 "Malestar que apareció de forma repentina y no mejora"]}], "nivel_esi": 2},
    
    # Reglas ESI 2 para Insuficiencia Cardíaca
    {"condiciones": [{"pregunta": "ic_sintomas_ESI2", "valor": ["Subió de peso rápido y nota que el cuerpo retiene líquidos (hinchazón repentina)",
                                                                "Le falta el aire incluso estando en reposo (sentado o acostado)",
                                                                "Dolor fuerte o presión en el pecho que puede ser de preocupación",
                                                                "Hinchazón muy marcada en piernas o abdomen que le dificulta moverse",]}], "nivel_esi": 2},
    
    # Reglas ESI 2 para casos críticos de Fibromialgia
    {"condiciones": [{"pregunta": "fm_sintomas_ESI2", "valor": True}], "nivel_esi": 2},

    # Reglas ESI 2 para Hipertensión Arterial
    {"condiciones": [{"pregunta": "hta_sintomas_ESI23", "valor": True}], "nivel_esi": 2},
    
    # Reglas ESI 2 para Enfermedad Coronaria
    {"condiciones": [{"pregunta": "ec_sintomas_ESI23", "valor": True}], "nivel_esi": 2},
    
    # Reglas ESI 2 para EPOC
    {"condiciones": [{"pregunta": "epoc_sintomas_ESI23", "valor": True}], "nivel_esi": 2},
    
    # ESI 2: Gravedad 4-5 (Moderadamente grave)
    {"condiciones": [{"pregunta": "gravedad_alergia", "valor": [4, 5], "operador": "in"}], "nivel_esi": 2},
    
    # Reglas generales para ESI 2 (Urgencia Crítica)
    {"condiciones": [{"pregunta": "cianosis", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "dolor_opresivo_respirar", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "habla_entrecortada", "valor": False}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "silbido_respirar", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "dolor_pecho_quemazon", "valor": False}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "dolor_pecho_respirar", "valor": False}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "vomito_sangre", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "incapacidad_caminar", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "tos_sangre", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "dolor_abdomen_postura", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "estreñimiento_hinchazón", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "vision_alterada", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "respiracion_rapida", "valor": True}], "nivel_esi": 2},
    {"condiciones": [{"pregunta": "alucinaciones", "valor": True}], "nivel_esi": 2},

    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
    

    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    # Reglas para ESI 3 (Urgencia No Crítica) - Adultos Mayores
    {"condiciones": [{"pregunta": "adulto_mayor_ESI3", "valor": ["Tos que no mejora", "Cansancio o fatiga constante", "Pérdida del apetito", "Dolor leve pero molesto",
                                                                 "Sensación de decaimiento o falta de energía"]}], "nivel_esi": 3},
    
    # Reglas para ESI 3 (Urgencia No Crítica) - Mujeres Embarazadas
    {"condiciones": [{"pregunta": "sintomas_moderados_embarazo_ESI3", "valor": ["Vómitos o náuseas frecuentes pero no graves", 
                                                                                "Dolor en la espalda que molesta al caminar o moverse", 
                                                                                "Cansancio extremo o mucho sueño", 
                                                                                "Flujo vaginal diferente (color raro, mal olor, más cantidad)"]}], "nivel_esi": 3},
    
    # Reglas ESI 3 para Diabetes
    {"condiciones": [{"pregunta": "diabetes_sintomas_ESI3", "valor": ["Visión borrosa", "Debilidad extrema", "Fatiga", "Pérdida de peso"]}], "nivel_esi": 3},
    
    # Reglas ESI 3 para Asma
    {"condiciones": [{"pregunta": "asma_tos_ESI3", "valor": True}], "nivel_esi": 3},
    
    # Reglas ESI 3 para ACV
    {"condiciones": [{"pregunta": "acv_sintomas_ESI3", "valor": True}], "nivel_esi": 3},
    
    # Reglas ESI 3 para Insuficiencia Cardíaca
    {"condiciones": [{"pregunta": "ic_sintomas_ESI3", "valor": ["Fatiga extrema al caminar", "Hinchazón moderada en las piernas que mejora al descansar o al ponerlas en alto",
                                                                "Siente palpitaciones o el corazón acelerado en ocasiones, pero sin otros síntomas"]}], "nivel_esi": 3},

    # Reglas ESI 3 para casos críticos de Fibromialgia
    {"condiciones": [{"pregunta": "fm_sintomas_ESI3", "valor": True}], "nivel_esi": 3},
    
    # Reglas ESI 3 para Hipertensión Arterial
    {"condiciones": [{"pregunta": "hta_sintomas_ESI23", "valor": False}], "nivel_esi": 3},

    # Reglas ESI 3 para Enfermedad Coronaria
    {"condiciones": [{"pregunta": "ec_sintomas_ESI23", "valor": False}], "nivel_esi": 3},
    
    # Reglas ESI 3 para EPOC
    {"condiciones": [{"pregunta": "epoc_sintomas_ESI23", "valor": False}], "nivel_esi": 3},
    
    # ESI 3: Gravedad 1-3 (Leve a moderada)
    {"condiciones": [{"pregunta": "gravedad_alergia", "valor": [1, 2, 3], "operador": "in"}], "nivel_esi": 3},
    
    # Reglas generales para ESI 3 (Urgencia No Crítica)
    {"condiciones": [{"pregunta": "dolor_opresivo_respirar", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "silbido_respirar", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "vomito_sangre", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "incapacidad_caminar", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "estreñimiento_hinchazón", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "vision_alterada", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "respiracion_rapida", "valor": False}], "nivel_esi": 3},
    {"condiciones": [{"pregunta": "alucinaciones", "valor": False}], "nivel_esi": 3},

    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
     
     
    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------   
    # Reglas para ESI 4 (Consulta Prioritaria) - Adultos Mayores
    {"condiciones": [{"pregunta": "adulto_mayor_ESI45", "valor": ["Dolor localizado y controlable", "Necesidad de un medicamento o receta",
                                                                  "Exámenes o pruebas que le solicitó su médico", "Tiene una herida que desee revisar"]}], "nivel_esi": 4},
    
    # Reglas para ESI 4 (Consulta Prioritaria) - Mujeres Embarazadas
    {"condiciones": [{"pregunta": "sintomas_leves_embarazo_ESI4", "valor": ["Náuseas leves o vómitos ocasionales", "Dolor leve en la espalda", 
                                                                            "Cansancio leve o sueño normal", 
                                                                            "Flujo vaginal normal (sin mal olor ni color extraño)"]}], "nivel_esi": 4},
    
    # Reglas ESI 4 para Diabetes
    {"condiciones": [{"pregunta": "diabetes_sintomas_leves_ESI45", "valor": True}], "nivel_esi": 4},

    # Reglas ESI 4 para Asma
    {"condiciones": [{"pregunta": "asma_leve_ESI45", "valor": ["Tos ocasional que mejora al usar el inhalador",
                                                               "Silbidos o ruidos leves al respirar durante ejercicio o exposición a alérgenos"]}], "nivel_esi": 4},


    # Reglas ESI 4 para ACV
    {"condiciones": [{"pregunta": "acv_sintomas_ESI45", "valor": True}], "nivel_esi": 4},

    # Reglas ESI 4 para Insuficiencia Cardíaca
    {"condiciones": [{"pregunta": "ic_sintomas_ESI45", "valor": ["Hinchazón leve en los tobillos",
                                                                 "Su peso se ha mantenido estable, sin subir de golpe",
                                                                 "Mejora cuando toma los medicamentos para orinar (diuréticos) que le recetó el médico"]}], "nivel_esi": 4},
    
    # Reglas ESI 4 para Fibromialgia
    {"condiciones": [{"pregunta": "fm_sintomas_ESI45", "valor": True}], "nivel_esi": 4},

    # Reglas ESI 4 para Hipertensión Arterial
    {"condiciones": [{"pregunta": "hta_sintomas_ESI45", "valor": True}], "nivel_esi": 4},

    # Reglas ESI 4 para Enfermedad Coronaria
    {"condiciones": [{"pregunta": "ec_sintomas_ESI45", "valor": True}], "nivel_esi": 4},
    
    # Reglas ESI 4 para EPOC
    {"condiciones": [{"pregunta": "epoc_sintomas_ESI45", "valor": True}], "nivel_esi": 4},
    
    # Reglas generales para ESI 4 (Consulta Prioritaria)
    {"condiciones": [{"pregunta": "sintomas_leves", "valor": True}], "nivel_esi": 4},
    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------

    
    # ----------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    # Reglas para ESI 5 (Consulta Externa) - Adultos Mayores
    {"condiciones": [{"pregunta": "adulto_mayor_ESI45", "valor": "Ninguna de las anteriores"}], "nivel_esi": 5},

    # Reglas para ESI 5 (Consulta Externa) - Mujeres Embarazadas
    {"condiciones": [{"pregunta": "sintomas_leves_embarazo_ESI5", "valor": ["Está embarazada pero se siente bien", "Solo quiere información o recomendaciones",
                                                                            "Está en control prenatal regular"]}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Diabetes
    {"condiciones": [{"pregunta": "diabetes_sintomas_leves_ESI45", "valor": False}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Asma
    {"condiciones": [{"pregunta": "asma_leve_ESI45", "valor": ["Ninguno de los anteriores"]}], "nivel_esi": 5},
    
    # Reglas ESI 5 para ACV
    {"condiciones": [{"pregunta": "acv_sintomas_ESI45", "valor": False}], "nivel_esi": 5},
    {"condiciones": [{"pregunta": "acv_sintomas_ESI3", "valor": False}], "nivel_esi": 5},
    {"condiciones": [{"pregunta": "acv_sintomas_ESI2", "valor": "Ninguno de los anteriores"}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Insuficiencia Cardíaca
    {"condiciones": [{"pregunta": "ic_sintomas_ESI45", "valor": "Ninguno de los anteriores"}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Fibromialgia
    {"condiciones": [{"pregunta": "fm_sintomas_ESI45", "valor": False}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Hipertensión Arterial
    {"condiciones": [{"pregunta": "hta_sintomas_ESI45", "valor": False}], "nivel_esi": 5},
    
    # Reglas ESI 5 para Enfermedad Coronaria
    {"condiciones": [{"pregunta": "ec_sintomas_ESI45", "valor": False}], "nivel_esi": 5},
    
    # Reglas ESI 5 para EPOC
    {"condiciones": [{"pregunta": "epoc_sintomas_ESI45", "valor": False}], "nivel_esi": 5},
    {"condiciones": [{"pregunta": "sintomas_leves", "valor": False}], "nivel_esi": 5},
    
    # -----------------------------------------------------------------------------------------------------------------------------------------------------------------
]