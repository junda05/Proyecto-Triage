import { useState, useCallback, useRef } from 'react';

/**
 * Configuración centralizada de duraciones para notificaciones
 * Todos los tiempos están en milisegundos
 */
const DURACIONES_NOTIFICACION = {
  // Duraciones por tipo
  DEFAULT: 5000,      // 5 segundos - duración estándar
  SUCCESS: 4000,      // 4 segundos - éxito se puede leer rápido
  ERROR: 7000,        // 7 segundos - errores necesitan más tiempo
  WARNING: 5000,      // 5 segundos - advertencias duración estándar
  INFO: 4000,         // 4 segundos - información se puede leer rápido
  
  // Duraciones para casos específicos
  REGISTRO_EXITOSO: 3000,  // 3 segundos - redirige automáticamente
  LOGIN_EXITOSO: 2000,     // 2 segundos - redirige rápidamente
  
  // Configuración de detección de duplicados
  VENTANA_DUPLICADOS: 5000, // 5 segundos para detectar duplicados
};

/**
 * Hook para gestión centralizada de notificaciones
 * 
 * Características:
 * - Gestión de múltiples notificaciones simultáneas
 * - Auto-cierre configurable por notificación
 * - Funciones utilitarias para casos comunes
 * - Sistema de IDs únicos para control granular
 * - Cleanup automático para prevenir memory leaks
 * - Duraciones centralizadas y configurables
 * 
 * @returns {Object} - API de notificaciones
 */
const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const contadorId = useRef(0);
  const timersRef = useRef(new Map());

  /**
   * Genera un ID único para cada notificación
   */
  const generarId = useCallback(() => {
    contadorId.current += 1;
    return `notificacion_${contadorId.current}_${Date.now()}`;
  }, []);

  /**
   * Elimina una notificación específica
   * 
   * @param {string} id - ID de la notificación a eliminar
   */
  const eliminarNotificacion = useCallback((id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    
    // Limpiar timer si existe
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  /**
   * Añade una nueva notificación
   * 
   * @param {Object} notificacion - Configuración de la notificación
   * @param {string} notificacion.type - Tipo (success, error, warning, info)
   * @param {string} notificacion.mensaje - Mensaje principal
   * @param {string} notificacion.titulo - Título opcional
   * @param {number} notificacion.autoCloseMs - Tiempo de auto-cierre (0 = manual)
   * @param {boolean} notificacion.dismissible - Permite cierre manual
   * @returns {string} - ID de la notificación creada
   */
  const agregarNotificacion = useCallback((notificacion) => {
    // Verificar si ya existe una notificación similar reciente
    const ahora = new Date();
    const existeNotificacionReciente = notificaciones.some(notif => {
      const tiempoTranscurrido = ahora - new Date(notif.fechaCreacion);
      return notif.type === notificacion.type &&
             notif.mensaje === notificacion.mensaje &&
             notif.titulo === (notificacion.titulo || 'Información') &&
             tiempoTranscurrido < DURACIONES_NOTIFICACION.VENTANA_DUPLICADOS;
    });

    if (existeNotificacionReciente) {
      // console.log('Notificación duplicada evitada:', notificacion.mensaje);
      return null; // No crear notificación duplicada
    }

    const id = generarId();
    const nuevaNotificacion = {
      id,
      type: 'info',
      dismissible: true,
      autoCloseMs: DURACIONES_NOTIFICACION.DEFAULT,
      ...notificacion,
      fechaCreacion: new Date()
    };

    setNotificaciones(prev => [...prev, nuevaNotificacion]);

    // Configurar auto-cierre si está habilitado
    if (nuevaNotificacion.autoCloseMs > 0) {
      const timer = setTimeout(() => {
        eliminarNotificacion(id);
      }, nuevaNotificacion.autoCloseMs);
      
      timersRef.current.set(id, timer);
    }

    return id;
  }, [generarId, eliminarNotificacion, notificaciones]);

  /**
   * Elimina todas las notificaciones
   */
  const limpiarNotificaciones = useCallback(() => {
    // Limpiar todos los timers
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
    
    setNotificaciones([]);
  }, []);

  /**
   * Funciones utilitarias para tipos específicos
   */
  const mostrarExito = useCallback((mensaje, opciones = {}) => {
    return agregarNotificacion({
      type: 'success',
      titulo: opciones.titulo || 'Éxito',
      mensaje,
      autoCloseMs: DURACIONES_NOTIFICACION.SUCCESS,
      ...opciones
    });
  }, [agregarNotificacion]);

  const mostrarError = useCallback((mensaje, opciones = {}) => {
    return agregarNotificacion({
      type: 'error',
      titulo: opciones.titulo || 'Error',
      mensaje,
      autoCloseMs: DURACIONES_NOTIFICACION.ERROR,
      ...opciones
    });
  }, [agregarNotificacion]);

  const mostrarAdvertencia = useCallback((mensaje, opciones = {}) => {
    return agregarNotificacion({
      type: 'warning',
      titulo: opciones.titulo || 'Advertencia',
      mensaje,
      autoCloseMs: DURACIONES_NOTIFICACION.WARNING,
      ...opciones
    });
  }, [agregarNotificacion]);

  const mostrarInfo = useCallback((mensaje, opciones = {}) => {
    return agregarNotificacion({
      type: 'info',
      titulo: opciones.titulo || 'Información',
      mensaje,
      autoCloseMs: DURACIONES_NOTIFICACION.INFO,
      ...opciones
    });
  }, [agregarNotificacion]);

  /**
   * Funciones para casos específicos de la aplicación
   */
  const notificarRegistroExitoso = useCallback((opciones = {}) => {
    return mostrarExito(
      'Tu cuenta ha sido creada exitosamente. Redirigiendo al login...',
      {
        titulo: '¡Registro Completado!',
        autoCloseMs: DURACIONES_NOTIFICACION.REGISTRO_EXITOSO,
        ...opciones
      }
    );
  }, [mostrarExito]);

  const notificarLoginExitoso = useCallback((nombreUsuario = '', opciones = {}) => {
    return mostrarExito(
      `¡Bienvenido${nombreUsuario ? ` ${nombreUsuario}` : ''}! Accediendo al dashboard...`,
      {
        titulo: 'Sesión Iniciada',
        autoCloseMs: DURACIONES_NOTIFICACION.LOGIN_EXITOSO,
        ...opciones
      }
    );
  }, [mostrarExito]);

  return {
    // Estado
    notificaciones,
    
    // Configuración (por si se necesita acceso externo)
    duraciones: DURACIONES_NOTIFICACION,
    
    // Operaciones principales
    agregarNotificacion,
    eliminarNotificacion,
    limpiarNotificaciones,
    
    // Funciones utilitarias
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInfo,
    
    // Funciones específicas de la app
    notificarRegistroExitoso,
    notificarLoginExitoso,
  };
};

export default useNotificaciones;
