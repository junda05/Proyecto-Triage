import axiosClient from '../../config/axios';
import { guardarTokens, limpiarTokens, obtenerRefreshToken, obtenerTokens } from '../utils/tokenStorage';

/**
 * Servicio de autenticación para manejo de usuarios
 * 
 * Endpoints de Autenticación:
 * POST /api/v1/auth/login              -> { access, refresh } - Inicio de sesión
 * POST /api/v1/auth/refresh-access     -> { access, refresh? } - Renovar token de acceso
 * POST /api/v1/auth/logout             -> {} - Cerrar sesión (blacklist refresh token)
 * 
 * Endpoints de Gestión de Usuarios:
 * POST /api/v1/auth/usuarios           -> {...} - Crear nuevo usuario (admin)
 * GET  /api/v1/auth/usuarios           -> [...] - Obtener todos los usuarios (admin)
 * GET  /api/v1/auth/usuarios/{id}      -> {...} - Obtener usuario específico (admin)
 * PATCH /api/v1/auth/usuarios/{id}     -> {...} - Actualizar usuario (admin)
 * DELETE /api/v1/auth/usuarios/{id}    -> {} - Eliminar usuario (admin)
 * 
 * Endpoints de Perfil:
 * GET  /api/v1/auth/perfil             -> {...} - Obtener datos del usuario autenticado
 * 
 * Funcionalidades:
 * - Autenticación completa con JWT
 * - Gestión completa de usuarios para administradores
 * - Obtención y actualización de perfil de usuario
 * - Manejo automático de tokens y renovación
 * - Gestión de errores específicos por endpoint
 */

/**
 * Manejo centralizado de errores HTTP
 * Aplica principio DRY para evitar repetición de código
 */
const handleHttpError = (error, operation = 'operación') => {
  const status = error.response?.status;
  const backendError = error.response?.data?.error;
  const backendErrors = error.response?.data?.errors;

  // Errores de autenticación
  if (status === 401) {
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }

  // Errores de autorización
  if (status === 403) {
    const isAdminOperation = ['crear', 'actualizar', 'eliminar'].some(op => 
      operation.toLowerCase().includes(op)
    );
    if (isAdminOperation) {
      throw new Error('No tienes permisos de administrador para realizar esta acción.');
    }
    throw new Error('No tienes permisos para acceder a esta información.');
  }

  // Recurso no encontrado
  if (status === 404) {
    throw new Error(operation.includes('usuario') ? 'Usuario no encontrado.' : 'Recurso no encontrado.');
  }

  // Errores de validación
  if (status === 400) {
    if (typeof backendErrors === 'object') {
      // Errores de validación específicos por campo
      const errorMessages = [];
      for (const [, messages] of Object.entries(backendErrors)) {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        } else {
          errorMessages.push(messages);
        }
      }
      throw new Error(errorMessages.join('\n'));
    }
    throw new Error(backendError || `Error de validación en ${operation}`);
  }

  // Errores del servidor
  if (status >= 500) {
    throw new Error('Error del servidor. Intenta nuevamente más tarde.');
  }

  // Error de red o desconocido
  throw new Error(error.message || `Error de conexión en ${operation}`);
};

const authService = {
  // ==================== AUTENTICACIÓN ====================

  /**
   * Inicia sesión y obtiene los datos completos del usuario
   * 
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos de login con usuario completo
   */
  login: async (username, password) => {
    try {
      // 1. Obtener tokens
      const { data: tokenData } = await axiosClient.post('/auth/login', { 
        username, 
        password 
      });
      
      // 2. Guardar tokens temporalmente para hacer la petición del perfil
      guardarTokens({
        access: tokenData.access,
        refresh: tokenData.refresh,
        user: { username } // Usuario temporal
      });
      
      // 3. Obtener datos completos del usuario
      const datosUsuarioCompletos = await authService.obtenerPerfil();
      
      // 4. Guardar tokens con datos completos del usuario
      guardarTokens({
        access: tokenData.access,
        refresh: tokenData.refresh,
        user: datosUsuarioCompletos
      });
      
      return {
        ...tokenData,
        user: datosUsuarioCompletos
      };
    } catch (error) {
      // Si falla la obtención del perfil, limpiar tokens
      limpiarTokens();
      throw error;
    }
  },

  /**
   * Cierra sesión invalidando el refresh token
   * 
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      const refreshToken = obtenerRefreshToken();
      
      if (refreshToken) {
        // Enviar refresh token para invalidarlo en el servidor
        await axiosClient.post('/auth/logout', {
          refresh: refreshToken
        });
      }
    } catch (error) {
      // Log del error para debugging, pero no fallar el logout
      console.warn('Error al invalidar token en servidor:', error.message);
      
      // Si es error 400, probablemente el token ya estaba invalidado
      if (error.response?.status !== 400) {
        console.error('Error inesperado en logout:', error);
      }
    } finally {
      // Siempre limpiar tokens del localStorage
      limpiarTokens();
    }
  },

  // ==================== PERFIL DE USUARIO ====================

  /**
   * Obtiene los datos completos del usuario autenticado
   * 
   * @returns {Promise<Object>} Datos del usuario con estructura:
   * {
   *   id: number,
   *   username: string,
   *   email: string,
   *   first_name: string,
   *   last_name: string,
   *   fecha_registro: string,
   *   is_active: boolean
   * }
   */
  obtenerPerfil: async () => {
    try {
      const { data } = await axiosClient.get('/auth/perfil');
      
      if (!data.exito) {
        throw new Error(data.error || 'Error al obtener perfil');
      }
      
      return data.usuario;
    } catch (error) {
      handleHttpError(error, 'obtener perfil');
    }
  },

  /**
   * Actualiza los datos del usuario en el localStorage
   * Útil después de editar el perfil
   * 
   * @returns {Promise<Object>} Datos actualizados del usuario
   */
  actualizarDatosUsuario: async () => {
    try {
      const datosActualizados = await authService.obtenerPerfil();
      
      // Mantener tokens existentes, solo actualizar datos del usuario
      const tokensActuales = obtenerTokens();
      if (tokensActuales) {
        guardarTokens({
          ...tokensActuales,
          user: datosActualizados
        });
      }
      
      return datosActualizados;
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      throw error;
    }
  },

  // ==================== GESTIÓN DE USUARIOS (ADMIN) ====================

  /**
   * Crea un nuevo usuario (solo para administradores)
   * 
   * @param {Object} datosUsuario - Datos del usuario a crear
   * @returns {Promise<Object>} Usuario creado
   */
  crearUsuario: async (datosUsuario) => {
    try {
      const { data } = await axiosClient.post('/auth/usuarios', datosUsuario);
      
      if (!data.exito) {
        throw new Error(data.error || 'Error al crear usuario');
      }
      
      return data.data;
    } catch (error) {
      handleHttpError(error, 'crear usuario');
    }
  },

  /**
   * Obtiene todos los usuarios del sistema (solo para administradores)
   * 
   * @returns {Promise<Array>} Lista de usuarios con estructura:
   * {
   *   id: number,
   *   username: string,
   *   email: string,
   *   first_name: string,
   *   middle_name: string,
   *   last_name: string,
   *   second_surname: string,
   *   phone_prefix: string,
   *   phone: string,
   *   role: string,
   *   date_joined: string,
   *   last_login: string,
   *   is_active: boolean
   * }
   */
  obtenerTodosLosUsuarios: async () => {
    try {
      const { data } = await axiosClient.get('/auth/usuarios');
      
      if (!data.exito) {
        throw new Error(data.error || 'Error al obtener usuarios');
      }
      
      // La API retorna los usuarios en data.data.results (estructura paginada)
      const usuarios = data.data.results || data.data || [];
      return usuarios;
    } catch (error) {
      handleHttpError(error, 'obtener usuarios');
    }
  },

  /**
   * Actualiza un usuario específico (solo para administradores)
   * 
   * @param {number} userId - ID del usuario a actualizar
   * @param {Object} datosUsuario - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  actualizarUsuario: async (userId, datosUsuario) => {
    try {
      const { data } = await axiosClient.patch(`/auth/usuarios/${userId}`, datosUsuario);
      
      if (!data.exito) {
        throw new Error(data.error || 'Error al actualizar usuario');
      }
      
      return data.data;
    } catch (error) {
      handleHttpError(error, 'actualizar usuario');
    }
  },

  /**
   * Elimina un usuario específico (solo para administradores)
   * 
   * @param {number} userId - ID del usuario a eliminar
   * @returns {Promise<Object>} Respuesta de eliminación
   */
  eliminarUsuario: async (userId) => {
    try {
      const { data } = await axiosClient.delete(`/auth/usuarios/${userId}`);
      
      if (!data.exito) {
        throw new Error(data.error || 'Error al eliminar usuario');
      }
      
      return data;
    } catch (error) {
      handleHttpError(error, 'eliminar usuario');
    }
  }
};

export default authService;