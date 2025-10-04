/**
 * Utilidades para formatear mensajes de error del backend
 * Convierte errores técnicos en mensajes amigables para el usuario
 */

/**
 * Formatea errores de validación de formularios
 * @param {Object|string} error - Error del backend
 * @returns {string} - Mensaje formateado para el usuario
 */
export const formatearErrorValidacion = (error) => {
  if (typeof error === 'string') {
    return traducirMensajeError(error);
  }

  // Manejar errores con estructura Django REST Framework
  if (error && typeof error === 'object') {
    // Errores no específicos de campo
    if (error.non_field_errors && Array.isArray(error.non_field_errors)) {
      return error.non_field_errors
        .map(err => {
          const mensaje = typeof err === 'object' ? err.string || err.message || err : err;
          return traducirMensajeError(mensaje);
        })
        .join('. ');
    }

    // Errores de campo específicos
    const erroresCampos = [];
    Object.keys(error).forEach(campo => {
      if (Array.isArray(error[campo])) {
        const mensajesCampo = error[campo]
          .map(err => {
            const mensaje = typeof err === 'object' ? err.string || err.message || err : err;
            return traducirMensajeError(mensaje);
          });
        erroresCampos.push(`${formatearNombreCampo(campo)}: ${mensajesCampo.join(', ')}`);
      } else if (typeof error[campo] === 'string') {
        erroresCampos.push(`${formatearNombreCampo(campo)}: ${traducirMensajeError(error[campo])}`);
      }
    });

    if (erroresCampos.length > 0) {
      return erroresCampos.join('\n');
    }
  }

  return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.';
};

/**
 * Formatea nombres de campos para mostrar al usuario
 * @param {string} campo - Nombre técnico del campo
 * @returns {string} - Nombre amigable del campo
 */
const formatearNombreCampo = (campo) => {
  const mapeoNombres = {
    'valor': 'Respuesta',
    'informacion_adicional': 'Información adicional',
    'sesion': 'Sesión',
    'pregunta': 'Pregunta',
    'non_field_errors': 'Error general'
  };

  return mapeoNombres[campo] || campo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Extrae el mensaje principal de un error complejo
 * @param {Object|string} error - Error del backend
 * @returns {string} - Mensaje principal del error
 */
export const extraerMensajePrincipal = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.detail) {
    return error.detail;
  }

  return formatearErrorValidacion(error);
};

/**
 * Determina si un error es recuperable (puede reintentarse)
 * @param {Object|string} error - Error del backend
 * @returns {boolean} - Si el error es recuperable
 */
export const esErrorRecuperable = (error) => {
  if (typeof error === 'string') {
    return !error.toLowerCase().includes('fatal') && 
           !error.toLowerCase().includes('crítico');
  }

  // Errores de validación suelen ser recuperables
  if (error?.non_field_errors || error?.message) {
    return true;
  }

  // Errores de conexión son recuperables
  if (error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT') {
    return true;
  }

  return true; // Por defecto, asumir que es recuperable
};

/**
 * Obtiene sugerencias de acción basadas en el tipo de error
 * @param {Object|string} error - Error del backend
 * @returns {string[]} - Array de sugerencias
 */
export const obtenerSugerenciasAccion = (error) => {
  const sugerencias = [];

  if (typeof error === 'string') {
    if (error.toLowerCase().includes('conexión') || error.toLowerCase().includes('network')) {
      sugerencias.push('Verifica tu conexión a internet');
      sugerencias.push('Inténtalo de nuevo en unos momentos');
    }
    return sugerencias;
  }

  // Errores de validación
  if (error?.non_field_errors) {
    sugerencias.push('Verifica que tu respuesta coincida con las opciones disponibles');
    sugerencias.push('Si el problema persiste, solicita ayuda al personal');
  }

  // Errores de sesión
  if (error?.code === 'SESSION_EXPIRED') {
    sugerencias.push('Reinicia la evaluación de triage');
    sugerencias.push('Contacta al personal si el problema continúa');
  }

  // Sugerencias generales si no hay específicas
  if (sugerencias.length === 0) {
    sugerencias.push('Inténtalo de nuevo');
    sugerencias.push('Si el problema persiste, contacta al personal de recepción');
  }

  return sugerencias;
};

/**
 * Traduce mensajes de error técnicos a mensajes amigables en español
 * @param {string} mensaje - Mensaje de error técnico
 * @returns {string} - Mensaje traducido y amigable
 */
const traducirMensajeError = (mensaje) => {
  const traducciones = {
    'The fields sesion, pregunta must make a unique set.': 'Esta pregunta ya fue respondida en esta sesión.',
    'La respuesta debe ser una de las opciones válidas:': 'La respuesta debe ser una de las opciones válidas:',
    'This field may not be blank.': 'Este campo no puede estar vacío.',
    'This field is required.': 'Este campo es obligatorio.',
    'Enter a valid email address.': 'Ingresa una dirección de email válida.',
    'Ensure this field has no more than': 'Este campo no debe tener más de',
    'Ensure this field has at least': 'Este campo debe tener al menos',
    'Invalid value': 'Valor inválido',
    'User with this username already exists.': 'Ya existe un usuario con este nombre de usuario.',
    'User with this email already exists.': 'Ya existe un usuario con este email.',
    'Unable to log in with provided credentials.': 'No se pudo iniciar sesión con las credenciales proporcionadas.',
    'No active account found with the given credentials': 'No se encontró una cuenta activa con las credenciales proporcionadas',
    'Authentication credentials were not provided.': 'No se proporcionaron credenciales de autenticación.',
    'Invalid token.': 'Token inválido.',
    'Token has expired.': 'El token ha expirado.',
    // Mensajes específicos para sesiones de triage
    'No se encontró una sesión con ese ID': 'No se encontró una sesión con ese ID',
    'Sesión no encontrada': 'No se encontró una sesión con ese ID'
  };

  // Buscar traducción exacta
  if (traducciones[mensaje]) {
    return traducciones[mensaje];
  }

  // Buscar traducciones parciales
  for (const [ingles, espanol] of Object.entries(traducciones)) {
    if (mensaje.includes(ingles)) {
      return mensaje.replace(ingles, espanol);
    }
  }

  // Si no hay traducción, retornar el mensaje original
  return mensaje;
};
