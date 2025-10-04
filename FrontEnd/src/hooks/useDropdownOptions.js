import { useMemo } from 'react';
import { 
  getPhonePrefixOptions, 
  getRoleOptions, 
  getStatusOptions,
  getDocumentTypeOptions,
  getFilteredDocumentTypeOptions
} from '../utils/userFormatUtils';

/**
 * Hook centralizado para opciones de dropdown
 * Evita re-calculations y centraliza la lógica de opciones
 */
const useDropdownOptions = (age = null) => {
  return useMemo(() => {
    const baseOptions = {
      roleOptions: getRoleOptions(),
      statusOptions: getStatusOptions(),
      prefixOptions: getPhonePrefixOptions(),
      documentTypeOptions: getDocumentTypeOptions()
    };

    // Si se proporciona edad, filtrar opciones de documento
    if (age !== null) {
      baseOptions.documentTypeOptions = getFilteredDocumentTypeOptions(age);
    }

    return baseOptions;
  }, [age]);
};

export default useDropdownOptions;