/**
 * Gestor centralizado de sesiones y tokens expirados
 * Maneja la lógica cuando los refresh tokens expiran
 */
import { limpiarTokens } from './tokenStorage';

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
    // Evitar múltiples ejecuciones con debounce
    if (this.sessionExpiredHandled) {
      console.log('Session expired ya está siendo manejada, ignorando...');
      return;
    }
    
    this.sessionExpiredHandled = true;
    console.warn('Refresh token expirado, cerrando sesión:', error?.message);
    
    // 1. Limpiar tokens inmediatamente
    limpiarTokens();
    
    // 2. Notificar a todos los listeners (AuthContext, etc.)
    this.notifySessionExpired();
    
    // 3. Mostrar notificación al usuario
    // 
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'warning',
        titulo: 'Sesión Expirada',
        mensaje: 'Tu sesión anterior ha expirado por seguridad. Por favor, inicia sesión nuevamente.',
        autoCloseMs: 8000
      });
    }
    
    // 4. Redirigir al login con delay
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
    }
    
    this.redirectTimeout = setTimeout(() => {
      this.redirectTo(this.redirectUrl, {
        mensaje: 'Sesión expirada',
        tipo: 'session_expired'
      });
      // Reset del flag después de la redirección
      this.sessionExpiredHandled = false;
    }, 2000);
  }

  /**
   * Maneja errores de tokens inválidos o corruptos
   */
  handleInvalidToken(error) {
    // Evitar múltiples ejecuciones
    if (this.sessionExpiredHandled) {
      console.log('Invalid token ya está siendo manejado, ignorando...');
      return;
    }
    
    this.sessionExpiredHandled = true;
    console.warn('Token inválido detectado:', error?.message);
    
    limpiarTokens();
    this.notifySessionExpired();
    
    if (this.notificationCallback) {
      this.notificationCallback({
        type: 'error',
        titulo: 'Token Inválido',
        mensaje: 'Se detectó un problema con tu sesión. Redirigiendo al login...',
        autoCloseMs: 4000
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