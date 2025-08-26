from django.contrib import admin
from .models import Paciente, ContactoEmergencia

# Configuración del admin para Paciente
@admin.register(Paciente)
class PacienteAdmin(admin.ModelAdmin):
    list_display = ('primer_nombre', 'primer_apellido', 'numero_documento', 'tipo_documento', 'edad', 'sexo', 'telefono', 'eps', 'creado')
    list_filter = ('tipo_documento', 'sexo', 'regimen_eps', 'eps', 'tiene_seguro_medico', 'creado')
    search_fields = ('primer_nombre', 'primer_apellido', 'numero_documento', 'telefono')
    readonly_fields = ('creado', 'edad')
    
    fieldsets = (
        ('Información Personal', {
            'fields': (
                ('primer_nombre', 'segundo_nombre'),
                ('primer_apellido', 'segundo_apellido'),
                'fecha_nacimiento',
                'sexo'
            )
        }),
        ('Documentación', {
            'fields': (
                ('tipo_documento', 'numero_documento'),
            )
        }),
        ('Contacto', {
            'fields': (
                ('prefijo_telefonico', 'telefono'),
            )
        }),
        ('Seguridad Social', {
            'fields': (
                'regimen_eps',
                'eps',
                ('tiene_seguro_medico', 'nombre_seguro_medico')
            )
        }),
        ('Información Médica', {
            'fields': ('sintomas_iniciales',)
        }),
        ('Metadatos', {
            'fields': ('creado', 'edad'),
            'classes': ('collapse',)
        })
    )

# Configuración del admin para ContactoEmergencia
@admin.register(ContactoEmergencia)
class ContactoEmergenciaAdmin(admin.ModelAdmin):
    list_display = ('primer_nombre', 'primer_apellido', 'telefono', 'relacion_parentesco', 'paciente')
    list_filter = ('relacion_parentesco',)
    search_fields = ('primer_nombre', 'primer_apellido', 'telefono', 'paciente__primer_nombre', 'paciente__primer_apellido')
    
    fieldsets = (
        ('Información Personal', {
            'fields': (
                ('primer_nombre', 'segundo_nombre'),
                ('primer_apellido', 'segundo_apellido'),
                'relacion_parentesco'
            )
        }),
        ('Contacto', {
            'fields': (
                ('prefijo_telefonico', 'telefono'),
            )
        }),
        ('Paciente Asociado', {
            'fields': ('paciente',)
        })
    )
