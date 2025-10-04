import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Componente de ruta protegida
 * Solo permite el acceso a usuarios autenticados
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a proteger
 * @param {string} props.redirectTo - Ruta de redirección si no está autenticado
 */
const ProtectedRoute = ({ children, redirectTo = '/staff/login' }) => {
  const { autenticado, inicializando } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se inicializa la autenticación
  if (inicializando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!autenticado) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

export default ProtectedRoute;
