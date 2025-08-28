import React, { useState, useEffect, useCallback } from 'react';
import { IconoExito, IconoError, IconoAdvertencia, IconoInfo } from '../icons/Icons';
import './AlertMessage.css';

/**
 * Componente de mensajes de alerta reutilizable y completamente responsivo
 * Adaptado para el sistema de pre-triaje médico con mejoras en accesibilidad y tema oscuro
 * 
 * Características:
 * - Variants predefinidos con iconos profesionales de Lucide React
 * - Cierre automático opcional
 * - Botón de cierre funcional con mejor contraste
 * - Animaciones suaves de entrada/salida
 * - Accesibilidad completa (ARIA roles)
 * - Gestión de estado interno para auto-cierre
 * - Integrado con el sistema de colores del proyecto
 * - Completamente responsivo (se adapta a móviles y desktop)
 * - Texto con word-break para prevenir overflow
 * - Colores optimizados para tema oscuro con mejor contraste
 * - Posicionamiento centrado en móviles
 * - Efectos visuales mejorados con backdrop-blur
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
      bgColor: 'bg-green-50 dark:bg-green-950/50',
      borderColor: 'border-green-200 dark:border-green-700/60',
      textColor: 'text-green-800 dark:text-green-100',
      titleColor: 'text-green-900 dark:text-green-50',
      iconColor: 'text-green-600 dark:text-green-300',
      ComponenteIcono: IconoExito,
      ariaLabel: 'Mensaje de éxito'
    },
    error: {
      bgColor: 'bg-red-50 dark:bg-red-950/50',
      borderColor: 'border-red-200 dark:border-red-700/60',
      textColor: 'text-red-800 dark:text-red-100',
      titleColor: 'text-red-900 dark:text-red-50',
      iconColor: 'text-red-600 dark:text-red-300',
      ComponenteIcono: IconoError,
      ariaLabel: 'Mensaje de error'
    },
    warning: {
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/50',
      borderColor: 'border-yellow-200 dark:border-yellow-700/60',
      textColor: 'text-yellow-800 dark:text-yellow-100',
      titleColor: 'text-yellow-900 dark:text-yellow-50',
      iconColor: 'text-yellow-600 dark:text-yellow-300',
      ComponenteIcono: IconoAdvertencia,
      ariaLabel: 'Mensaje de advertencia'
    },
    info: {
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      borderColor: 'border-blue-200 dark:border-blue-700/60',
      textColor: 'text-blue-800 dark:text-blue-100',
      titleColor: 'text-blue-900 dark:text-blue-50',
      iconColor: 'text-blue-600 dark:text-blue-300',
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
        alert-container flex items-start p-3 sm:p-4 rounded-lg border mb-4 shadow-lg
        ${config.bgColor} ${config.borderColor}
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
        relative w-full max-w-full text-sm
        overflow-hidden mx-auto
        backdrop-blur-sm
      `}
      role="alert"
      aria-live="polite"
      aria-label={config.ariaLabel}
    >
      {mostrarIcono && (
        <div className={`mr-2 sm:mr-3 mt-0.5 flex-shrink-0 ${config.iconColor}`} aria-hidden="true">
          <ComponenteIcono tamaño="md" />
        </div>
      )}
      
      <div className="flex-1 min-w-0 overflow-hidden">
        {titulo && (
          <div className={`alert-title font-semibold mb-1 ${config.titleColor} text-sm sm:text-base`}>
            {titulo}
          </div>
        )}
        
        <div className={`alert-text-wrapper ${config.textColor} leading-5`}>
          {mensaje || children}
        </div>
      </div>
      
      {dismissible && (
        <button
          type="button"
          onClick={manejarCierre}
          className={`
            ml-1 sm:ml-2 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 
            flex items-center justify-center
            rounded-full transition-all duration-200
            ${config.iconColor}
            hover:bg-black/10 dark:hover:bg-white/20
            hover:scale-110 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current
            focus:ring-offset-transparent
          `}
          aria-label="Cerrar mensaje"
          title="Cerrar"
        >
          <span className="text-lg sm:text-xl font-bold leading-none">×</span>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;