import { useState, useMemo } from 'react';

/**
 * Hook personalizado para detectar cambios en formularios
 * Optimiza el rendimiento evitando actualizaciones innecesarias al backend
 */
const useFormChanges = (initialData = {}) => {
  const [originalData, setOriginalData] = useState({});
  const [currentData, setCurrentData] = useState({});
  
  /**
   * Inicializar datos originales
   */
  const initializeData = (data) => {
    const normalizedData = normalizeData(data);
    setOriginalData(normalizedData);
    setCurrentData(normalizedData);
  };

  /**
   * Normalizar datos para comparación consistente
   */
  const normalizeData = (data) => {
    const normalized = {};
    Object.keys(data).forEach(key => {
      const value = data[key];
      // Normalizar valores vacíos, null y undefined a string vacío
      if (value === null || value === undefined) {
        normalized[key] = '';
      } else if (typeof value === 'string') {
        normalized[key] = value.trim();
      } else {
        normalized[key] = value;
      }
    });
    return normalized;
  };

  /**
   * Actualizar datos actuales
   */
  const updateCurrentData = (data) => {
    setCurrentData(normalizeData(data));
  };

  /**
   * Comparar dos objetos de datos profundamente
   */
  const deepEqual = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    return keys1.every(key => {
      const val1 = obj1[key];
      const val2 = obj2[key];
      
      // Comparación especial para booleanos
      if (typeof val1 === 'boolean' || typeof val2 === 'boolean') {
        return Boolean(val1) === Boolean(val2);
      }
      
      return val1 === val2;
    });
  };

  /**
   * Detectar si hay cambios (memoizado para optimización)
   */
  const hasChanges = useMemo(() => {
    return !deepEqual(originalData, currentData);
  }, [originalData, currentData]);

  /**
   * Obtener solo los campos que han cambiado
   */
  const getChangedFields = useMemo(() => {
    const changes = {};
    const allKeys = new Set([...Object.keys(originalData), ...Object.keys(currentData)]);
    
    allKeys.forEach(key => {
      const originalValue = originalData[key];
      const currentValue = currentData[key];
      
      // Comparación especial para booleanos
      if (typeof originalValue === 'boolean' || typeof currentValue === 'boolean') {
        if (Boolean(originalValue) !== Boolean(currentValue)) {
          changes[key] = currentValue;
        }
      } else if (originalValue !== currentValue) {
        changes[key] = currentValue;
      }
    });
    
    return changes;
  }, [originalData, currentData]);

  /**
   * Obtener datos optimizados para envío (solo campos modificados)
   */
  const getOptimizedData = () => {
    if (!hasChanges) {
      return null; // No hay cambios, no enviar nada
    }
    return getChangedFields;
  };

  /**
   * Resetear estado a datos originales
   */
  const reset = () => {
    setCurrentData(originalData);
  };

  /**
   * Obtener resumen de cambios para debugging
   */
  const getChangesSummary = () => {
    const changedFields = getChangedFields;
    const fieldNames = Object.keys(changedFields);
    
    return {
      hasChanges,
      changedFieldsCount: fieldNames.length,
      changedFields: fieldNames,
      changes: changedFields
    };
  };

  return {
    hasChanges,
    getChangedFields,
    getOptimizedData,
    initializeData,
    updateCurrentData,
    reset,
    getChangesSummary,
    originalData,
    currentData
  };
};

export default useFormChanges;