import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/api/authService';
import { obtenerUsuario, limpiarTokens, obtenerTokens } from '../services/utils/tokenStorage';
import useNotificaciones from '../hooks/useNotificaciones';
import sessionManager from '../services/utils/sessionManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => obtenerUsuario());
  const [cargando, setCargando] = useState(false);
  const [inicializando, setInicializando] = useState(true); // Nuevo estado
  const [errorAuth, setErrorAuth] = useState(null);
  
  const navigate = useNavigate();
  
  // Hook de notificaciones integrado
  const notificaciones = useNotificaciones();

  // Configurar sessionManager con callbacks de navegación y notificaciones
  useEffect(() => {
    sessionManager.setRedirectCallback((path, options = {}) => {
      navigate(path, options);
    });
    
    sessionManager.setNotificationCallback((notificacion) => {
      if (notificacion.type === 'warning') {
        notificaciones.mostrarAdvertencia(notificacion.mensaje, {
          titulo: notificacion.titulo,
          autoCloseMs: notificacion.autoCloseMs,
          dismissible: notificacion.dismissible
        });
      } else if (notificacion.type === 'error') {
        notificaciones.mostrarError(notificacion.mensaje, {
          titulo: notificacion.titulo,
          autoCloseMs: notificacion.autoCloseMs
        });
      }
    });

    // Escuchar eventos de sesión expirada
    const removeSessionListener = sessionManager.addSessionListener((evento) => {
      if (evento.type === 'SESSION_EXPIRED') {
        console.log('🔄 Sesión expirada detectada, limpiando estado usuario...');
        setUsuario(null);
        setErrorAuth('Sesión expirada');
      }
    });

    return () => {
      removeSessionListener();
      sessionManager.cleanup();
    };
  }, [navigate, notificaciones]);

  const iniciarSesion = useCallback(async (username, password) => {
    setCargando(true);
    setErrorAuth(null);
    try {
      const data = await authService.login(username, password);
      const userData = data.user || { username };
      setUsuario(userData);
      
      // Mostrar notificación de éxito
      notificaciones.notificarLoginExitoso(userData.first_name || userData.username);
      
      return { ok: true };
    } catch (e) {
      let errorMsg;
      let titulo = 'Error de autenticación';
      
      // Verificar si es un error de conexión con el servidor
      if (!e.response) {
        errorMsg = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.';
        titulo = 'Error de conexión';
      } else {
        let rawErrorMsg = e.response?.data?.detail || 
                         e.response?.data?.non_field_errors?.[0] || 
                         'Error de autenticación';
        
        // Traducir mensajes comunes del servidor al español
        if (rawErrorMsg === 'No active account found with the given credentials') {
          errorMsg = 'No se encontró una cuenta activa con las credenciales proporcionadas';
        } else {
          errorMsg = rawErrorMsg;
        }
      }
      
      setErrorAuth(e.response?.data || errorMsg);
      
      // Mostrar notificación de error
      notificaciones.mostrarError(errorMsg, {
        titulo: titulo
      });
      
      return { ok: false, error: e };
    } finally {
      setCargando(false);
    }
  }, [notificaciones]);

  // const registrar = useCallback(async (formData) => {
  //   setCargando(true);
  //   setErrorAuth(null);
  //   try {
  //     const data = await authService.registrar(formData);
      
  //     return { ok: true, data };
  //   } catch (e) {
  //     let errorMsg;
  //     let titulo = 'Error en el registro';
      
  //     // Verificar si es un error de conexión con el servidor
  //     if (!e.response) {
  //       errorMsg = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.';
  //       titulo = 'Error de conexión';
  //       setErrorAuth(errorMsg);
  //     } else {
  //       const errorData = e.response?.data || 'Error al registrar';
  //       setErrorAuth(errorData);
        
  //       // Mostrar notificación de error específica
  //       errorMsg = typeof errorData === 'string' 
  //         ? errorData 
  //         : errorData.non_field_errors?.[0] || 'Error al crear la cuenta';
  //     }
        
  //     notificaciones.mostrarError(errorMsg, {
  //       titulo: titulo
  //     });
      
  //     return { ok: false, error: e };
  //   } finally {
  //     setCargando(false);
  //   }
  // }, [notificaciones]);

  const cerrarSesion = useCallback(async () => {
    setCargando(true);
    try {
      await authService.logout();
      notificaciones.mostrarExito('Sesión cerrada exitosamente', {
        titulo: 'Logout',
        autoCloseMs: 2000
      });
    } catch (error) {
      // Log del error pero no falló en el lado cliente
      console.warn('Error en logout del servidor:', error.message);
    } finally {
      limpiarTokens();
      setUsuario(null);
      setCargando(false);
    }
  }, [notificaciones]);

  const cargarSesionInicial = useCallback(async () => {
    setInicializando(true);
    try {
      const tokens = obtenerTokens();
      if (tokens?.user && tokens?.access) {
        // VERIFICAR LA VALIDEZ DEL TOKEN CON EL SERVIDOR
        try {
          // Intentar obtener datos del usuario para validar que el token es válido
          const datosCompletos = await authService.actualizarDatosUsuario();
          setUsuario(datosCompletos);
        } catch (error) {
          console.warn('Token inválido o expirado durante inicialización:', error);
          
          // Si es 401, probablemente token expirado - usar sessionManager
          if (error.response?.status === 401) {
            sessionManager.handleRefreshTokenExpired(error);
          } else {
            // Otros errores, limpiar sesión silenciosamente
            limpiarTokens();
            setUsuario(null);
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar sesión inicial:', error);
      // En caso de error, limpiar tokens corruptos
      sessionManager.handleInvalidToken(error);
    } finally {
      setInicializando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesionInicial();
  }, [cargarSesionInicial]);

  const valor = useMemo(() => ({
    usuario,
    cargando: cargando || inicializando, // Incluir inicializando en cargando
    errorAuth,
    iniciarSesion,
    // registrar,
    cerrarSesion,
    autenticado: !!usuario,
    inicializando,
    // Incluir las notificaciones en el contexto
    notificaciones: notificaciones.notificaciones,
    eliminarNotificacion: notificaciones.eliminarNotificacion,
    limpiarNotificaciones: notificaciones.limpiarNotificaciones,
    // Funciones utilitarias de notificación
    mostrarExito: notificaciones.mostrarExito,
    mostrarError: notificaciones.mostrarError,
    mostrarAdvertencia: notificaciones.mostrarAdvertencia,
    mostrarInfo: notificaciones.mostrarInfo
  // }), [usuario, cargando, inicializando, errorAuth, iniciarSesion, registrar, cerrarSesion, notificaciones]);
  }), [usuario, cargando, inicializando, errorAuth, iniciarSesion, cerrarSesion, notificaciones]);

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;