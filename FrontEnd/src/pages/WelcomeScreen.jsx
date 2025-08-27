import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import PageContainer from '../components/ui/PageContainer';
import AnimatedRoleTransition from '../components/Common/AnimatedRoleTransition';
import { UserIcon, ShieldIcon } from '../components/icons/Icons';

const WelcomeScreen = () => {
  const [showRoles, setShowRoles] = useState(false);
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
    // Esperar un momento para mostrar la selección
    setTimeout(() => {
      if (roleId === 'patient') {
        // Navegar a la página de datos básicos del paciente
        navigate('/patient/basic-data');
      }
      // Para staff, la navegación se maneja en AnimatedRoleTransition
    }, 500);
  };

  return (
    <div className="w-full max-w-5xl">
      <PageContainer variant="large">
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
            <AnimatedRoleTransition 
              roles={roles}
              onRoleSelect={handleRoleSelection}
            />
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default WelcomeScreen;
