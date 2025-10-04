import { useNavigate, useLocation } from 'react-router-dom';
import useNotificaciones from './useNotificaciones';

/**
 * Hook personalizado para manejar las acciones del menú del avatar
 * Proporciona funcionalidad reutilizable para navegación y acciones comunes
 * 
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.refetch - Función para refrescar datos (opcional)
 * @returns {Object} Objeto con la función handleMenuClick
 */
const useAvatarMenu = ({ refetch } = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mostrarExito, mostrarInfo } = useNotificaciones();

  /**
   * Manejar clics del menú del avatar
   * @param {string} action - Acción a ejecutar
   */
  const handleMenuClick = (action) => {
    switch (action) {
      case 'dashboard':
        // Si ya estamos en el dashboard, refrescar datos
        if (location.pathname === '/staff/dashboard') {
          if (refetch) {
            refetch();
            mostrarInfo('Dashboard actualizado', {
              titulo: 'Información'
            });
          } else {
            mostrarInfo('Ya estás en el dashboard', {
              titulo: 'Información'
            });
          }
        } else {
          // Navegar al dashboard
          navigate('/staff/dashboard');
        }
        break;
        
      case 'reportes':
        // Si ya estamos en reportes, refrescar datos
        if (location.pathname === '/staff/reportes') {
          if (refetch) {
            refetch();
            mostrarInfo('Reportes actualizados', {
              titulo: 'Información'
            });
          } else {
            mostrarInfo('Ya estás en la sección de reportes', {
              titulo: 'Información'
            });
          }
        } else {
          // Navegar a reportes
          navigate('/staff/reportes');
        }
        break;

      case 'manage-users':
        // Si ya estamos en administración de usuarios, refrescar datos
        if (location.pathname === '/staff/admin/users') {
          if (refetch) {
            refetch();
            mostrarExito('Lista de usuarios actualizada', {
              titulo: 'Información'
            });
          } else {
            mostrarInfo('Ya estás en administración de usuarios', {
              titulo: 'Información'
            });
          }
        } else {
          // Navegar a administración de usuarios
          navigate('/staff/admin/users');
        }
        break;
        
      default:
        break;
    }
  };

  return {
    handleMenuClick
  };
};

export default useAvatarMenu;