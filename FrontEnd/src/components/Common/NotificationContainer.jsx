import React from 'react';
import AlertMessage from './AlertMessage';

/**
 * Contenedor de notificaciones que muestra todas las notificaciones activas
 * Posicionado de manera fija en la esquina superior derecha
 * 
 * Características:
 * - Posicionamiento fijo no intrusivo
 * - Stack de notificaciones con animaciones
 * - Auto-scroll cuando hay muchas notificaciones
 * - Responsivo para dispositivos móviles
 * - Z-index alto para estar por encima de todo
 * 
 * @param {Object} props
 * @param {Array} props.notificaciones - Array de notificaciones a mostrar
 * @param {Function} props.onClose - Función para cerrar una notificación específica
 */
const NotificationContainer = ({ notificaciones = [], onClose }) => {
  if (!notificaciones.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            className="transform transition-all duration-300 ease-out"
          >
            <AlertMessage
              type={notif.type}
              mensaje={notif.mensaje}
              titulo={notif.titulo}
              dismissible={notif.dismissible}
              autoCloseMs={0} // El auto-close se maneja en el hook
              mostrarIcono={notif.mostrarIcono !== false}
              onClose={() => onClose(notif.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
