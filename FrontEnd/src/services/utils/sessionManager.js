/**
 * Gestor centralizado de sesiones y tokens expirados
 * Maneja la lógica cuando los refresh tokens expiran
 */
import { limpiarTokens } from './tokenStorage';

/**
 * Duraciones de notificación importadas del hook centralizado
 * Para mantener consistencia con el sistema de notificaciones
 */
const DURACIONES_NOTIFICACION = {
  WARNING: 5000,     // Para sesiones expiradas
  ERROR: 7000,       // Para tokens inválidos
};

class SessionManager {
  constructor() {
    this.listeners = new Set();
    this.notificationCallback = null;
    this.redirectUrl = '/staff/login';
    
    // Flags para evitar múltiples ejecuciones
    this.sessionExpiredHandled = false;
    this.redirectTimeout = null;
  }

  /**
   * Registra callback para mostrar notificaciones
   */
  setNotificationCallback(callback) {
    this.notificationCallback = callback;
  }

  /**
   * Configura la URL de redirección por defecto
   */
  setRedirectUrl(url) {
    this.redirectUrl = url;
  }

  /**
   * Redirige usando window.location (más robusto que useNavigate en este contexto)
   */
  redirectTo(path, state = null) {
    if (typeof window !== 'undefined') {
      if (state) {
        sessionStorage.setItem('redirect_state', JSON.stringify(state));
      }
      window.location.href = path;
    }
  }

  /**
   * Maneja cuando el refresh token ha expirado
   * INCLUYE DEBOUNCE para evitar múltiples ejecuciones
   */
  handleRefreshTokenExpired(error) {
    if (this.sessionExpiredHandled) {
      return;
    }
    
    this.sessionExpiredHandled = true;
    
    limpiarTokens();
    this.notifySessionExpired();
    
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'warning',
        titulo: 'Sesión Expirada',
        mensaje: 'Tu sesión ha expirado por seguridad. Inicia sesión nuevamente.',
        autoCloseMs: DURACIONES_NOTIFICACION.WARNING
      });
    }
    
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
    
    this.redirectTimeout = setTimeout(() => {
      this.redirectTo(this.redirectUrl, {
        mensaje: 'Sesión expirada por inactividad',
        tipo: 'session_expired'
      });
      this.sessionExpiredHandled = false;
    }, 2500);
  }

  /**
   * Maneja errores de tokens inválidos o corruptos
   */
  handleInvalidToken(error) {
    if (this.sessionExpiredHandled) {
      return;
    }
    
    this.sessionExpiredHandled = true;
    
    limpiarTokens();
    this.notifySessionExpired();
    
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'error',
        titulo: 'Token Inválido',
        mensaje: 'Se detectó un problema con tu sesión. Redirigiendo al login...',
        autoCloseMs: DURACIONES_NOTIFICACION.ERROR
      });
    }
    
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
    
    this.redirectTimeout = setTimeout(() => {
      this.redirectTo(this.redirectUrl);
      this.sessionExpiredHandled = false;
    }, 1500);
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
   * Reinicia el estado (útil para testing o situaciones especiales)
   */
  reset() {
    this.sessionExpiredHandled = false;
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }

  /**
   * Limpia todos los callbacks
   */
  cleanup() {
    this.listeners.clear();
    this.notificationCallback = null;
    this.reset();
  }
}

// Instancia singleton
const sessionManager = new SessionManager();

export default sessionManager;