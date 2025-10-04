import { useState, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import ReportesService from '../services/api/reportesService';

/**
 * Hook simplificado para gestionar reportes
 * Un solo tipo de reporte con todas las métricas
 */
const useReportes = () => {
  
  // Estados principales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reporte, setReporte] = useState(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    fecha_inicio: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    fecha_fin: format(new Date(), 'yyyy-MM-dd'),
    niveles_esi: [],
    estados: [],
    generos: [],
    turnos: []
  });

  /**
   * Carga reporte completo con todas las métricas
   */
  const cargarReporte = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await ReportesService.getReporteCompleto(filtros);
      
      if (result.success) {
        setReporte(result.data);
        return { 
          success: true, 
          message: 'Reporte generado exitosamente',
          data: result.data 
        };
      } else {
        setError(result.error);
        return { 
          success: false, 
          message: result.error || 'Error al generar el reporte'
        };
      }
    } catch (err) {
      const errorMsg = 'Error inesperado al generar reporte';
      setError(errorMsg);
      console.error('Error cargando reporte:', err);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  /**
   * Actualiza los filtros SIN recargar automáticamente
   */
  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      ...nuevosFiltros
    }));
  }, []);

  /**
   * Resetea los filtros a valores por defecto
   */
  const resetearFiltros = useCallback(() => {
    setFiltros({
      fecha_inicio: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      fecha_fin: format(new Date(), 'yyyy-MM-dd'),
      niveles_esi: [],
      estados: [],
      generos: [],
      turnos: []
    });
  }, []);

  /**
   * Establece un rango de fechas predefinido
   */
  const establecerRangoFechas = useCallback((tipo) => {
    const hoy = new Date();
    let fechaInicio;
    
    switch (tipo) {
      case 'hoy':
        fechaInicio = hoy;
        break;
      case '7dias':
        fechaInicio = subDays(hoy, 7);
        break;
      case '30dias':
        fechaInicio = subDays(hoy, 30);
        break;
      case '90dias':
        fechaInicio = subDays(hoy, 90);
        break;
      default:
        fechaInicio = subDays(hoy, 30);
    }
    
    actualizarFiltros({
      fecha_inicio: format(fechaInicio, 'yyyy-MM-dd'),
      fecha_fin: format(hoy, 'yyyy-MM-dd')
    });
  }, [actualizarFiltros]);

  return {
    // Estados
    loading,
    error,
    reporte,
    filtros,
    
    // Acciones
    cargarReporte,
    actualizarFiltros,
    resetearFiltros,
    establecerRangoFechas,
    
    // Utilidades
    hayDatos: !!reporte,
    fechaUltimaActualizacion: reporte?.fecha_generacion
  };
};

export default useReportes;