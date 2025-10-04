import { useState, useCallback } from 'react';
import triageService from '../services/api/triageService';
import useAuth from './useAuth';
import useNotificaciones from './useNotificaciones';
import { formatearErrorValidacion } from '../utils/errorFormatter';

const useTriage = () => {
  const [sesionActual, setSesionActual] = useState(null);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triageCompletado, setTriageCompletado] = useState(false);
  const [nivelESI, setNivelESI] = useState(null);
  const [iniciandoSesion, setIniciandoSesion] = useState(false); // Nuevo estado para evitar múltiples llamadas
  
  const auth = useAuth();
  const { mostrarExito, mostrarError } = useNotificaciones();

  /**
   * Iniciar una nueva sesión de triage
   */
  const iniciarSesionTriage = useCallback(async (pacienteId) => {
    // Evitar múltiples llamadas simultáneas
    if (iniciandoSesion) {
      return { success: false, error: 'Sesión ya en proceso de inicio' };
    }

    // Si ya hay una sesión activa, no crear otra
    if (sesionActual) {
      return { success: true, data: { sesion: sesionActual, primera_pregunta: preguntaActual } };
    }

    setIniciandoSesion(true);
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await triageService.iniciarTriage(pacienteId);
      
      if (resultado.success) {
        setSesionActual(resultado.data.sesion);
        setPreguntaActual(resultado.data.primera_pregunta);
        setRespuestas([]);
        setTriageCompletado(false);
        setNivelESI(null);
        
        return { success: true, data: resultado.data };
      } else {
        const errorFormateado = formatearErrorValidacion(resultado.error);
        setError(errorFormateado);
        mostrarError(errorFormateado, {
          titulo: 'Error al Iniciar Triage'
        });
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      const mensajeError = 'Error inesperado al iniciar el triage';
      setError(mensajeError);
      mostrarError(mensajeError, {
        titulo: 'Error'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
      setIniciandoSesion(false);
    }
  }, [mostrarError, iniciandoSesion, sesionActual, preguntaActual]);

  /**
   * Recuperar una sesión existente por ID
   */
  const recuperarSesionPorId = useCallback(async (sessionId) => {
    if (iniciandoSesion) {
      return { success: false, error: 'Recuperación ya en proceso' };
    }

    setIniciandoSesion(true);
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await triageService.recuperarSesion(sessionId);
      
      if (resultado.success) {
        const sesionRecuperada = resultado.data.sesion;
        const siguientePregunta = resultado.data.siguiente_pregunta;
        
        // Establecer la sesión recuperada
        setSesionActual(sesionRecuperada);
        setTriageCompletado(sesionRecuperada.completado || false);
        setNivelESI(sesionRecuperada.nivel_triage || null);
        
        // Si la sesión ya está completada, no hay más preguntas
        if (sesionRecuperada.completado) {
          setPreguntaActual(null);
          setRespuestas([]);
        } else {
          // Establecer la siguiente pregunta obtenida del backend
          setPreguntaActual(siguientePregunta);
          setRespuestas([]); // Las respuestas se cargarán del estado guardado si existe
        }
        
        mostrarExito('Sesión recuperada exitosamente. Continuarás desde donde lo dejaste.', {
          titulo: 'Sesión Recuperada'
        });
        
        return { success: true, data: resultado.data };
      } else {
        const errorFormateado = formatearErrorValidacion(resultado.error);
        setError(errorFormateado);
        
        // Verificar si es error de sesión completada y agregar flag para redirección
        const esSessionCompletada = resultado.error === 'Sesión ya completada' || 
          (typeof resultado.error === 'string' && resultado.error.includes('ya completada'));
        
        mostrarError(errorFormateado, {
          titulo: 'Error al Recuperar Sesión'
        });
        
        return { 
          success: false, 
          error: resultado.error,
          shouldRedirectToRegister: esSessionCompletada
        };
      }
    } catch (error) {
      const mensajeError = 'Error inesperado al recuperar la sesión';
      setError(mensajeError);
      mostrarError(mensajeError, {
        titulo: 'Error'
      });
      return { success: false, error };
    } finally {
      setLoading(false);
      setIniciandoSesion(false);
    }
  }, [mostrarError, mostrarExito, iniciandoSesion]);

  /**
   * Enviar respuesta y obtener siguiente pregunta
   */
  const enviarRespuesta = useCallback(async (valorRespuesta, informacionAdicional = null) => {
    if (!sesionActual || !preguntaActual) {
      setError('No hay sesión activa o pregunta actual');
      return { success: false };
    }

    setLoading(true);
    setError(null); // Limpiar error previo

    try {
      const datosRespuesta = {
        sesion: sesionActual.id,
        pregunta: preguntaActual.codigo,
        valor: valorRespuesta,
        informacion_adicional: informacionAdicional
      };

      const resultado = await triageService.enviarRespuesta(datosRespuesta);

      if (resultado.success) {
        // Agregar respuesta al historial
        const nuevaRespuesta = {
          pregunta: preguntaActual,
          valor: valorRespuesta,
          informacion_adicional: informacionAdicional,
          timestamp: new Date().toISOString()
        };
        
        setRespuestas(prev => [...prev, nuevaRespuesta]);

        // Verificar si hay siguiente pregunta o si terminó
        if (resultado.data.siguiente_pregunta) {
          setPreguntaActual(resultado.data.siguiente_pregunta);
        } else {
          // Triage completado
          setTriageCompletado(true);
          setNivelESI(resultado.data.nivel_triage);
          setPreguntaActual(null);
          
          mostrarExito('Triage completado exitosamente. Por favor espera para ser atendido.', {
            titulo: 'Evaluación Completa'
          });
        }

        return { success: true, data: resultado.data };
      } else {
        const errorFormateado = formatearErrorValidacion(resultado.error);
        setError(errorFormateado);
        // No mostrar notificación aquí, el error se muestra en el componente
        return { success: false, error: resultado.error };
      }
    } catch (error) {
      const errorFormateado = formatearErrorValidacion(error);
      setError(errorFormateado);
      // No mostrar notificación aquí, el error se muestra en el componente
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [sesionActual, preguntaActual, mostrarExito]);

  /**
   * Calcular progreso del triage basado en respuestas
   */
  const calcularProgreso = useCallback(() => {
    if (!preguntaActual && triageCompletado) {
      return 100;
    }
    
    // Estimación basada en respuestas enviadas
    // El backend maneja el flujo dinámico, así que estimamos
    const respuestasContestadas = respuestas.length;
    const estimacionTotal = Math.max(10, respuestasContestadas + 5); // Mínimo 10 preguntas estimadas
    
    return Math.min(95, (respuestasContestadas / estimacionTotal) * 100);
  }, [respuestas.length, preguntaActual, triageCompletado]);

  /**
   * Limpiar error actual
   */
  const limpiarError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Limpiar sesión guardada del localStorage
   */
  const limpiarSesionGuardada = useCallback(() => {
    try {
      localStorage.removeItem('triageSession');
    } catch (error) {
      console.warn('Error al limpiar localStorage:', error);
    }
  }, []);

  /**
   * Reiniciar el estado del triage
   */
  const reiniciarTriage = useCallback(() => {
    setSesionActual(null);
    setPreguntaActual(null);
    setRespuestas([]);
    setLoading(false);
    setError(null);
    setTriageCompletado(false);
    setNivelESI(null);
    setIniciandoSesion(false); // Reset también el estado de iniciando
    
    // Limpiar localStorage
    limpiarSesionGuardada();
  }, [limpiarSesionGuardada]);

  /**
   * Limpiar sesión actual sin reiniciar estados
   */
  const limpiarSesion = useCallback(() => {
    limpiarSesionGuardada();
  }, [limpiarSesionGuardada]);

  /**
   * Obtener resumen de la sesión actual
   */
  const obtenerResumenSesion = useCallback(() => {
    return {
      sesionId: sesionActual?.id,
      pacienteId: sesionActual?.paciente,
      fechaInicio: sesionActual?.fecha_inicio,
      totalRespuestas: respuestas.length,
      completado: triageCompletado,
      nivelESI: nivelESI,
      progreso: calcularProgreso()
    };
  }, [sesionActual, respuestas.length, triageCompletado, nivelESI, calcularProgreso]);

  return {
    // Estado
    sesionActual,
    preguntaActual,
    respuestas,
    loading,
    error,
    triageCompletado,
    nivelESI,
    
    // Funciones
    iniciarSesionTriage,
    recuperarSesionPorId,
    enviarRespuesta,
    reiniciarTriage,
    limpiarSesion,
    limpiarError,
    calcularProgreso,
    obtenerResumenSesion,
    
    // Estados derivados
    hayPreguntaActual: !!preguntaActual,
    puedeResponder: !!preguntaActual && !loading,
    progreso: calcularProgreso()
  };
};

export default useTriage;
