import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import Dropdown from '../ui/Dropdown';
import ChangeIndicator from '../ui/ChangeIndicator';
import { EditIcon } from '../icons/Icons';
import useFormChanges from '../../hooks/useFormChanges';
import useDropdownOptions from '../../hooks/useDropdownOptions';
import { useUserFormValidation } from '../../utils/userValidators';
import { 
  getFullName
} from '../../utils/userFormatUtils';

const UserEditModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  user, 
  loading = false
}) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    second_surname: '',
    username: '',
    email: '',
    phone_prefix: '',
    phone: '',
    role: 'estandar',
    is_active: true
  });

  const [formErrors, setFormErrors] = useState({});
  
  // Ref para mantener referencia al usuario actual y evitar reinicios innecesarios
  const currentUserRef = useRef(null);
  
  // Hook para detectar cambios inteligentemente
  const {
    hasChanges,
    getOptimizedData,
    initializeData,
    updateCurrentData,
    getChangesSummary
  } = useFormChanges();

  // Opciones para los dropdowns usando hook centralizado
  const { roleOptions, statusOptions, prefixOptions } = useDropdownOptions();

  // Hook de validación centralizada
  const { validate, hasErrors } = useUserFormValidation(formData, false);

  // Obtener resumen de cambios para el indicador
  const changesSummary = getChangesSummary();

  // Función auxiliar para inicializar el formulario
  const initializeForm = useCallback((userData) => {
    if (!userData?.first_name || !userData?.last_name || !userData?.username || !userData?.email) {
      console.error('Datos de usuario incompletos:', userData);
      return false;
    }

    const initialFormData = {
      first_name: userData.first_name,
      middle_name: userData.middle_name || '',
      last_name: userData.last_name,
      second_surname: userData.second_surname || '',
      username: userData.username,
      email: userData.email,
      phone_prefix: userData.phone_prefix,
      phone: userData.phone,
      role: userData.role,
      is_active: userData.is_active !== undefined ? userData.is_active : true
    };
    
    setFormData(initialFormData);
    setFormErrors({});
    initializeData(initialFormData);
    currentUserRef.current = userData;
    return true;
  }, [initializeData]);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      // Solo reinicializar si es un usuario diferente o si es la primera vez que se abre
      const isDifferentUser = !currentUserRef.current || currentUserRef.current.id !== user.id;
      
      if (isDifferentUser) {
        initializeForm(user);
      }
    } else if (!isOpen) {
      // Limpiar la referencia cuando se cierra el modal
      currentUserRef.current = null;
    }
  }, [isOpen, user, initializeForm, initializeData]); // Incluir initializeForm

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Prevenir propagación para evitar interferencias
    e.stopPropagation();
    
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    
    // Actualizar datos actuales para detección de cambios
    updateCurrentData(updatedFormData);
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manejar cambios en dropdowns
  const handleDropdownChange = (field, value) => {
    // Para el campo is_active, asegurarse de que el valor sea boolean
    const processedValue = field === 'is_active' ? (value === true || value === 'true') : value;
    const updatedFormData = {
      ...formData,
      [field]: processedValue
    };
    
    setFormData(updatedFormData);
    
    // Actualizar datos actuales para detección de cambios
    updateCurrentData(updatedFormData);
    
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usar validación centralizada
    const errors = validate();
    if (hasErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    // Verificar si hay cambios antes de enviar
    const optimizedData = getOptimizedData();
    
    if (!optimizedData) {
      console.info('No se detectaron cambios, cerrando modal sin actualizar');
      onClose();
      return;
    }

    try {
      // Enviar solo los campos modificados
      await onSave(optimizedData);
    } catch (error) {
      // En caso de error, no cerrar el modal ni restaurar datos
      // El error se maneja en el componente padre
      console.error('Error al guardar cambios:', error);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (loading) return; // No permitir cerrar si está cargando
    
    // Limpiar la referencia del usuario actual
    currentUserRef.current = null;
    
    onClose();
  };

  // Manejar clic en el overlay (fondo del modal)
  const handleOverlayClick = (e) => {
    // Solo cerrar si se hizo clic directamente en el overlay (no en el contenido del modal)
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-primary dark:text-blue-400 flex items-center">
                <EditIcon className="h-6 w-6 mr-3 text-primary dark:text-blue-400" />
                Editar Usuario
              </h3>
              {user && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-9">
                  Modificando datos de: <span className="font-medium text-gray-900 dark:text-gray-100">{getFullName(user)}</span>
                </p>
              )}
            </div>
            
            {/* Indicador de cambios */}
            <ChangeIndicator 
              hasChanges={hasChanges}
              changedFieldsCount={changesSummary.changedFieldsCount}
              showDetails={true}
            />
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombres */}
            <FormInput
              id="first_name"
              name="first_name"
              label="Primer Nombre"
              value={formData.first_name}
              onChange={handleInputChange}
              error={formErrors.first_name}
              required
              disabled={loading}
            />

            <FormInput
              id="middle_name"
              name="middle_name"
              label="Segundo Nombre"
              value={formData.middle_name}
              onChange={handleInputChange}
              error={formErrors.middle_name}
              disabled={loading}
            />

            <FormInput
              id="last_name"
              name="last_name"
              label="Primer Apellido"
              value={formData.last_name}
              onChange={handleInputChange}
              error={formErrors.last_name}
              required
              disabled={loading}
            />

            <FormInput
              id="second_surname"
              name="second_surname"
              label="Segundo Apellido"
              value={formData.second_surname}
              onChange={handleInputChange}
              error={formErrors.second_surname}
              disabled={loading}
            />

            {/* Usuario y Email */}
            <FormInput
              id="username"
              name="username"
              label="Usuario"
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              required
              disabled={true} // Usuario no debe ser editable
              title="El nombre de usuario no puede ser modificado"
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
              disabled={loading}
            />

            {/* Teléfono - PREFIJO Y NÚMERO EN LA MISMA FILA */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Dropdown
                    id="phone_prefix"
                    label="Prefijo Telefónico"
                    value={formData.phone_prefix}
                    onChange={(e) => handleDropdownChange('phone_prefix', e.target.value)}
                    options={prefixOptions}
                    disabled={loading}
                    required
                  />
                  {formErrors.phone_prefix && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.phone_prefix}</p>
                  )}
                </div>

                <div>
                  <FormInput
                    id="phone"
                    name="phone"
                    label="Número de Teléfono"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={formErrors.phone}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Rol y Estado */}
            <div>
              <Dropdown
                id="role"
                label="Rol"
                value={formData.role}
                onChange={(e) => handleDropdownChange('role', e.target.value)}
                options={roleOptions}
                disabled={loading}
                required
              />
              {formErrors.role && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.role}</p>
              )}
            </div>

            <div>
              <Dropdown
                id="is_active"
                label="Estado"
                value={formData.is_active}
                onChange={(e) => handleDropdownChange('is_active', e.target.value)}
                options={statusOptions}
                disabled={loading}
                required
              />
              {formErrors.is_active && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.is_active}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <Button
              type="button"
              onClick={handleClose}
              variant="secondary"
              disabled={loading}
              className="px-6 py-2 min-w-[120px] text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !hasChanges}
              className={`px-6 py-2 min-w-[160px] text-sm transition-all duration-200 ${
                hasChanges 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                  : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
              }`}
              title={!hasChanges ? 'No hay cambios para guardar' : undefined}
            >
              {loading ? 'Guardando...' : hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;