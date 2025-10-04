import React from 'react';
import TriageCard from './TriageCard';

const TriageLoader = ({ 
  mensaje = 'Cargando...', 
  submensaje = null,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <TriageCard>
      <div className="text-center space-y-4 py-8">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className={`animate-spin rounded-full border-b-2 border-primary ${spinnerSize}`}></div>
        </div>
        
        {/* Mensaje principal */}
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {mensaje}
          </p>
          
          {submensaje && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {submensaje}
            </p>
          )}
        </div>

        {/* Puntos animados */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>
    </TriageCard>
  );
};

export default TriageLoader;
