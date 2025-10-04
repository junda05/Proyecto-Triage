import axiosClient from '../../config/axios';

/**
 * Servicio p      const response = await apiClient.post('/triage/enviar-respuesta/', respuestaData);gestionar operaciones relacionadas con el triage
 */
export const triageService = {
  /**
   * Iniciar una nueva sesión de triage
   * @param {string} pacienteId - ID del paciente
   * @returns {Promise} Respuesta con la sesión y primera pregunta
   */
  iniciarTriage: async (pacienteId) => {
    // Validaciones de entrada
    if (!pacienteId) {
      return {
        success: false,
        error: 'ID de paciente requerido',
        message: 'Se requiere un ID de paciente válido para iniciar el triage'
      };
    }

    try {
      const response = await axiosClient.post('/triage/iniciar', {
        paciente: pacienteId
      });
      
      // El servidor responde con { exito: true/false, mensaje: string, data: object }
      const serverResponse = response.data;
      
      if (serverResponse.exito) {
        return {
          success: true,
          data: serverResponse.data,
          message: serverResponse.mensaje || 'Sesión de triage iniciada exitosamente'
        };
      } else {
        return {
          success: false,
          error: serverResponse.mensaje || 'Error al iniciar la sesión de triage',
          message: serverResponse.mensaje || 'Error al iniciar la sesión de triage'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || error.response?.data?.error || 'Error al iniciar la sesión de triage'
      };
    }
  },

  /**
   * Enviar respuesta y obtener siguiente pregunta
   * @param {Object} respuestaData - Datos de la respuesta
   * @returns {Promise} Respuesta con la siguiente pregunta o finalización
   */
  enviarRespuesta: async (respuestaData) => {
    // Validaciones de entrada
    if (!respuestaData || !respuestaData.sesion || !respuestaData.pregunta) {
      return {
        success: false,
        error: 'Datos de respuesta incompletos',
        message: 'Los datos de la respuesta están incompletos'
      };
    }

    try {
      console.log('Enviando respuesta:', respuestaData);
      console.log('Estructura completa:', JSON.stringify(respuestaData, null, 2));
      const response = await axiosClient.post('/triage/respuesta', respuestaData);
      console.log('Respuesta del servidor:', response.data);
      
      // El servidor responde con { exito: true/false, mensaje: string, data: object }
      const serverResponse = response.data;
      
      // Verificar si la respuesta tiene la estructura esperada
      if (serverResponse && typeof serverResponse === 'object') {
        if (serverResponse.exito === true) {
          return {
            success: true,
            data: serverResponse.data,
            message: serverResponse.mensaje || 'Respuesta enviada exitosamente'
          };
        } else if (serverResponse.exito === false) {
          return {
            success: false,
            error: serverResponse.mensaje || 'Error al enviar la respuesta',
            message: serverResponse.mensaje || 'Error al enviar la respuesta'
          };
        }
      }
      
      // Si la respuesta no tiene la estructura esperada, tratarla como exitosa si el status es 2xx
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: serverResponse,
          message: 'Respuesta enviada exitosamente'
        };
      }
      
      return {
        success: false,
        error: 'Respuesta del servidor en formato inesperado',
        message: 'Error en el formato de respuesta del servidor'
      };
      
    } catch (error) {
      console.error('Error en enviarRespuesta:', error);
      console.error('Error response:', error.response?.data);
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || error.response?.data?.error || 'Error al enviar la respuesta'
      };
    }
  },

  /**
   * Obtener detalles de una sesión de triage
   * @param {string} sesionId - ID de la sesión
   * @returns {Promise} Datos de la sesión
   */
  obtenerSesion: async (sesionId) => {
    try {
      const response = await axiosClient.get(`/triage/sesiones/${sesionId}`);
      
      // El servidor responde con { exito: true/false, mensaje: string, data: object }
      const serverResponse = response.data;
      
      if (serverResponse.exito) {
        return {
          success: true,
          data: serverResponse.data,
          message: serverResponse.mensaje || 'Sesión obtenida exitosamente'
        };
      } else {
        return {
          success: false,
          error: serverResponse.mensaje || 'Error al obtener los datos de la sesión',
          message: serverResponse.mensaje || 'Error al obtener los datos de la sesión'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || error.response?.data?.error || 'Error al obtener los datos de la sesión'
      };
    }
  },

  /**
   * Recuperar una sesión de triage por ID y determinar el estado actual
   * @param {string} sesionId - ID de la sesión a recuperar
   * @returns {Promise} Estado de la sesión y siguiente pregunta
   */
  recuperarSesion: async (sesionId) => {
    // Validaciones de entrada
    if (!sesionId || typeof sesionId !== 'string') {
      return {
        success: false,
        error: 'ID de sesión requerido',
        message: 'Se requiere un ID de sesión válido'
      };
    }

    try {
      const response = await axiosClient.get(`/triage/sesiones/${sesionId}`);
      
      if (response.data) {
        const serverResponse = response.data;
        
        // Verificar si la respuesta tiene la estructura esperada
        if (serverResponse.exito) {
          const responseData = serverResponse.data;
          
          // Verificar si la sesión existe y está activa
          if (responseData.completado) {
            return {
              success: false,
              error: 'Sesión ya completada',
              message: 'Esta sesión de triage ya ha sido completada'
            };
          }

          return {
            success: true,
            data: {
              sesion: responseData.sesion,
              siguiente_pregunta: responseData.siguiente_pregunta,
              message: 'Sesión recuperada exitosamente'
            },
            message: 'Sesión recuperada exitosamente'
          };
        } else {
          return {
            success: false,
            error: serverResponse.mensaje || 'Sesión no encontrada',
            message: serverResponse.mensaje || 'No se encontró una sesión con ese ID'
          };
        }
      } else {
        return {
          success: false,
          error: 'Respuesta vacía del servidor',
          message: 'Error en la respuesta del servidor'
        };
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Manejar sesión no encontrada con mensaje específico del servidor
        const serverMessage = error.response.data?.mensaje || 'Sesión no encontrada';
        const serverError = error.response.data?.error || 'No se encontró una sesión con ese ID';
        return {
          success: false,
          error: serverError,
          message: serverMessage
        };
      }
      
      // Para otros errores, usar la respuesta del servidor si está disponible
      const serverResponse = error.response?.data;
      if (serverResponse && !serverResponse.exito) {
        return {
          success: false,
          error: serverResponse.error || serverResponse.mensaje || 'Error del servidor',
          message: serverResponse.mensaje || 'Error al recuperar la sesión'
        };
      }
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Error al recuperar la sesión'
      };
    }
  },

  /**
   * Obtener lista de todas las preguntas disponibles
   * @returns {Promise} Lista de preguntas
   */
  obtenerPreguntas: async () => {
    try {
      const response = await axiosClient.get('/triage/preguntas');
      
      // El servidor responde con { exito: true/false, mensaje: string, data: object }
      const serverResponse = response.data;
      
      if (serverResponse.exito) {
        return {
          success: true,
          data: serverResponse.data,
          message: serverResponse.mensaje || 'Preguntas obtenidas exitosamente'
        };
      } else {
        return {
          success: false,
          error: serverResponse.mensaje || 'Error al obtener las preguntas',
          message: serverResponse.mensaje || 'Error al obtener las preguntas'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || error.response?.data?.error || 'Error al obtener las preguntas'
      };
    }
  },

  /**
   * Cargar preguntas iniciales al servidor
   * @returns {Promise} Respuesta del servidor
   */
  cargarPreguntas: async () => {
    try {
      const response = await axiosClient.post('/triage/cargar-preguntas');
      
      // El servidor responde con { exito: true/false, mensaje: string }
      const serverResponse = response.data;
      
      if (serverResponse.exito) {
        return {
          success: true,
          message: serverResponse.mensaje || 'Preguntas cargadas exitosamente'
        };
      } else {
        return {
          success: false,
          error: serverResponse.mensaje || 'Error al cargar las preguntas',
          message: serverResponse.mensaje || 'Error al cargar las preguntas'
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.mensaje || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al cargar las preguntas';
      
      return {
        success: false,
        error: error.response?.data || error.message,
        message: errorMessage
      };
    }
  }
};

export default triageService;
