import React from 'react';
import FormInput from '../../ui/FormInput';
import Dropdown from '../../ui/Dropdown';
import SectionDescription from '../../ui/SectionDescription';
import { PREFIJOS_TELEFONICOS, RELACION_PARENTESCO_CHOICES } from '../../../services/utils/pacienteChoices';

const EmergencyContactStep = ({ formData, onChange, onDropdownChange, errors }) => {
  // Ensure all dropdown values are strings to prevent controlled/uncontrolled warnings
  const safeContactData = {
    ...formData.contacto_emergencia,
    relacion_parentesco: formData.contacto_emergencia?.relacion_parentesco || '',
    prefijo_telefonico: formData.contacto_emergencia?.prefijo_telefonico || '+57'
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Contacto de Emergencia
        </h3>
        <SectionDescription>
          Proporcione los datos de una persona de confianza que podamos contactar en caso de emergencia. Es importante que esta persona esté disponible.
        </SectionDescription>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput
          id="contacto_emergencia_primer_nombre"
          name="contacto_emergencia.primer_nombre"
          type="text"
          label="Primer Nombre"
          value={formData.contacto_emergencia.primer_nombre}
          onChange={onChange}
          error={errors['contacto_emergencia.primer_nombre']}
          required
        />
        
        <FormInput
          id="contacto_emergencia_segundo_nombre"
          name="contacto_emergencia.segundo_nombre"
          type="text"
          label="Segundo Nombre"
          value={formData.contacto_emergencia.segundo_nombre}
          onChange={onChange}
        />
        
        <FormInput
          id="contacto_emergencia_primer_apellido"
          name="contacto_emergencia.primer_apellido"
          type="text"
          label="Primer Apellido"
          value={formData.contacto_emergencia.primer_apellido}
          onChange={onChange}
          error={errors['contacto_emergencia.primer_apellido']}
          required
        />
        
        <FormInput
          id="contacto_emergencia_segundo_apellido"
          name="contacto_emergencia.segundo_apellido"
          type="text"
          label="Segundo Apellido"
          value={formData.contacto_emergencia.segundo_apellido}
          onChange={onChange}
        />
        
        <Dropdown
          id="contacto_emergencia_relacion_parentesco"
          value={safeContactData.relacion_parentesco}
          onChange={onDropdownChange('contacto_emergencia.relacion_parentesco')}
          options={RELACION_PARENTESCO_CHOICES}
          label="Relación de Parentesco"
          placeholder="Seleccione la relación"
          error={errors['contacto_emergencia.relacion_parentesco']}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dropdown
          id="contacto_emergencia_prefijo_telefonico"
          value={safeContactData.prefijo_telefonico}
          onChange={onDropdownChange('contacto_emergencia.prefijo_telefonico')}
          options={PREFIJOS_TELEFONICOS}
          label="Código de País"
          error={errors['contacto_emergencia.prefijo_telefonico']}
          required
        />
        
        <div className="sm:col-span-2">
          <FormInput
            id="contacto_emergencia_telefono"
            name="contacto_emergencia.telefono"
            type="tel"
            label="Teléfono de Emergencia"
            value={formData.contacto_emergencia.telefono}
            onChange={onChange}
            error={errors['contacto_emergencia.telefono']}
            placeholder="Ejemplo: 3001234567"
            required
          />
        </div>
      </div>

      {/* Mostrar errores especiales de validación */}
      {errors['contacto_emergencia.nombre_completo_minimo'] && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {errors['contacto_emergencia.nombre_completo_minimo']}
          </p>
        </div>
      )}

      {errors['contacto_emergencia.campos_duplicados'] && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {errors['contacto_emergencia.campos_duplicados']}
          </p>
        </div>
      )}

      {errors['contacto_emergencia.diferencia'] && (
        <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
            {errors['contacto_emergencia.diferencia']}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyContactStep;
