import React from 'react';
import AlertMessage from './AlertMessage';

/**
 * Contenedor de notificaciones que muestra todas las notificaciones activas
 * Posicionado debajo del header y completamente responsivo
 * 
 * Características:
 * - Posicionamiento fijo que evita superponerse con el header
 * - Centrado horizontal en móviles, esquina superior derecha en desktop
 * - Stack de notificaciones con animaciones suaves
 * - Auto-scroll cuando hay muchas notificaciones
 * - Completamente responsivo para todos los dispositivos
 * - Z-index apropiado para estar visible sin interferir
 * - Margen seguro para evitar salirse de pantalla
 * - Mejor contraste en tema oscuro
 * 
 * @param {Object} props
 * @param {Array} props.notificaciones - Array de notificaciones a mostrar
 * @param {Function} props.onClose - Función para cerrar una notificación específica
 */
const NotificationContainer = ({ notificaciones = [], onClose }) => {
  if (!notificaciones.length) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-4 sm:transform-none sm:translate-x-0 z-40 w-full max-w-sm sm:max-w-md pointer-events-none px-4 sm:px-0">
      <div className="space-y-2 pointer-events-auto w-full">
        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            className="transform transition-all duration-300 ease-out w-full"
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
