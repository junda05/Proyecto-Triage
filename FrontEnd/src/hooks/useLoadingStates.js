import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar múltiples estados de loading de forma unificada
 * Evita la duplicación de estados de loading y proporciona una API consistente
 * 
 * @returns {Object} - Objeto con loadingStates y funciones de control
 */
const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState({});

  /**
   * Establece el estado de loading para una clave específica
   * @param {string} key - Clave única para identificar el estado de loading
   * @param {boolean} isLoading - Si está cargando o no
   * @param {*} data - Datos adicionales asociados al estado (opcional)
   */
  const setLoading = useCallback((key, isLoading, data = null) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading ? { loading: true, data } : { loading: false, data: null }
    }));
  }, []);

  /**
   * Obtiene el estado de loading para una clave específica
   * @param {string} key - Clave del estado de loading
   * @returns {Object} - { loading: boolean, data: any }
   */
  const getLoadingState = useCallback((key) => {
    return loadingStates[key] || { loading: false, data: null };
  }, [loadingStates]);

  /**
   * Verifica si una clave específica está en estado de loading
   * @param {string} key - Clave del estado de loading
   * @returns {boolean} - true si está cargando
   */
  const isLoading = useCallback((key) => {
    return loadingStates[key]?.loading || false;
  }, [loadingStates]);

  /**
   * Obtiene los datos asociados a una clave específica
   * @param {string} key - Clave del estado de loading
   * @returns {*} - Datos asociados o null
   */
  const getLoadingData = useCallback((key) => {
    return loadingStates[key]?.data || null;
  }, [loadingStates]);

  /**
   * Limpia el estado de loading para una clave específica
   * @param {string} key - Clave del estado a limpiar
   */
  const clearLoading = useCallback((key) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  /**
   * Limpia todos los estados de loading
   */
  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  return {
    loadingStates,
    setLoading,
    getLoadingState,
    isLoading,
    getLoadingData,
    clearLoading,
    clearAllLoading
  };
};

export default useLoadingStates;