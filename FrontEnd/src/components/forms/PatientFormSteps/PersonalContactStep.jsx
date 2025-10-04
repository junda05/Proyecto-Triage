import React, { useMemo } from 'react';
import FormInput from '../../ui/FormInput';
import Dropdown from '../../ui/Dropdown';
import SectionDescription from '../../ui/SectionDescription';
import { DOC_CHOICES, SEX_CHOICES, PREFIJOS_TELEFONICOS } from '../../../services/utils/pacienteChoices';
import { getCurrentDateString } from '../../../utils/dateUtils';

const PersonalContactStep = ({ formData, onChange, onDropdownChange, errors }) => {
  // Ensure all dropdown values are strings to prevent controlled/uncontrolled warnings
  const safeFormData = {
    ...formData,
    sexo: formData.sexo || '',
    tipo_documento: formData.tipo_documento || '',
    prefijo_telefonico: formData.prefijo_telefonico || '+57'
  };

  // Calcular la edad basada en la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Filtrar opciones de documento basado en la edad
  const opcionesDocumentoFiltradas = useMemo(() => {
    const edad = calcularEdad(formData.fecha_nacimiento);
    
    if (edad !== null && edad >= 18) {
      // Para mayores de edad, excluir TI y RC
      return DOC_CHOICES.filter(option => 
        option.value !== 'TI' && option.value !== 'RC'
      );
    } else if (edad !== null && edad < 18) {
      // Para menores de edad, excluir CC y PS (Pasaporte)
      return DOC_CHOICES.filter(option => 
        option.value !== 'CC' && option.value !== 'PS'
      );
    }
    
    // Para sin fecha, mostrar todas las opciones
    return DOC_CHOICES;
  }, [formData.fecha_nacimiento]);

  // Verificar si el tipo de documento actual es inválido para la edad
  const tipoDocumentoInvalido = useMemo(() => {
    const edad = calcularEdad(formData.fecha_nacimiento);
    if (edad !== null && formData.tipo_documento) {
      if (edad >= 18) {
        // Mayores de edad no pueden usar TI o RC
        return formData.tipo_documento === 'TI' || formData.tipo_documento === 'RC';
      } else if (edad < 18) {
        // Menores de edad no pueden usar CC o PS
        return formData.tipo_documento === 'CC' || formData.tipo_documento === 'PS';
      }
    }
    return false;
  }, [formData.fecha_nacimiento, formData.tipo_documento]);

  // Función personalizada para manejar cambio de fecha que también limpia el tipo de documento si es necesario
  const handleFechaChange = (e) => {
    const nuevaFecha = e.target.value;
    const nuevaEdad = calcularEdad(nuevaFecha);
    
    // Si se convierte en mayor de edad y tiene TI o RC, limpiar el tipo de documento
    if (nuevaEdad >= 18 && (formData.tipo_documento === 'TI' || formData.tipo_documento === 'RC')) {
      // Limpiar tipo de documento
      const clearEvent = { target: { value: '' } };
      onDropdownChange('tipo_documento')(clearEvent);
    }
    // Si se convierte en menor de edad y tiene CC o PS, limpiar el tipo de documento
    else if (nuevaEdad < 18 && (formData.tipo_documento === 'CC' || formData.tipo_documento === 'PS')) {
      // Limpiar tipo de documento
      const clearEvent = { target: { value: '' } };
      onDropdownChange('tipo_documento')(clearEvent);
    }
    
    // Procesar el cambio de fecha normalmente
    onChange(e);
  };

  return (
    <div className="space-y-6">
      {/* Sección de Información Personal */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Información Personal
        </h3>
        <SectionDescription>
          Por favor, ingrese sus datos personales básicos. Esta información nos ayuda a identificarlo correctamente en nuestro sistema.
        </SectionDescription>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <FormInput
            id="primer_nombre"
            name="primer_nombre"
            type="text"
            label="Primer Nombre"
            value={formData.primer_nombre}
            onChange={onChange}
            error={errors.primer_nombre}
            required
          />
          
          <FormInput
            id="segundo_nombre"
            name="segundo_nombre"
            type="text"
            label="Segundo Nombre"
            value={formData.segundo_nombre}
            onChange={onChange}
          />
          
          <FormInput
            id="primer_apellido"
            name="primer_apellido"
            type="text"
            label="Primer Apellido"
            value={formData.primer_apellido}
            onChange={onChange}
            error={errors.primer_apellido}
            required
          />
          
          <FormInput
            id="segundo_apellido"
            name="segundo_apellido"
            type="text"
            label="Segundo Apellido"
            value={formData.segundo_apellido}
            onChange={onChange}
          />
          
          <FormInput
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            label="Fecha de Nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleFechaChange}
            error={errors.fecha_nacimiento}
            min="1900-01-01"
            max={getCurrentDateString()}
            required
          />
          
          <Dropdown
            id="sexo"
            value={safeFormData.sexo}
            onChange={onDropdownChange('sexo')}
            options={SEX_CHOICES}
            label="Sexo"
            placeholder="Seleccione su sexo"
            error={errors.sexo}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Dropdown
            id="tipo_documento"
            value={safeFormData.tipo_documento}
            onChange={onDropdownChange('tipo_documento')}
            options={opcionesDocumentoFiltradas}
            label="Tipo de Documento"
            placeholder="Seleccione su tipo de documento"
            error={errors.tipo_documento || (tipoDocumentoInvalido ? 
              (calcularEdad(formData.fecha_nacimiento) >= 18 
                ? 'Las personas mayores de edad deben usar Cédula de Ciudadanía o Pasaporte'
                : 'Los menores de edad deben usar Tarjeta de Identidad o Registro Civil'
              ) : '')}
            required
          />
          
          <FormInput
            id="numero_documento"
            name="numero_documento"
            type="text"
            label="Número de Documento"
            value={formData.numero_documento}
            onChange={onChange}
            error={errors.numero_documento}
            required
          />
        </div>
      </div>

      {/* Sección de Información de Contacto */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
          Información de Contacto
        </h3>
        <SectionDescription>
          Proporcione su número de teléfono para que podamos contactarlo sobre su cita o resultados. Es importante que el número esté activo.
        </SectionDescription>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <Dropdown
            id="prefijo_telefonico"
            value={safeFormData.prefijo_telefonico}
            onChange={onDropdownChange('prefijo_telefonico')}
            options={PREFIJOS_TELEFONICOS}
            label="Código de País"
            error={errors.prefijo_telefonico}
            required
          />
          
          <div className="sm:col-span-2">
            <FormInput
              id="telefono"
              name="telefono"
              type="tel"
              label="Número de Teléfono"
              value={formData.telefono}
              onChange={onChange}
              error={errors.telefono}
              placeholder="Ejemplo: 3001234567"
              required
            />
          </div>
        </div>
      </div>

      {/* Mostrar errores especiales de validación */}
      {errors.nombre_completo_minimo && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {errors.nombre_completo_minimo}
          </p>
        </div>
      )}

      {errors.campos_duplicados_paciente && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {errors.campos_duplicados_paciente}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonalContactStep;
