import csv
import io
from django.http import HttpResponse
from django.utils import timezone
from .models import Paciente


class PacienteCsvService:
    """
    Servicio para generar exportación CSV simple de pacientes.
    Siguiendo el principio de Single Responsibility Pattern.
    """
    
    def exportar_pacientes_csv(self):
        """
        Genera un archivo CSV con la tabla de pacientes.
        
        Returns:
            HttpResponse con el archivo CSV
        """
        # Obtener todos los pacientes con triage completado
        queryset = Paciente.objects.select_related().prefetch_related(
            'sesiones_triage',
            'contacto_emergencia'
        ).filter(
            sesiones_triage__completado=True
        ).distinct().order_by('-sesiones_triage__fecha_inicio')
        
        # Crear archivo CSV en memoria
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Escribir encabezados según el formato solicitado
        headers = [
            'ID', 'Primer Nombre', 'Segundo Nombre', 'Primer Apellido', 'Segundo Apellido',
            'Edad', 'Tipo Documento', 'Número Documento', 'Sexo', 'Teléfono',
            'EPS', 'Régimen EPS', 'Nivel ESI', 'Estado Atención', 'Síntomas Iniciales',
            'Fecha Llegada', 'Fecha Fin Triage', 'Tiempo Total (min)',
            'Contacto Emergencia', 'Teléfono Emergencia'
        ]
        writer.writerow(headers)
        
        # Escribir datos de pacientes
        for paciente in queryset:
            sesion_triage = paciente.sesiones_triage.first()
            contacto_emergencia = paciente.contacto_emergencia.first()
            
            # Calcular tiempo total si existe fecha fin
            tiempo_total = ''
            if sesion_triage and sesion_triage.fecha_fin:
                tiempo_minutos = (sesion_triage.fecha_fin - sesion_triage.fecha_inicio).total_seconds() / 60
                tiempo_total = f'{tiempo_minutos:.1f}'
            
            # Información de contacto de emergencia
            contacto_nombre = ''
            contacto_telefono = ''
            if contacto_emergencia:
                contacto_nombre = f"{contacto_emergencia.primer_nombre} {contacto_emergencia.primer_apellido}"
                contacto_telefono = f"{contacto_emergencia.prefijo_telefonico}{contacto_emergencia.telefono}"
            
            row = [
                paciente.id,
                paciente.primer_nombre,
                paciente.segundo_nombre or '',
                paciente.primer_apellido,
                paciente.segundo_apellido or '',
                paciente.edad,
                paciente.get_tipo_documento_display(),
                paciente.numero_documento,
                paciente.get_sexo_display(),
                f"{paciente.prefijo_telefonico}{paciente.telefono}",
                paciente.get_eps_display(),
                paciente.get_regimen_eps_display(),
                f"ESI {sesion_triage.nivel_triage}" if sesion_triage and sesion_triage.nivel_triage else 'Sin clasificar',
                paciente.get_estado_display(),
                paciente.sintomas_iniciales,
                sesion_triage.fecha_inicio.strftime('%Y-%m-%d %H:%M:%S') if sesion_triage else '',
                sesion_triage.fecha_fin.strftime('%Y-%m-%d %H:%M:%S') if sesion_triage and sesion_triage.fecha_fin else '',
                tiempo_total,
                contacto_nombre,
                contacto_telefono
            ]
            writer.writerow(row)
        
        # Preparar respuesta HTTP
        response = HttpResponse(
            output.getvalue(),
            content_type='text/csv; charset=utf-8'
        )
        
        filename = f'pacientes_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv'
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        response['Content-Encoding'] = 'utf-8'
        
        return response