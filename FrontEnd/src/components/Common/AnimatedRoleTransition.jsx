import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleCard from '../ui/RoleCard';

const AnimatedRoleTransition = ({ roles, onRoleSelect }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const handleRoleClick = (roleId) => {
    if (roleId === 'staff') {
      setSelectedRole(roleId);
      setIsExpanding(true);
      
      // Navegar a la ruta de login después de la animación de expansión
      setTimeout(() => {
        navigate('/staff/login');
      }, 800);
    } else {
      // Para paciente, comportamiento normal
      onRoleSelect(roleId);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full"
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
        isExpanding ? 'scale-110 opacity-30 blur-sm' : 'scale-100 opacity-100'
      }`}>
        {roles.map((role, index) => (
          <div
            key={role.id}
            data-role={role.id}
            className={`transform transition-all duration-500 animate-fadeInUp ${
              isExpanding && role.id === 'staff' 
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
              Preparando acceso...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedRoleTransition;
