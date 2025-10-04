import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar múltiples modales de forma unificada
 * Evita la duplicación de estados de modales y proporciona una API consistente
 * 
 * @param {Array<string>} modalTypes - Array con los tipos de modales a manejar
 * @returns {Object} - Objeto con estados de modales y funciones de control
 */
const useModalManager = (modalTypes = ['edit', 'create', 'delete']) => {
  // Inicializar todos los modales como cerrados
  const initialModals = modalTypes.reduce((acc, type) => ({
    ...acc,
    [type]: { isOpen: false, data: null }
  }), {});

  const [modals, setModals] = useState(initialModals);

  /**
   * Abre un modal específico con datos opcionales
   * @param {string} type - Tipo de modal a abrir
   * @param {*} data - Datos asociados al modal (opcional)
   */
  const openModal = useCallback((type, data = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }));
  }, []);

  /**
   * Cierra un modal específico y limpia sus datos
   * @param {string} type - Tipo de modal a cerrar
   */
  const closeModal = useCallback((type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: null }
    }));
  }, []);

  /**
   * Verifica si un modal específico está abierto
   * @param {string} type - Tipo de modal
   * @returns {boolean} - true si el modal está abierto
   */
  const isModalOpen = useCallback((type) => {
    return modals[type]?.isOpen || false;
  }, [modals]);

  /**
   * Obtiene los datos asociados a un modal específico
   * @param {string} type - Tipo de modal
   * @returns {*} - Datos del modal o null
   */
  const getModalData = useCallback((type) => {
    return modals[type]?.data || null;
  }, [modals]);

  /**
   * Cierra todos los modales
   */
  const closeAllModals = useCallback(() => {
    const closedModals = Object.keys(modals).reduce((acc, type) => ({
      ...acc,
      [type]: { isOpen: false, data: null }
    }), {});
    setModals(closedModals);
  }, [modals]);

  /**
   * Actualiza los datos de un modal sin cambiar su estado de apertura/cierre
   * @param {string} type - Tipo de modal
   * @param {*} data - Nuevos datos
   */
  const updateModalData = useCallback((type, data) => {
    setModals(prev => ({
      ...prev,
      [type]: { ...prev[type], data }
    }));
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    isModalOpen,
    getModalData,
    closeAllModals,
    updateModalData
  };
};

export default useModalManager;