import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';

const UserAvatar = ({ userName = "Usuario", onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cerrarSesion } = useAuth();
  const menuRef = useRef(null);

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
                         hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleMenuItemClick('profile')}
            >
              Mi perfil
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleMenuItemClick('settings')}
            >
              Configuración
            </button>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                         hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
