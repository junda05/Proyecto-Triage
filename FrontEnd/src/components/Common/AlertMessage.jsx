import React, { useState, useEffect, useCallback } from 'react';
import { IconoExito, IconoError, IconoAdvertencia, IconoInfo } from '../icons/Icons';

/**
 * Componente de mensajes de alerta reutilizable y mejorado
 * Adaptado para el sistema de pre-triaje médico
 * 
 * Características:
 * - Variants predefinidos con iconos profesionales de Lucide React
 * - Cierre automático opcional
 * - Botón de cierre funcional
 * - Animaciones suaves de entrada/salida
 * - Accesibilidad completa (ARIA roles)
 * - Gestión de estado interno para auto-cierre
 * - Integrado con el sistema de colores del proyecto
 * 
 * @param {Object} props
 * @param {string} props.type - Tipo de alerta (success, error, warning, info)
 * @param {string} props.mensaje - Texto del mensaje
 * @param {boolean} props.dismissible - Permite cerrar la alerta
 * @param {Function} props.onClose - Callback al cerrar
 * @param {string} props.titulo - Título opcional
 * @param {number} props.autoCloseMs - Milisegundos para auto-cierre (0 = no auto-cierre)
 * @param {boolean} props.mostrarIcono - Mostrar icono del tipo de alerta
 */
const AlertMessage = ({
  type = 'info',
  mensaje,
  dismissible = false,
  onClose,
  titulo,
  children,
  autoCloseMs = 0,
  mostrarIcono = true
}) => {
  const [visible, setVisible] = useState(true);

  // Mover todos los hooks antes de cualquier return condicional
  const manejarCierre = useCallback(() => {
    setVisible(false);
    // Delay para permitir la animación de salida
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  }, [onClose]);

  // Auto-cierre del mensaje
  useEffect(() => {
    if (autoCloseMs > 0) {
      const timer = setTimeout(() => {
        manejarCierre();
      }, autoCloseMs);

      return () => clearTimeout(timer);
    }
  }, [autoCloseMs, manejarCierre]);

  // Return condicional después de todos los hooks
  if (!mensaje && !children) return null;

  const configuracionTipos = {
    success: {
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-800 dark:text-green-200',
      titleColor: 'text-green-900 dark:text-green-100',
      iconColor: 'text-green-600 dark:text-green-400',
      ComponenteIcono: IconoExito,
      ariaLabel: 'Mensaje de éxito'
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-800 dark:text-red-200',
      titleColor: 'text-red-900 dark:text-red-100',
      iconColor: 'text-red-600 dark:text-red-400',
      ComponenteIcono: IconoError,
      ariaLabel: 'Mensaje de error'
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      titleColor: 'text-yellow-900 dark:text-yellow-100',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      ComponenteIcono: IconoAdvertencia,
      ariaLabel: 'Mensaje de advertencia'
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-800 dark:text-blue-200',
      titleColor: 'text-blue-900 dark:text-blue-100',
      iconColor: 'text-blue-600 dark:text-blue-400',
      ComponenteIcono: IconoInfo,
      ariaLabel: 'Mensaje informativo'
    }
  };

  const config = configuracionTipos[type] || configuracionTipos.info;
  const { ComponenteIcono } = config;

  if (!visible) return null;

  return (
    <div 
      className={`
        flex items-start p-4 rounded-lg border mb-4 shadow-sm
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
        relative max-w-full text-sm
      `}
      role="alert"
      aria-live="polite"
      aria-label={config.ariaLabel}
    >
      {mostrarIcono && (
        <div className={`mr-3 mt-0.5 flex-shrink-0 ${config.iconColor}`} aria-hidden="true">
          <ComponenteIcono tamaño="md" />
        </div>
      )}
      
      <div className="flex-1">
        {titulo && (
          <div className={`font-semibold mb-1 ${config.titleColor} text-base`}>
            {titulo}
          </div>
        )}
        
        <div className={`${config.textColor} leading-5`}>
          {mensaje || children}
        </div>
      </div>
      
      {dismissible && (
        <button
          type="button"
          onClick={manejarCierre}
          className={`
            ml-2 flex-shrink-0 w-6 h-6 flex items-center justify-center
            rounded transition-all duration-200
            ${config.iconColor}
            hover:bg-black/10 dark:hover:bg-white/10
            hover:scale-110
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
          `}
          aria-label="Cerrar mensaje"
          title="Cerrar"
        >
          <span className="text-lg font-bold">×</span>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;