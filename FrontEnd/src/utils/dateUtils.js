/**
 * Utilidades para manejo de fechas comunes en el proyecto
 * Evita duplicación de código en componentes que manejan fechas
 */

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD para inputs de tipo date
 * @returns {string} Fecha actual en formato ISO (YYYY-MM-DD)
 */
export const getCurrentDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Convierte una fecha a string en formato YYYY-MM-DD
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO (YYYY-MM-DD)
 */
export const getDateString = (date) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
};

/**
 * Obtiene el primer día del mes actual en formato YYYY-MM-DD
 * @returns {string} Primer día del mes actual
 */
export const getFirstDayOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

/**
 * Obtiene el último día del mes actual en formato YYYY-MM-DD
 * @returns {string} Último día del mes actual
 */
export const getLastDayOfCurrentMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
};

/**
 * Valida si una fecha está en el pasado o es hoy (no futuro)
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {boolean} True si la fecha no es futura
 */
export const isValidBirthDate = (dateString) => {
  if (!dateString) return false;
  
  const inputDate = new Date(dateString);
  const today = new Date();
  
  // Normalizar horas para comparar solo fechas
  today.setHours(23, 59, 59, 999);
  
  return inputDate <= today;
};

/**
 * Calcula la edad basada en la fecha de nacimiento
 * @param {string} birthDateString - Fecha de nacimiento en formato YYYY-MM-DD
 * @returns {number|null} Edad en años o null si la fecha no es válida
 */
export const calculateAge = (birthDateString) => {
  if (!birthDateString) return null;
  
  const birthDate = new Date(birthDateString);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 0 ? age : null;
};

/**
 * Formatea una fecha para mostrar en la interfaz
 * @param {string|Date} date - Fecha a formatear
 * @param {object} options - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export const formatDisplayDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('es-ES', defaultOptions);
};