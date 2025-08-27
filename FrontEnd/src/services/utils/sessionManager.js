/**
 * Gestor centralizado de sesiones y tokens expirados
 * Maneja la lógica cuando los refresh tokens expiran
 */
import { limpiarTokens } from './tokenStorage';

class SessionManager {
  constructor() {
    this.listeners = new Set();
    this.redirectCallback = null;
    this.notificationCallback = null;
  }

  /**
   * Registra callback para redirección automática
   */
  setRedirectCallback(callback) {
    this.redirectCallback = callback;
  }

  /**
   * Registra callback para mostrar notificaciones
   */
  setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  /**
   * Maneja cuando el refresh token ha expirado
   * Se llama desde axios interceptor cuando falla el refresh
   */
  handleRefreshTokenExpired(error) {
    console.warn('🚨 Refresh token expirado, cerrando sesión:', error?.message);
    
    // 1. Limpiar tokens inmediatamente
    limpiarTokens();
    
    // 2. Notificar a todos los listeners (AuthContext, etc.)
    this.notifySessionExpired();
    
    // 3. Mostrar notificación al usuario
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'warning',
        titulo: 'Sesión Expirada',
        mensaje: 'Tu sesión ha expirado por seguridad. Por favor, inicia sesión nuevamente.',
        autoCloseMs: 8000,
        dismissible: true
      });
    }
    
    // 4. Redirigir al login con delay para que se vea la notificación
    setTimeout(() => {
      if (this.redirectCallback) {
        this.redirectCallback('/staff/login', {
          replace: true,
          state: { 
            mensaje: 'Sesión expirada',
            tipo: 'session_expired'
          }
        });
      }
    }, 1500);
  }

  /**
   * Maneja errores de tokens inválidos o corruptos
   */
  handleInvalidToken(error) {
    console.warn('🚨 Token inválido detectado:', error?.message);
    
    limpiarTokens();
    this.notifySessionExpired();
    
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'error',
        titulo: 'Token Inválido',
        mensaje: 'Se detectó un problema con tu sesión. Redirigiendo al login...',
        autoCloseMs: 5000
      });
    }
    
    setTimeout(() => {
      if (this.redirectCallback) {
        this.redirectCallback('/staff/login', { replace: true });
      }
    }, 2000);
  }

  /**
   * Registra un listener para cambios de sesión
   */
  addSessionListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notifica a todos los listeners que la sesión expiró
   */
  notifySessionExpired() {
    this.listeners.forEach(callback => {
      try {
        callback({ type: 'SESSION_EXPIRED' });
      } catch (error) {
        console.error('Error en session listener:', error);
      }
    });
  }

  /**
   * Limpia todos los callbacks (útil para testing)
   */
  cleanup() {
    this.listeners.clear();
    this.redirectCallback = null;
    this.notificationCallback = null;
  }
}

// Instancia singleton
const sessionManager = new SessionManager();

export default sessionManager;
