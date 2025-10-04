import React, { useState, useMemo, useEffect } from 'react';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import Dropdown from '../ui/Dropdown';
import { PlusIcon, EyeIcon, EyeSlashIcon } from '../icons/Icons';
import useDropdownOptions from '../../hooks/useDropdownOptions';
import { useUserFormValidation } from '../../utils/userValidators';
import { getCurrentDateString } from '../../utils/dateUtils';
import { 
  calculateAge,
  validatePasswordStrength
} from '../../utils/userFormatUtils';

// Estado inicial del formulario (constante fuera del componente)
const INITIAL_FORM_STATE = {
  first_name: '',
  middle_name: '',
  last_name: '',
  second_surname: '',
  username: '',
  email: '',
  birth_date: '',
  document_type: '',
  document_number: '',
  phone_prefix: '+57',
  phone: '',
  role: 'estandar',
  password: '',
  password_confirm: ''
};

const UserCreateModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  loading = false
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Calcular edad para filtrar opciones de documento
  const age = useMemo(() => calculateAge(formData.birth_date), [formData.birth_date]);
  
  // Opciones para los dropdowns usando hook centralizado
  const { roleOptions, prefixOptions, documentTypeOptions } = useDropdownOptions(age);
  
  // Validar fortaleza de contraseña
  const passwordStrength = useMemo(() => validatePasswordStrength(formData.password), [formData.password]);

  // Hook de validación centralizada
  const { validate, hasErrors } = useUserFormValidation(formData, true);

  // Limpiar formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setFormErrors({});
      setShowPassword(false);
      setShowPasswordConfirm(false);
    }
  }, [isOpen]);

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Manejar cambios en dropdowns
  const handleDropdownChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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

    // Preparar datos para envío
    const userData = {
      first_name: formData.first_name.trim(),
      middle_name: formData.middle_name.trim(),
      last_name: formData.last_name.trim(),
      second_surname: formData.second_surname.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      document_type: formData.document_type,
      document_number: formData.document_number.trim(),
      birth_date: formData.birth_date,
      phone_prefix: formData.phone_prefix,
      phone: formData.phone.trim(),
      role: formData.role,
      is_active: true, // Siempre activo por defecto
      password: formData.password,
      password_confirm: formData.password_confirm
    };

    try {
      await onSave(userData);
      // Si llega aquí, significa que el guardado fue exitoso
      // La limpieza se hace automáticamente cuando el modal se cierra
      // desde el componente padre, manteniendo la fluidez de la UI
    } catch (error) {
      // El error se maneja en el componente padre
      console.error('Error en envío de formulario:', error);
    }
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (!loading) {
      setFormData(INITIAL_FORM_STATE);
      setFormErrors({});
      setShowPassword(false);
      setShowPasswordConfirm(false);
      onClose();
    }
  };

  // Manejar clic en el overlay
  const handleOverlayClick = (e) => {
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
                <PlusIcon className="h-6 w-6 mr-3 text-primary dark:text-blue-400" />
                Crear Nuevo Usuario
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-9">
                Completa todos los campos para crear el usuario
              </p>
            </div>
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

            {/* Datos de acceso */}
            <FormInput
              id="username"
              name="username"
              label="Nombre de Usuario"
              value={formData.username}
              onChange={handleInputChange}
              error={formErrors.username}
              required
              disabled={loading}
            />

            <FormInput
              id="email"
              name="email"
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={formErrors.email}
              required
              disabled={loading}
            />

            {/* Fecha de nacimiento - DESPUÉS de email */}
            <FormInput
              id="birth_date"
              name="birth_date"
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birth_date}
              onChange={handleInputChange}
              error={formErrors.birth_date}
              required
              disabled={loading}
              min="1900-01-01"
              max={getCurrentDateString()}
            />

            {/* Datos de documento - EN LA MISMA FILA filtrados por edad */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Dropdown
                    id="document_type"
                    label="Tipo de Documento"
                    value={formData.document_type}
                    onChange={(e) => handleDropdownChange('document_type', e.target.value)}
                    options={documentTypeOptions}
                    disabled={loading}
                    required
                  />
                  {age > 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Edad: {age} años - Opciones filtradas según edad
                    </p>
                  )}
                  {formErrors.document_type && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.document_type}</p>
                  )}
                </div>

                <div>
                  <FormInput
                    id="document_number"
                    name="document_number"
                    label="Número de Documento"
                    value={formData.document_number}
                    onChange={handleInputChange}
                    error={formErrors.document_number}
                    required
                    disabled={loading}
                    placeholder="Ingrese número de documento"
                  />
                </div>
              </div>
            </div>

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
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
            </div>

            {/* Contraseñas con toggle y validador de fortaleza */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contraseña principal */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400
                               focus:outline-none transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 
                               hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de fortaleza */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength.color === 'red' ? 'bg-red-500' :
                              passwordStrength.color === 'orange' ? 'bg-orange-500' :
                              passwordStrength.color === 'yellow' ? 'bg-yellow-500' :
                              passwordStrength.color === 'blue' ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                          passwordStrength.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                          passwordStrength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                          passwordStrength.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordStrength.levelText}
                        </span>
                      </div>
                      
                      {/* Criterios de fortaleza */}
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className={`flex items-center gap-1 ${
                          passwordStrength.criteria.length ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          <span>{passwordStrength.criteria.length ? '✓' : '○'}</span>
                          <span>8+ caracteres</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          passwordStrength.criteria.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          <span>{passwordStrength.criteria.uppercase ? '✓' : '○'}</span>
                          <span>Mayúsculas</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          passwordStrength.criteria.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          <span>{passwordStrength.criteria.lowercase ? '✓' : '○'}</span>
                          <span>Minúsculas</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          passwordStrength.criteria.numbers ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          <span>{passwordStrength.criteria.numbers ? '✓' : '○'}</span>
                          <span>Números</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          passwordStrength.criteria.symbols ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`}>
                          <span>{passwordStrength.criteria.symbols ? '✓' : '○'}</span>
                          <span>Símbolos</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar Contraseña <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      placeholder="Repite la contraseña"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl 
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400
                               focus:outline-none transition-colors duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 
                               hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPasswordConfirm ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de coincidencia */}
                  {formData.password_confirm && formData.password && (
                    <div className="mt-2">
                      <div className={`flex items-center gap-2 text-xs ${
                        formData.password === formData.password_confirm 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        <span>{formData.password === formData.password_confirm ? '✓' : '✗'}</span>
                        <span>
                          {formData.password === formData.password_confirm 
                            ? 'Las contraseñas coinciden' 
                            : 'Las contraseñas no coinciden'}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {formErrors.password_confirm && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password_confirm}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Rol */}
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
              disabled={loading}
              className="px-6 py-2 min-w-[160px] text-sm bg-gradient-to-r from-[#0451BC] to-[#1d4ed8] 
                       hover:from-[#1d4ed8] hover:to-[#2563eb] text-white transition-all duration-200"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCreateModal;