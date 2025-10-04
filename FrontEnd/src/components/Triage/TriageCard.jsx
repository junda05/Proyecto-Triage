import React from 'react';

/**
 * Contenedor base para los componentes de triage
 * Proporciona un diseño consistente y estandarizado
 */
const TriageCard = ({ 
  children, 
  className = '',
  maxWidth = 'max-w-3xl',
  padding = 'p-6'
}) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto min-h-[500px] ${className}`}>
      <div className={`${padding}`}>
        {children}
      </div>
    </div>
  );
};

export default TriageCard;
