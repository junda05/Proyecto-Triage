import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/welcome-screen', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Icono de error 404 */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl font-bold text-primary/20 dark:text-blue-400/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-primary dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Contenido del error */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Página no encontrada
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Verifica la URL o regresa al inicio para continuar navegando.
          </p>
        </div>

        {/* Información adicional del sistema */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 text-blue-800 dark:text-blue-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Sistema de Triage Médico</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 text-center">
            Si necesitas ayuda, contacta al personal de recepción.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center">
          <Button 
            onClick={handleGoHome}
            className="w-full max-w-xs"
            size='md'
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
