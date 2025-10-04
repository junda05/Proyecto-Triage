import { useState, useCallback } from 'react';
import { csvExportService } from '../services/api/csvExportService';
import useNotificaciones from './useNotificaciones';

/**
 * Hook personalizado para manejar la exportación de CSV
 * Siguiendo el principio de Single Responsibility
 */
const useCsvExport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { mostrarExito, mostrarError, mostrarInfo } = useNotificaciones();

  /**
   * Exporta y descarga un CSV simple de la tabla de pacientes
   */
  const exportarCSV = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mostrar notificación de inicio
      mostrarInfo('Preparando exportación CSV...', {
        titulo: 'Generando reporte'
      });

      // Realizar exportación
      const result = await csvExportService.exportarYDescargar();

      if (result.success) {
        mostrarExito(`Archivo ${result.filename} descargado exitosamente`, {
          titulo: 'Exportación completada'
        });
        return { success: true, filename: result.filename };
      } else {
        setError(result.error);
        mostrarError(result.error, {
          titulo: 'Error en la exportación'
        });
        return { success: false, error: result.error };
      }

    } catch (error) {
      const errorMessage = 'Error inesperado al exportar CSV';
      setError(errorMessage);
      mostrarError(errorMessage, {
        titulo: 'Error inesperado'
      });
      console.error('Error en useCsvExport:', error);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  }, [mostrarExito, mostrarError, mostrarInfo]);

  /**
   * Exporta CSV con los filtros actuales del dashboard
   */
  const exportarConFiltrosActuales = useCallback(async (filtrosActuales = {}, fechas = {}) => {
    const filtrosExportacion = {
      fechaInicio: fechas.fechaInicio,
      fechaFin: fechas.fechaFin,
      nivelTriage: filtrosActuales.esi || null,
      estado: filtrosActuales.status || null,
      // Nota: sexo no está en los filtros actuales, pero se puede agregar después
    };

    // Remover valores null/undefined
    Object.keys(filtrosExportacion).forEach(key => {
      if (filtrosExportacion[key] === null || filtrosExportacion[key] === undefined || filtrosExportacion[key] === '') {
        delete filtrosExportacion[key];
      }
    });

    return await exportarCSV(filtrosExportacion);
  }, [exportarCSV]);

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    loading,
    error,
    
    // Acciones
    exportarCSV,
    exportarConFiltrosActuales,
    clearError
  };
};

export default useCsvExport;