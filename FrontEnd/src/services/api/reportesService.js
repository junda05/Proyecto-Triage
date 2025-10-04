import api from '../../config/axios';

/**
 * Servicio simplificado para reportes - Principio DRY
 * Usa un solo endpoint unificado para obtener todos los datos
 */
class ReportesService {
  
  /**
   * Obtiene reporte completo del dashboard (UNIFICADO - DRY)
   * Reemplaza múltiples llamadas con una sola
   */
  static async getReporteCompleto(filtros = {}) {
    try {
      let response;
      
      // Si no hay filtros, usar GET para obtener ultimos 30 dias
      if (!filtros.fecha_inicio || !filtros.fecha_fin) {
        response = await api.get('/reportes/dashboard/');
      } else {
        // Con filtros, usar POST
        response = await api.post('/reportes/dashboard/', filtros);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al obtener reporte completo'
      };
    }
  }

  // Métodos eliminados - usar getReporteCompleto directamente
}

export default ReportesService;