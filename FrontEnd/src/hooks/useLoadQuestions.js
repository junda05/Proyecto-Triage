import { useState } from 'react';
import triageService from '../services/api/triageService';

/**
 * Hook personalizado para manejar la carga de preguntas al servidor
 * @returns {Object} Estado y funciones para cargar preguntas
 */
const useLoadQuestions = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Cargar preguntas al servidor
   * @param {Object} callbacks - Callbacks para éxito y error
   * @param {Function} callbacks.onSuccess - Callback de éxito
   * @param {Function} callbacks.onError - Callback de error
   * @returns {Promise<boolean>} - true si fue exitoso, false en caso contrario
   */
  const cargarPreguntas = async ({ onSuccess, onError } = {}) => {
    setLoading(true);
    
    try {
      const response = await triageService.cargarPreguntas();
      
      if (response.success) {
        if (onSuccess) {
          onSuccess(response.message);
        }
        return true;
      } else {
        if (onError) {
          onError(response.message || response.error);
        }
        return false;
      }
    } catch (error) {
      const errorMessage = error.message || 'Error inesperado al cargar preguntas';
      if (onError) {
        onError(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    cargarPreguntas
  };
};

export default useLoadQuestions;