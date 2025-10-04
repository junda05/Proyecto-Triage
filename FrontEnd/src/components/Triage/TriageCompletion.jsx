import React from 'react';
import Button from '../ui/Button';
import { CheckCircleIcon } from '../icons/Icons';
import TriageCard from './TriageCard';

const TriageCompletion = ({ 
  nivelESI, 
  onVolver, 
  pacienteNombre = 'Paciente'
}) => {

  return (
    <TriageCard>
      <div className="space-y-6 py-6">
        {/* Header con icono y título */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            ¡Evaluación Completada!
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
            {pacienteNombre}, tu evaluación de triage ha sido procesada exitosamente.
          </p>
        </div>

        {/* Mensaje descriptivo */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-5">
          <div className="space-y-3">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              ¿Qué sigue ahora?
            </h4>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-sm">
              Tu evaluación ha sido registrada y enviada al personal médico. 
              Serás atendido en la mayor brevedad posible según tu condición. 
              Por favor mantente en la sala de espera hasta ser llamado.
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900 dark:text-white">
              Recomendaciones mientras esperas:
            </h5>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Mantén tu documento de identidad a la mano</li>
              <li>• Si sientes que tu condición empeora, informa inmediatamente al personal</li>
              <li>• Sigue las indicaciones del personal médico</li>
            </ul>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-2">
          <Button
            onClick={onVolver}
            variant="primary"
            className="w-full sm:w-auto sm:min-w-[200px] mx-auto block"
          >
            Volver al Inicio
          </Button>
        </div>

      </div>
    </TriageCard>
  );
};

export default TriageCompletion;
