from django.contrib import admin
from .models import SesionTriage, Pregunta, Respuesta, ReglaFlujo

# Configuración del admin para SesionTriage
@admin.register(SesionTriage)
class SesionTriageAdmin(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'fecha_inicio', 'fecha_fin', 'nivel_triage', 'completado')
    list_filter = ('completado', 'nivel_triage', 'fecha_inicio')
    search_fields = ('paciente__primer_nombre', 'paciente__primer_apellido', 'paciente__numero_documento')
    readonly_fields = ('id', 'fecha_inicio')
    date_hierarchy = 'fecha_inicio'
    
    fieldsets = (
        ('Información de la Sesión', {
            'fields': (
                'id',
                'paciente',
                ('fecha_inicio', 'fecha_fin'),
                ('nivel_triage', 'completado')
            )
        }),
    )

# Configuración del admin para Pregunta
@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'texto', 'tipo', 'orden')
    list_filter = ('tipo',)
    search_fields = ('codigo', 'texto')
    ordering = ('orden', 'codigo')
    
    fieldsets = (
        ('Información Básica', {
            'fields': (
                'codigo',
                'texto',
                'tipo',
                'orden'
            )
        }),
        ('Configuración Avanzada', {
            'fields': (
                'opciones',
                'unidad'
            ),
            'classes': ('collapse',)
        })
    )

# Inline para mostrar respuestas en la sesión de triage
class RespuestaInline(admin.TabularInline):
    model = Respuesta
    extra = 0
    readonly_fields = ('id', 'timestamp')
    fields = ('pregunta', 'valor', 'informacion_adicional', 'pregunta_siguiente', 'timestamp')

# Actualizar SesionTriageAdmin para incluir las respuestas inline
SesionTriageAdmin.inlines = [RespuestaInline]

# Configuración del admin para Respuesta
@admin.register(Respuesta)
class RespuestaAdmin(admin.ModelAdmin):
    list_display = ('sesion', 'pregunta', 'valor', 'timestamp')
    list_filter = ('pregunta', 'timestamp')
    search_fields = ('sesion__paciente__primer_nombre', 'sesion__paciente__primer_apellido', 'pregunta__codigo')
    readonly_fields = ('id', 'timestamp')
    date_hierarchy = 'timestamp'
    
    fieldsets = (
        ('Información de la Respuesta', {
            'fields': (
                'id',
                'sesion',
                'pregunta',
                'valor',
                'informacion_adicional',
                'pregunta_siguiente',
                'timestamp'
            )
        }),
    )

# Configuración del admin para ReglaFlujo
@admin.register(ReglaFlujo)
class ReglaFlujoAdmin(admin.ModelAdmin):
    list_display = ('pregunta_origen', 'pregunta_destino', 'prioridad', 'nivel_triage')
    list_filter = ('nivel_triage', 'prioridad')
    search_fields = ('pregunta_origen__codigo', 'pregunta_destino__codigo')
    ordering = ('pregunta_origen', '-prioridad')
    
    fieldsets = (
        ('Flujo de Preguntas', {
            'fields': (
                'pregunta_origen',
                'pregunta_destino',
                'condicion',
                'prioridad'
            )
        }),
        ('Resultado de Triage', {
            'fields': ('nivel_triage',),
            'classes': ('collapse',)
        })
    )
