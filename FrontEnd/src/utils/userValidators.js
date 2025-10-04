import {
  validadorEmail,
  validadorUsername,
  validadorPassword,
  validadorPasswordConfirm,
  validadorNombreCompleto,
  validadorTelefono,
  validadorPrefijoTelefonico,
  validadorNumeroDocumento,
  validadorTipoDocumentoPorEdad,
  validarCamposDuplicados,
  validadoresPaciente
} from '../services/utils/validadores';

/**
 * Validadores específicos para formularios de usuario
 * Reutiliza completamente la lógica de validadores.js sin duplicación
 */

/**
 * Mapeo de campos de usuario a campos de validador de paciente
 */
const mapUserFieldsToValidatorFields = (formData) => ({
  primer_nombre: formData.first_name || '',
  segundo_nombre: formData.middle_name || '',
  primer_apellido: formData.last_name || '',
  segundo_apellido: formData.second_surname || ''
});

/**
 * Validar formulario completo de creación de usuario
 */
export const validateUserCreationForm = (formData) => {
  const errors = {};

  // Reutilizar validadores de nombres de paciente
  const mappedFields = mapUserFieldsToValidatorFields(formData);
  
  const firstNameError = validadorNombreCompleto(formData.first_name, 'primer_nombre');
  if (firstNameError) errors.first_name = firstNameError;

  const middleNameError = validadorNombreCompleto(formData.middle_name, 'segundo_nombre');
  if (middleNameError) errors.middle_name = middleNameError;

  const lastNameError = validadorNombreCompleto(formData.last_name, 'primer_apellido');
  if (lastNameError) errors.last_name = lastNameError;

  const secondSurnameError = validadorNombreCompleto(formData.second_surname, 'segundo_apellido');
  if (secondSurnameError) errors.second_surname = secondSurnameError;

  // Reutilizar validación de campos duplicados
  const duplicateFieldsError = validarCamposDuplicados(mappedFields, 'datos del usuario');
  if (duplicateFieldsError) {
    errors.duplicate_fields = duplicateFieldsError;
  }

  // Reutilizar validadores básicos
  const usernameError = validadorUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validadorEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Reutilizar validador de fecha de nacimiento de paciente
  if (validadoresPaciente?.fecha_nacimiento) {
    const birthDateError = validadoresPaciente.fecha_nacimiento(formData.birth_date);
    if (birthDateError) errors.birth_date = birthDateError;
  }

  // Reutilizar validadores de documento
  if (!formData.document_type) {
    errors.document_type = 'El tipo de documento es obligatorio';
  } else {
    const docTypeError = validadorTipoDocumentoPorEdad(formData.document_type, formData.birth_date);
    if (docTypeError) errors.document_type = docTypeError;
  }

  const docNumberError = validadorNumeroDocumento(formData.document_number);
  if (docNumberError) errors.document_number = docNumberError;

  // Reutilizar validadores de teléfono
  const prefixError = validadorPrefijoTelefonico(formData.phone_prefix);
  if (prefixError) errors.phone_prefix = prefixError;

  const phoneError = validadorTelefono(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // Reutilizar validadores de contraseña
  const passwordError = validadorPassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const passwordConfirmError = validadorPasswordConfirm(formData.password, formData.password_confirm);
  if (passwordConfirmError) errors.password_confirm = passwordConfirmError;

  // Validación específica de rol
  if (!formData.role) {
    errors.role = 'El rol es obligatorio';
  }

  return errors;
};

/**
 * Validar formulario de edición de usuario
 */
export const validateUserEditForm = (formData) => {
  const errors = {};
  const mappedFields = mapUserFieldsToValidatorFields(formData);

  // Reutilizar validadores de nombres
  const firstNameError = validadorNombreCompleto(formData.first_name, 'primer_nombre');
  if (firstNameError) errors.first_name = firstNameError;

  const middleNameError = validadorNombreCompleto(formData.middle_name, 'segundo_nombre');
  if (middleNameError) errors.middle_name = middleNameError;

  const lastNameError = validadorNombreCompleto(formData.last_name, 'primer_apellido');
  if (lastNameError) errors.last_name = lastNameError;

  const secondSurnameError = validadorNombreCompleto(formData.second_surname, 'segundo_apellido');
  if (secondSurnameError) errors.second_surname = secondSurnameError;

  // Reutilizar validación de campos duplicados
  const duplicateFieldsError = validarCamposDuplicados(mappedFields, 'datos del usuario');
  if (duplicateFieldsError) {
    errors.duplicate_fields = duplicateFieldsError;
  }

  // Reutilizar validadores básicos
  const usernameError = validadorUsername(formData.username);
  if (usernameError) errors.username = usernameError;

  const emailError = validadorEmail(formData.email);
  if (emailError) errors.email = emailError;

  // Reutilizar validadores de teléfono
  const prefixError = validadorPrefijoTelefonico(formData.phone_prefix);
  if (prefixError) errors.phone_prefix = prefixError;

  const phoneError = validadorTelefono(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // Validaciones específicas de edición
  if (!formData.role) {
    errors.role = 'El rol es obligatorio';
  }

  if (formData.is_active === null || formData.is_active === undefined) {
    errors.is_active = 'El estado es obligatorio';
  }

  return errors;
};

/**
 * Hook personalizado para validaciones de usuario
 */
export const useUserFormValidation = (formData, isCreating = false) => {
  const validate = () => {
    return isCreating 
      ? validateUserCreationForm(formData)
      : validateUserEditForm(formData);
  };

  const hasErrors = (errors) => Object.keys(errors).length > 0;

  return { validate, hasErrors };
};