import axiosClient from '../../config/axios';

/**
 * Servicio para gestionar operaciones relacionadas con pacientes
 */
export const pacienteService = {
  /**
   * Crear un nuevo paciente
   * @param {Object} pacienteData - Datos del paciente
   * @returns {Promise} Respuesta de la API
   */
  crearPaciente: async (pacienteData) => {
    try {
      const response = await axiosClient.post('/pacientes/', pacienteData);
      
      // El servidor responde con { exito: true/false, mensaje: string, data: object }
      const serverResponse = response.data;
      
      if (serverResponse.exito) {
        return {
          success: true,
          data: serverResponse.data,
          message: serverResponse.mensaje || 'Paciente registrado exitosamente'
        };
      } else {
        return {
          success: false,
          error: serverResponse.mensaje || 'Error al registrar el paciente',
          message: serverResponse.mensaje || 'Error al registrar el paciente'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al registrar el paciente'
      };
    }
  },

  /**
   * Obtener lista de pacientes con filtros opcionales
   * @param {string} urlWithParams - URL con parámetros de consulta (ej: '/pacientes/?page=1&triage_completado=true')
   * @returns {Promise} Lista de pacientes
   */
  obtenerPacientes: async (urlWithParams = '/pacientes/') => {
    try {
      // Si se pasa una URL completa, usarla; sino usar la URL por defecto
      const url = urlWithParams.startsWith('/pacientes/') ? urlWithParams : `/pacientes/${urlWithParams}`;
      const response = await axiosClient.get(url);
      
      // Verificar si la respuesta tiene estructura del backend personalizada
      if (response.data.exito !== undefined) {
        return {
          success: response.data.exito,
          data: response.data.data || response.data,
          message: response.data.mensaje || 'Pacientes obtenidos exitosamente'
        };
      }
      
      // Respuesta estándar de DRF
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Error al obtener la lista de pacientes'
      };
    }
  },

  /**
   * Obtener un paciente por ID
   * @param {string|number} id - ID del paciente
   * @returns {Promise} Datos del paciente
   */
  obtenerPacientePorId: async (id) => {
    try {
      const response = await axiosClient.get(`/pacientes/${id}`);
      
      // Verificar si la respuesta tiene estructura del backend personalizada
      if (response.data.exito !== undefined) {
        return {
          success: response.data.exito,
          data: response.data.data || response.data,
          message: response.data.mensaje || 'Paciente obtenido exitosamente'
        };
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: 'Error al obtener los datos del paciente'
      };
    }
  },

  /**
   * Actualizar un paciente por ID
   * @param {string|number} id - ID del paciente
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Respuesta de la actualización
   */
  actualizarPaciente: async (id, updateData) => {
    try {
      const response = await axiosClient.patch(`/pacientes/${id}`, updateData);
      
      // Verificar si la respuesta tiene estructura del backend personalizada
      if (response.data.exito !== undefined) {
        return {
          success: response.data.exito,
          data: response.data.data || response.data,
          message: response.data.mensaje || 'Paciente actualizado exitosamente'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Paciente actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || 'Error al actualizar el paciente'
      };
    }
  },

  /**
   * Actualizar contacto de emergencia de un paciente
   * @param {string|number} pacienteId - ID del paciente
   * @param {Object} contactoData - Datos del contacto de emergencia
   * @returns {Promise} Respuesta de la actualización
   */
  actualizarContactoEmergencia: async (pacienteId, contactoData) => {
    try {
      const response = await axiosClient.patch(`/pacientes/${pacienteId}/contacto-emergencia`, contactoData);
      
      // Verificar si la respuesta tiene estructura del backend personalizada
      if (response.data.exito !== undefined) {
        return {
          success: response.data.exito,
          data: response.data.data || response.data,
          message: response.data.mensaje || 'Contacto de emergencia actualizado exitosamente'
        };
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Contacto de emergencia actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        message: error.response?.data?.mensaje || 'Error al actualizar el contacto de emergencia'
      };
    }
  }
};

export default pacienteService;
