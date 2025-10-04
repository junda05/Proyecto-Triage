import React from 'react';
import RoleCard from '../ui/RoleCard';
import useRoleTransition from '../../hooks/useRoleTransition';

const AnimatedRoleTransition = ({ roles, onRoleSelect }) => {
  const { isExpanding, selectedRole, handleRoleSelection } = useRoleTransition();

  const handleRoleClick = (roleId) => {
    // Llamar callback del componente padre si existe
    if (onRoleSelect) {
      onRoleSelect(roleId);
    }
    
    // Manejar la transición y navegación
    handleRoleSelection(roleId);
  };

  return (
    <div className="relative w-full">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
        isExpanding ? 'scale-110 opacity-30 blur-sm' : 'scale-100 opacity-100'
      }`}>
        {roles.map((role, index) => (
          <div
            key={role.id}
            data-role={role.id}
            className={`transform transition-all duration-500 animate-fadeInUp ${
              isExpanding && role.id === selectedRole 
                ? 'scale-125 z-10 shadow-2xl border-primary dark:border-blue-400' 
                : ''
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <RoleCard
              role={role.id}
              title={role.title}
              description={role.description}
              icon={role.icon}
              onClick={handleRoleClick}
              isSelected={selectedRole === role.id}
            />
          </div>
        ))}
      </div>
      
      {isExpanding && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform scale-0 animate-pulse">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-blue-400 mx-auto"></div>
            <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
              {selectedRole === 'staff' ? 'Preparando acceso...' : 'Cargando formulario...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedRoleTransition;
