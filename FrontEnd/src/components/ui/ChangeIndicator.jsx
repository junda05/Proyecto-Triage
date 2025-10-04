import React from 'react';
import { CheckCircleIcon, IconoAdvertencia } from '../icons/Icons';

/**
 * Componente para mostrar información de cambios en formularios
 * Mejora la UX mostrando qué campos han cambiado
 */
const ChangeIndicator = ({ 
  hasChanges, 
  changedFieldsCount = 0, 
  showDetails = false,
  className = ""
}) => {
  
  if (!showDetails && !hasChanges) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {hasChanges ? (
        <>
          <IconoAdvertencia className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-orange-600 dark:text-orange-400">
            {changedFieldsCount === 1 
              ? '1 campo modificado' 
              : `${changedFieldsCount} campos modificados`
            }
          </span>
        </>
      ) : (
        <>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">
            Sin cambios
          </span>
        </>
      )}
    </div>
  );
};

export default ChangeIndicator;