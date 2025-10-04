/**
 * Utilidades para formateo de datos de usuario
 * Siguiendo el principio DRY para reutilización en toda la aplicación
 */

// Importar opciones centralizadas para evitar duplicación
import { DOC_CHOICES, PREFIJOS_TELEFONICOS } from '../services/utils/pacienteChoices';

/**
 * Formatear número de teléfono con prefijo
 * @param {string} prefix - Prefijo telefónico (ej: +57, +1)
 * @param {string} phone - Número de teléfono
 * @param {object} options - Opciones de formateo
 * @returns {string} Número formateado
 */
export const formatPhoneNumber = (prefix, phone, options = {}) => {
  const {
    showParentheses = true,
    fallbackText = 'No registrado',
    separator = ' '
  } = options;

  if (!phone) return fallbackText;
  if (!prefix) return phone;

  // Formatear con paréntesis por defecto
  if (showParentheses) {
    return `(${prefix})${separator}${phone}`;
  }
  
  // Formatear sin paréntesis
  return `${prefix}${separator}${phone}`;
};

/**
 * Obtener nombre completo concatenando todos los campos de nombre
 * @param {object} user - Objeto usuario con campos de nombre
 * @returns {string} Nombre completo
 */
export const getFullName = (user) => {
  if (!user) return '';
  
  const nombres = [
    user.first_name,
    user.middle_name,
    user.last_name,
    user.second_surname
  ].filter(name => name && name.trim()).join(' ');
  
  return nombres || user.username || 'Usuario';
};

/**
 * Formatear fecha y hora en formato localizado español
 * @param {string} dateString - Fecha en formato ISO string
 * @param {object} options - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export const formatDateTime = (dateString, options = {}) => {
  const {
    fallbackText = 'Nunca',
    locale = 'es-ES',
    includeTime = true
  } = options;

  if (!dateString) return fallbackText;

  try {
    const date = new Date(dateString);
    const formatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    if (includeTime) {
      formatOptions.hour = '2-digit';
      formatOptions.minute = '2-digit';
    }

    return date.toLocaleString(locale, formatOptions);
  } catch (error) {
    console.warn('Error formateando fecha:', error);
    return fallbackText;
  }
};

/**
 * Obtener configuración de badge para roles de usuario
 * @param {string} role - Rol del usuario
 * @returns {object} Configuración de estilos para el badge
 */
export const getRoleBadgeConfig = (role) => {
  const roleConfigs = {
    'admin': { 
      bg: 'bg-purple-100 dark:bg-purple-900/30', 
      text: 'text-purple-800 dark:text-purple-300',
      label: 'Administrador'
    },
    'estandar': { 
      bg: 'bg-blue-100 dark:bg-blue-900/30', 
      text: 'text-blue-800 dark:text-blue-300',
      label: 'Estándar'
    }
  };

  return roleConfigs[role] || roleConfigs['estandar'];
};

/**
 * Normalizar datos de usuario para comparaciones y validaciones
 * @param {object} userData - Datos del usuario
 * @returns {object} Datos normalizados
 */
export const normalizeUserData = (userData) => {
  const normalized = {};
  
  Object.keys(userData).forEach(key => {
    const value = userData[key];
    
    // Normalizar valores vacíos, null y undefined
    if (value === null || value === undefined) {
      normalized[key] = '';
    } else if (typeof value === 'string') {
      normalized[key] = value.trim();
    } else {
      normalized[key] = value;
    }
  });

  return normalized;
};

/**
 * Validar formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar número de teléfono básico
 * @param {string} phone - Número a validar
 * @param {object} options - Opciones de validación
 * @returns {boolean} True si es válido
 */
export const isValidPhoneNumber = (phone, options = {}) => {
  if (!phone) return false;
  
  const { minLength = 7, maxLength = 15 } = options;
  const cleanPhone = phone.replace(/\D/g, ''); // Solo números
  
  return cleanPhone.length >= minLength && cleanPhone.length <= maxLength;
};

/**
 * Obtener opciones para dropdown de tipos de documento
 * @returns {Array} Array de opciones para el dropdown
 */
export const getDocumentTypeOptions = () => [
  { value: '', label: 'Seleccionar tipo de documento' },
  ...DOC_CHOICES
];

/**
 * Obtener opciones para dropdown de prefijos telefónicos
 * @returns {Array} Array de opciones para el dropdown
 */
export const getPhonePrefixOptions = () => [
  { value: '', label: 'Seleccionar prefijo' },
  ...PREFIJOS_TELEFONICOS
];

/**
 * Obtener opciones para dropdown de roles
 * @returns {Array} Array de opciones para el dropdown
 */
export const getRoleOptions = () => [
  { value: 'estandar', label: 'Estándar' },
  { value: 'admin', label: 'Administrador' }
];

/**
 * Obtener opciones para dropdown de estados
 * @returns {Array} Array de opciones para el dropdown
 */
export const getStatusOptions = () => [
  { value: true, label: 'Activo' },
  { value: false, label: 'Inactivo' }
];

/**
 * Calcular edad basada en fecha de nacimiento
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns {number} Edad en años
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Validar fecha de nacimiento
 * @param {string} birthDate - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns {string|null} Mensaje de error o null si es válida
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) return 'La fecha de nacimiento es requerida';
  
  const birth = new Date(birthDate);
  const today = new Date();
  
  // No permitir fechas futuras
  if (birth > today) {
    return 'La fecha de nacimiento no puede ser en el futuro';
  }
  
  // No permitir fechas antes de 1900
  if (birth.getFullYear() < 1900) {
    return 'La fecha de nacimiento no puede ser anterior a 1900';
  }
  
  // No permitir edades mayores a 150 años
  const age = calculateAge(birthDate);
  if (age > 150) {
    return 'La fecha de nacimiento no es válida (edad mayor a 150 años)';
  }
  
  return null;
};

/**
 * Filtrar opciones de documento según edad (usando lógica existente)
 * @param {number} age - Edad del usuario
 * @returns {Array} Opciones de documento filtradas
 */
export const getFilteredDocumentTypeOptions = (age) => {
  const baseOptions = getDocumentTypeOptions();
  
  if (age === 0) return baseOptions; // Sin filtro si no hay edad
  
  // Usar la misma lógica que el validador existente
  // Mayores de edad (18+): Solo CC y PS
  if (age >= 18) {
    return baseOptions.filter(option => 
      option.value === '' || option.value === 'CC' || option.value === 'PS'
    );
  }
  
  // Menores de edad (<18): Solo TI y RC  
  return baseOptions.filter(option => 
    option.value === '' || option.value === 'TI' || option.value === 'RC'
  );
};

/**
 * Validar fortaleza de contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} Resultado de validación con score, nivel y criterios
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      level: 'none',
      levelText: 'Sin contraseña',
      color: 'gray',
      criteria: {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false
      }
    };
  }

  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)
  };

  const score = Object.values(criteria).filter(Boolean).length;

  let level, levelText, color;
  
  if (score <= 1) {
    level = 'weak';
    levelText = 'Muy débil';
    color = 'red';
  } else if (score === 2) {
    level = 'fair';
    levelText = 'Débil';
    color = 'orange';
  } else if (score === 3) {
    level = 'good';
    levelText = 'Buena';
    color = 'yellow';
  } else if (score === 4) {
    level = 'strong';
    levelText = 'Fuerte';
    color = 'blue';
  } else {
    level = 'excellent';
    levelText = 'Excelente';
    color = 'green';
  }

  return {
    score,
    level,
    levelText,
    color,
    criteria
  };
};