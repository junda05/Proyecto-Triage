import React from 'react';
// Importar iconos de lucide-react para notificaciones y otros componentes
import { CheckCircle, XCircle, AlertTriangle, Info, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// Icono de usuario para pacientes
export const UserIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    />
  </svg>
);

// Icono de escudo para personal médico
export const ShieldIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
    />
  </svg>
);

// Icono de check para confirmación
export const CheckIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M5 13l4 4L19 7" 
    />
  </svg>
);

// Icono de sol
export const SunIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
);

// Icono de luna
export const MoonIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
    />
  </svg>
);

// Icono de ojo (mostrar contraseña) - Lucide React
export const EyeIcon = ({ className = "h-6 w-6" }) => (
  <Eye className={className} />
);

// Icono de ojo tachado (ocultar contraseña) - Lucide React
export const EyeSlashIcon = ({ className = "h-6 w-6" }) => (
  <EyeOff className={className} />
);

// Icono de flecha izquierda - Lucide React
export const ArrowLeftIcon = ({ className = "h-6 w-6" }) => (
  <ArrowLeft className={className} />
);

// === ICONOS PARA NOTIFICACIONES (Lucide React) ===

// Icono de éxito (CheckCircle de Lucide)
export const IconoExito = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <CheckCircle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de error (XCircle de Lucide)
export const IconoError = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <XCircle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de advertencia (AlertTriangle de Lucide)
export const IconoAdvertencia = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <AlertTriangle 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};

// Icono de información (Info de Lucide)
export const IconoInfo = ({ tamaño = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };
  return (
    <Info 
      size={sizes[tamaño]} 
      className={className}
    />
  );
};
