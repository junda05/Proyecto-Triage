import React from 'react';
import Button from '../ui/Button';
import { ArrowLeftIcon } from '../icons/Icons';
import TriageCard from './TriageCard';
import { 
  extraerMensajePrincipal, 
  esErrorRecuperable, 
  obtenerSugerenciasAccion 
} from '../../utils/errorFormatter';

const TriageError = ({ 
  error, 
  onReintentar, 
  onVolver,
  loading = false 
}) => {
  
  const mensajeError = extraerMensajePrincipal(error);
  const errorEsRecuperable = esErrorRecuperable(error);
  const sugerencias = obtenerSugerenciasAccion(error);

  return (
    <TriageCard maxWidth="max-w-4xl">
      <div className="space-y-6 py-6">
        {/* Header con icono y título */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">
            Error en la Evaluación
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
            {mensajeError}
          </p>
        </div>

        {/* Sugerencias de acción */}
        {sugerencias.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
              Posibles soluciones:
            </h4>
            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
              {sugerencias.map((sugerencia, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {sugerencia}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {onReintentar && errorEsRecuperable && (
            <Button
              onClick={onReintentar}
              disabled={loading}
              className="w-full sm:w-auto sm:min-w-[140px]"
            >
              {loading ? 'Reintentando...' : 'Reintentar'}
            </Button>
          )}
          
          <Button
            onClick={onVolver}
            variant="secondary"
            className="w-full sm:w-auto sm:min-w-[140px] flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
        </div>

        {/* Información de contacto */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Si el problema persiste, por favor contacta al personal de recepción 
            para recibir asistencia directa.
          </p>
        </div>

      </div>
    </TriageCard>
  );
};

export default TriageError;
