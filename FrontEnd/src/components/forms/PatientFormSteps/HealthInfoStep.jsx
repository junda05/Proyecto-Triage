import React from 'react';
import Dropdown from '../../ui/Dropdown';
import SectionDescription from '../../ui/SectionDescription';
import { REGIMEN_EPS_CHOICES, EPS_CHOICES, SEGUROS_MEDICOS_CHOICES } from '../../../services/utils/pacienteChoices';

const HealthInfoStep = ({ formData, onChange, onDropdownChange, errors }) => {
  // Ensure all dropdown values are strings to prevent controlled/uncontrolled warnings
  const safeFormData = {
    ...formData,
    regimen_eps: formData.regimen_eps || '',
    eps: formData.eps || '',
    nombre_seguro_medico: formData.nombre_seguro_medico || '',
    tiene_seguro_medico: formData.tiene_seguro_medico || false
  };

  // Función personalizada para manejar el cambio de régimen EPS
  const handleRegimenChange = (event) => {
    const newRegimen = event.target.value;
    
    // Usar la función onDropdownChange para el régimen
    onDropdownChange('regimen_eps')(event);
    
    // Si no es régimen contributivo, limpiar los campos de seguro médico
    if (newRegimen !== 'REGIMEN_CONTRIBUTIVO') {
      // Simular eventos para limpiar los campos relacionados con seguro médico
      const clearSeguroEvent = { target: { name: 'tiene_seguro_medico', checked: false } };
      onChange(clearSeguroEvent);
      
      const clearNombreSeguroEvent = { target: { value: '' } };
      onDropdownChange('nombre_seguro_medico')(clearNombreSeguroEvent);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Información de Salud
        </h3>
        <SectionDescription>
          Necesitamos conocer su afiliación a EPS y seguros médicos para brindarle la mejor atención y facilitar los procesos administrativos.
        </SectionDescription>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Dropdown
          id="regimen_eps"
          value={safeFormData.regimen_eps}
          onChange={handleRegimenChange}
          options={REGIMEN_EPS_CHOICES}
          label="Régimen de EPS"
          placeholder="Seleccione su régimen"
          error={errors.regimen_eps}
          required
        />
        
        <Dropdown
          id="eps"
          value={safeFormData.eps}
          onChange={onDropdownChange('eps')}
          options={EPS_CHOICES}
          label="EPS"
          placeholder="Seleccione su EPS"
          error={errors.eps}
          required
        />
      </div>
      
      {/* Seguro Médico */}
      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="tiene_seguro_medico"
            name="tiene_seguro_medico"
            checked={safeFormData.tiene_seguro_medico}
            onChange={onChange}
            disabled={safeFormData.regimen_eps !== 'REGIMEN_CONTRIBUTIVO'}
            className={`h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ${
              safeFormData.regimen_eps !== 'REGIMEN_CONTRIBUTIVO' 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          />
          <label 
            htmlFor="tiene_seguro_medico" 
            className={`ml-2 text-sm ${
              safeFormData.regimen_eps !== 'REGIMEN_CONTRIBUTIVO'
                ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Tengo seguro médico privado
            {safeFormData.regimen_eps !== 'REGIMEN_CONTRIBUTIVO' && (
              <span className="text-xs text-gray-400 block">
                (Solo disponible para Régimen Contributivo)
              </span>
            )}
          </label>
        </div>
        
        {safeFormData.tiene_seguro_medico && (
          <Dropdown
            id="nombre_seguro_medico"
            value={safeFormData.nombre_seguro_medico}
            onChange={onDropdownChange('nombre_seguro_medico')}
            options={SEGUROS_MEDICOS_CHOICES}
            label="Nombre del Seguro Médico"
            placeholder="Seleccione su seguro"
            error={errors.nombre_seguro_medico}
          />
        )}
      </div>
    </div>
  );
};

export default HealthInfoStep;
