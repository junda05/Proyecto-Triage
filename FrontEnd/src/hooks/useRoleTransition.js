import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para manejar transiciones de selección de roles
 * Proporciona funcionalidad reutilizable para animaciones y navegación
 */
const useRoleTransition = () => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleSelection = useCallback((roleId, customDelay = 800) => {
    setSelectedRole(roleId);
    setIsExpanding(true);

    // Navegar después de la animación con delay personalizable
    setTimeout(() => {
      switch (roleId) {
        case 'staff':
          navigate('/staff/login');
          break;
        case 'patient':
          navigate('/patients/register');
          break;
        default:
          console.warn(`Rol no reconocido: ${roleId}`);
      }
      
      // Reset del estado después de la navegación
      setIsExpanding(false);
      setSelectedRole(null);
    }, customDelay);
  }, [navigate]);

  const resetTransition = useCallback(() => {
    setIsExpanding(false);
    setSelectedRole(null);
  }, []);

  return {
    isExpanding,
    selectedRole,
    handleRoleSelection,
    resetTransition
  };
};

export default useRoleTransition;
