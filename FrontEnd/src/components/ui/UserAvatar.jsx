import React, { useState, useEffect, useRef } from 'react';
import { UsersIcon, HomeIcon, DatabaseLucide as Database, LogOutLucide as LogOut, BarChart3Lucide as BarChart3 } from '../icons/Icons';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import useLoadQuestions from '../../hooks/useLoadQuestions';

const UserAvatar = ({ 
  userName = "Usuario", 
  onMenuClick,
  mostrarExito: mostrarExitoProp,
  mostrarError: mostrarErrorProp 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cerrarSesion, usuario } = useAuth();
  const { loading, cargarPreguntas } = useLoadQuestions();
  const menuRef = useRef(null);
  
  // Usar las funciones pasadas como props o las del hook local como fallback
  const { mostrarExito: mostrarExitoLocal, mostrarError: mostrarErrorLocal } = useNotificaciones();
  const mostrarExito = mostrarExitoProp || mostrarExitoLocal;
  const mostrarError = mostrarErrorProp || mostrarErrorLocal;

  // Verificar si el usuario es administrador
  const isAdmin = usuario?.role === 'admin';

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await cerrarSesion();
    // La redirección se maneja automáticamente por las rutas protegidas
  };

  const handleMenuItemClick = (action) => {
    setIsMenuOpen(false);
    if (onMenuClick) {
      onMenuClick(action);
    }
  };

  const handleLoadQuestions = async () => {
    setIsMenuOpen(false);
    await cargarPreguntas({
      onSuccess: (message) => {
        mostrarExito(message, {
          titulo: 'Preguntas Cargadas'
        });
      },
      onError: (error) => {
        mostrarError(error, {
          titulo: 'Error al Cargar Preguntas'
        });
      }
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 
                   flex items-center justify-center text-white font-medium text-sm
                   hover:from-blue-600 hover:to-blue-500 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {getInitials(userName)}
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                       rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 
                       z-50">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 border-b 
                           border-gray-200 dark:border-gray-600">
              {userName}
            </div>
            
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => handleMenuItemClick('dashboard')}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Dashboard
            </button>

            {/* Opción de administrar usuarios - solo para admins */}
            {isAdmin && (
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                           hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                onClick={() => handleMenuItemClick('manage-users')}
              >
                <UsersIcon className="h-4 w-4 mr-2" />
                Administrar Usuarios
              </button>
            )}

            {/* Opción de Reportes - para todos los usuarios autenticados */}
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => handleMenuItemClick('reportes')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Reportes y Análisis
            </button>

            {/* Cargar Preguntas - solo para admins */}
            {isAdmin && (
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  onClick={handleLoadQuestions}
                  disabled={loading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  {loading ? 'Cargando...' : 'Cargar Preguntas'}
                </button>
            )}
            
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                         hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
