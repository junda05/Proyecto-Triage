/**
 * Validadores personalizados para formularios
 * Alineados con las validaciones del backend Django
 */

export const validadorEmail = (email) => {
  if (!email) return 'El email es obligatorio';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Ingresa un email válido';
  return null;
};

export const validadorUsername = (username) => {
  if (!username) return 'El nombre de usuario es obligatorio';
  if (username.length < 3) return 'Mínimo 3 caracteres';
  if (username.length > 30) return 'Máximo 30 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Solo letras, números y guiones bajos';
  }
  return null;
};

export const validadorPassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 8) return 'Mínimo 8 caracteres';
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Debe contener al menos una letra minúscula';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Debe contener al menos una letra mayúscula';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Debe contener al menos un número';
  }
  return null;
};

export const validadorPasswordConfirm = (password, passwordConfirm) => {
  if (!passwordConfirm) return 'Confirma tu contraseña';
  if (password !== passwordConfirm) return 'Las contraseñas no coinciden';
  return null;
};

/**
 * Validador para nombres (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido)
 * Implementa exactamente las mismas validaciones del backend
 */
export const validadorNombreCompleto = (valor, nombreCampo) => {
  if (!valor) {
    // Solo primer_nombre y primer_apellido son obligatorios
    if (nombreCampo === 'primer_nombre' || nombreCampo === 'primer_apellido') {
      return 'Este campo es obligatorio';
    }
    return null; // segundo_nombre y segundo_apellido son opcionales
  }

  // Eliminar espacios extras y dividir en palabras
  const nombres = valor.trim().split(/\s+/).filter(nombre => nombre.length > 0);
  
  // Verificar que haya al menos una palabra
  if (nombres.length === 0) {
    return 'Este campo no puede estar vacío';
  }

  // Verificar que cada nombre tenga 1 o 2 palabras
  if (nombres.length > 2) {
    return `El campo debe contener exactamente una o dos palabras, no ${nombres.length}`;
  }

  // Verificar que cada palabra tenga al menos 2 caracteres y máximo 30
  for (const nombre of nombres) {
    if (nombre.length < 2) {
      return `La palabra '${nombre}' es demasiado corta. Debe tener al menos 2 caracteres`;
    }
    if (nombre.length > 30) {
      return `La palabra '${nombre}' es demasiado larga. Debe tener como máximo 30 caracteres`;
    }

    // Verificar que solo contenga letras, guiones y apóstrofes
    if (!nombre.replace('-', '').replace("'", '').match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)) {
      return `La palabra '${nombre}' contiene caracteres no permitidos. Solo se permiten letras, guiones y apóstrofes`;
    }
  }

  return null;
};

/**
 * Validador para teléfonos - Actualizado según backend (7-10 dígitos)
 */
export const validadorTelefono = (telefono) => {
  if (!telefono) return 'El teléfono es obligatorio';
  
  // Según el backend, debe tener entre 7 y 10 dígitos
  if (!/^\d{7,10}$/.test(telefono)) {
    return 'El número de teléfono debe tener entre 7 y 10 dígitos';
  }
  return null;
};

/**
 * Validador para prefijo telefónico
 */
export const validadorPrefijoTelefonico = (prefijo) => {
  if (!prefijo) return 'El prefijo telefónico es obligatorio';
  if (!/^\+\d+$/.test(prefijo)) {
    return 'El prefijo telefónico debe comenzar con \'+\' y tener al menos un número';
  }
  return null;
};

/**
 * Validador para número de documento
 */
export const validadorNumeroDocumento = (numeroDocumento) => {
  if (!numeroDocumento) return 'El número de documento es obligatorio';
  if (numeroDocumento.length < 8) {
    return 'El número de documento debe tener al menos 8 caracteres';
  }
  if (!/^[A-Za-z0-9]+$/.test(numeroDocumento)) {
    return 'Solo se permiten letras y números';
  }
  return null;
};

/**
 * Validador para tipo de documento basado en la edad
 */
export const validadorTipoDocumentoPorEdad = (tipoDocumento, fechaNacimiento) => {
  if (!tipoDocumento) return 'El tipo de documento es obligatorio';
  
  if (fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    // Si tiene 18 años o más, no puede usar TI o RC
    if (edad >= 18 && (tipoDocumento === 'TI' || tipoDocumento === 'RC')) {
      return 'Las personas mayores de edad deben usar Cédula de Ciudadanía o Pasaporte';
    }
    
    // Si es menor de 18 años, no puede usar CC o PS (Pasaporte)
    if (edad < 18 && (tipoDocumento === 'CC' || tipoDocumento === 'PS')) {
      return 'Los menores de edad deben usar Tarjeta de Identidad o Registro Civil';
    }
  }
  
  return null;
};

/**
 * Validador para relación de parentesco - Exacto al backend
 */
export const validadorRelacionParentesco = (relacion) => {
  if (!relacion || !relacion.trim()) {
    return 'Este campo no puede estar vacío';
  }
  
  const relacionTrim = relacion.trim();
  
  if (!relacionTrim.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
    return 'La relación de parentesco solo puede contener letras y espacios';
  }
  
  if (relacionTrim.length < 2) {
    return 'La relación de parentesco debe tener al menos 2 caracteres';
  }
  
  if (relacionTrim.length > 50) {
    return 'La relación de parentesco no puede tener más de 50 caracteres';
  }
  
  return null;
};

/**
 * Validadores para el formulario de login
 * Versión más permisiva para el proceso de autenticación
 */
export const validadoresLogin = {
  username: (username) => {
    if (!username) return 'El nombre de usuario o email es obligatorio';
    if (username.length < 2) return 'Mínimo 2 caracteres';
    if (username.length > 50) return 'Máximo 50 caracteres';
    return null;
  },
  password: (password) => {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 1) return 'La contraseña no puede estar vacía';
    return null; // En login no validamos formato, solo que exista
  }
};

/**
 * Función para validar que no haya campos duplicados dentro de los nombres de una persona
 * Exactamente como el backend
 */
export const validarCamposDuplicados = (datos, prefijo = '') => {
  const campos = {
    'primer_nombre': datos.primer_nombre || '',
    'segundo_nombre': datos.segundo_nombre || '',
    'primer_apellido': datos.primer_apellido || '',
    'segundo_apellido': datos.segundo_apellido || '',
  };

  for (const [campo1, valor1] of Object.entries(campos)) {
    for (const [campo2, valor2] of Object.entries(campos)) {
      if (campo1 === campo2) {
        continue; // No comparar el mismo campo consigo mismo
      }
      // Permitir que los dos apellidos sean iguales
      if (new Set([campo1, campo2]).size === 2 && campo1.includes('apellido') && campo2.includes('apellido')) {
        continue;
      }
      // Si son iguales y no están vacíos → error
      if (valor1 && valor2 && valor1 === valor2) {
        return `Los campos '${campo1}' y '${campo2}' no pueden contener el mismo valor: '${valor1}'${prefijo ? ` en ${prefijo}` : ''}`;
      }
    }
  }
  
  return null;
};

/**
 * Función para validar que el nombre completo tenga al menos 3 palabras
 */
export const validarNombreCompletoMinimo = (formData, tipo = 'paciente') => {
  const campos = tipo === 'paciente' 
    ? ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido']
    : ['contacto_emergencia.primer_nombre', 'contacto_emergencia.segundo_nombre', 
       'contacto_emergencia.primer_apellido', 'contacto_emergencia.segundo_apellido'];
  
  let nombreCompleto = [];
  
  for (const campo of campos) {
    const valor = tipo === 'paciente' ? formData[campo] : formData.contacto_emergencia?.[campo.split('.')[1]];
    if (valor && valor.trim()) {
      const nombres = valor.trim().split(/\s+/).filter(nombre => nombre.length > 0);
      nombreCompleto = nombreCompleto.concat(nombres);
    }
  }
  
  if (nombreCompleto.length < 3) {
    return 'El nombre completo debe tener al menos 3 palabras entre nombres y apellidos';
  }
  
  // Validar nombres duplicados
  const contadorNombres = {};
  for (const nombre of nombreCompleto) {
    contadorNombres[nombre.toLowerCase()] = (contadorNombres[nombre.toLowerCase()] || 0) + 1;
  }
  
  const nombresRepetidos = Object.entries(contadorNombres)
    .filter(([, count]) => count > 1)
    .map(([nombre]) => nombre);
  
  if (nombresRepetidos.length > 1) {
    const totalRepeticiones = Object.values(contadorNombres).reduce((acc, count) => acc + (count > 1 ? count - 1 : 0), 0);
    return `No puede tener ${totalRepeticiones} nombre(s) repetido(s). Nombres duplicados: ${nombresRepetidos.join(', ')}`;
  }
  
  return null;
};

/**
 * Función para validar que paciente y contacto de emergencia sean diferentes
 */
export const validarDiferenciaPacienteContacto = (formData) => {
  if (!formData.contacto_emergencia) return null;
  
  const contacto = formData.contacto_emergencia;
  
  // Verificar si todos los nombres son iguales
  const fieldsToCompare = ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido'];
  const allNamesMatch = fieldsToCompare.every(field => 
    formData[field] === contacto[field]
  );
  
  if (allNamesMatch) {
    return 'El contacto de emergencia no puede tener el mismo nombre completo que el paciente';
  }
  
  // Verificar si el teléfono es el mismo
  if (formData.prefijo_telefonico === contacto.prefijo_telefonico && 
      formData.telefono === contacto.telefono) {
    return 'El contacto de emergencia no puede tener el mismo número telefónico que el paciente';
  }
  
  return null;
};

/**
 * Función para validar todos los datos del paciente (incluye campos duplicados)
 */
export const validarDatosPaciente = (formData) => {
  // Validar campos duplicados dentro del paciente
  const errorCamposDuplicadosPaciente = validarCamposDuplicados(formData, 'datos del paciente');
  if (errorCamposDuplicadosPaciente) {
    return errorCamposDuplicadosPaciente;
  }
  
  return null;
};

/**
 * Función para validar todos los datos del contacto de emergencia (incluye campos duplicados)
 */
export const validarDatosContactoEmergencia = (contactoData) => {
  if (!contactoData) return null;
  
  // Validar campos duplicados dentro del contacto de emergencia
  const errorCamposDuplicados = validarCamposDuplicados(contactoData, 'contacto de emergencia');
  if (errorCamposDuplicados) {
    return errorCamposDuplicados;
  }
  
  return null;
};

/**
 * Validadores para el formulario de paciente
 */
export const validadoresPaciente = {
  primer_nombre: (valor) => validadorNombreCompleto(valor, 'primer_nombre'),
  segundo_nombre: (valor) => validadorNombreCompleto(valor, 'segundo_nombre'),
  primer_apellido: (valor) => validadorNombreCompleto(valor, 'primer_apellido'),
  segundo_apellido: (valor) => validadorNombreCompleto(valor, 'segundo_apellido'),
  fecha_nacimiento: (fecha) => {
    if (!fecha) return 'La fecha de nacimiento es obligatoria';
    const fechaNacimiento = new Date(fecha);
    const hoy = new Date();
    if (fechaNacimiento >= hoy) {
      return 'La fecha de nacimiento debe ser anterior a hoy';
    }
    // Validar que la fecha no sea anterior a 1900
    const fechaMinima = new Date('1900-01-01');
    if (fechaNacimiento < fechaMinima) {
      return 'La fecha de nacimiento no puede ser anterior al año 1900';
    }
    return null;
  },
  tipo_documento: (tipo, formData) => {
    return validadorTipoDocumentoPorEdad(tipo, formData?.fecha_nacimiento);
  },
  numero_documento: validadorNumeroDocumento,
  sexo: (sexo) => {
    if (!sexo) return 'El sexo es obligatorio';
    return null;
  },
  prefijo_telefonico: validadorPrefijoTelefonico,
  telefono: validadorTelefono,
  regimen_eps: (regimen) => {
    if (!regimen) return 'El régimen EPS es obligatorio';
    return null;
  },
  eps: (eps) => {
    if (!eps) return 'La EPS es obligatoria';
    return null;
  },
  sintomas_iniciales: (sintomas) => {
    if (!sintomas) return 'Los síntomas iniciales son obligatorios';
    if (sintomas.length < 10) return 'Describa los síntomas con más detalle (mínimo 10 caracteres)';
    return null;
  }
};

/**
 * Validadores para contacto de emergencia
 */
export const validadoresContactoEmergencia = {
  primer_nombre: (valor) => validadorNombreCompleto(valor, 'primer_nombre'),
  segundo_nombre: (valor) => validadorNombreCompleto(valor, 'segundo_nombre'),
  primer_apellido: (valor) => validadorNombreCompleto(valor, 'primer_apellido'),
  segundo_apellido: (valor) => validadorNombreCompleto(valor, 'segundo_apellido'),
  prefijo_telefonico: validadorPrefijoTelefonico,
  telefono: validadorTelefono,
  relacion_parentesco: validadorRelacionParentesco
};
