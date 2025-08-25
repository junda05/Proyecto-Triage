import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import RoleCard from '../ui/RoleCard';
import { UserIcon, ShieldIcon } from '../icons/Icons';

const WelcomeScreen = () => {
  const [showRoles, setShowRoles] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  // Configuración de roles
  const roles = [
    {
      id: 'patient',
      title: 'Paciente',
      description: 'Necesito atención médica',
      icon: <UserIcon className="h-16 w-16" />
    },
    {
      id: 'staff',
      title: 'Personal médico',
      description: 'Soy parte del personal asistencial',
      icon: <ShieldIcon className="h-16 w-16" />
    }
  ];

  const handleStartClick = () => {
    setShowRoles(true);
  };

  const handleRoleSelection = (roleId) => {
    setSelectedRole(roleId);
    
    // Esperar un momento para mostrar la selección
    setTimeout(() => {
      if (roleId === 'patient') {
        // Navegar a la página de datos básicos del paciente
        navigate('/patient/basic-data');
      } else if (roleId === 'staff') {
        // Redirigir a una página en blanco como especificasta
        navigate('/staff/dashboard');
      }
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 w-full text-center transition-colors duration-300">
        {/* Barra de progreso */}
        <ProgressBar progress={16.67} />
        
        {/* Título de bienvenida */}
        <h2 className="text-3xl font-bold text-primary dark:text-blue-400 mb-4">
          ¡Bienvenido al Pre-triaje!
        </h2>
        
        {/* Instrucción */}
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Antes de continuar, por favor selecciona tu rol.
        </p>
        
        {/* Botón de inicio */}
        {!showRoles && (
          <div className="mb-6">
            <Button
              onClick={handleStartClick}
              size="sm"
              className="transition-all duration-300 transform hover:scale-105"
            >
              Seleccionar mi rol
            </Button>
          </div>
        )}
        
        {/* Información adicional */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Tiempo estimado: <strong>3–5 minutos</strong> • Tus datos son confidenciales.
        </div>
        
        {/* Área de selección de roles */}
        {showRoles && (
          <div className="roles-container animate-fadeInUp mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role, index) => {
                return (
                  <div
                    key={role.id}
                    className="animate-fadeInUp"
                    style={{ 
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <RoleCard
                      role={role.id}
                      title={role.title}
                      description={role.description}
                      icon={role.icon}
                      onClick={handleRoleSelection}
                      isSelected={selectedRole === role.id}
                      isVisible={showRoles}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
