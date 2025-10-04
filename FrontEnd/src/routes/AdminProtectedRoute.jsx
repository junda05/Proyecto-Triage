import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * Componente de ruta protegida para administradores
 * Solo permite el acceso a usuarios autenticados con rol de administrador
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a proteger
 * @param {string} props.redirectTo - Ruta de redirección si no tiene permisos
 */
const AdminProtectedRoute = ({ children, redirectTo = '/staff/dashboard' }) => {
  const { autenticado, inicializando, usuario } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se inicializa la autenticación
  if (inicializando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!autenticado) {
    return <Navigate to="/staff/login" state={{ from: location }} replace />;
  }

  // Si no es administrador, redirigir al dashboard normal
  if (usuario?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 
                          bg-red-100 dark:bg-red-900/40 rounded-full">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No tienes permisos de administrador para acceder a esta sección.
            </p>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                       text-white text-sm font-medium rounded-md transition-colors duration-200"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si está autenticado y es admin, mostrar el contenido
  return children;
};

export default AdminProtectedRoute;