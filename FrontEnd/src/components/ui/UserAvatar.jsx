import React, { useState } from 'react';

const UserAvatar = ({ userName = "Usuario", onMenuClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (onMenuClick) onMenuClick();
  };

  return (
    <div className="relative">
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
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700">
              Mi perfil
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700">
              Configuración
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 
                             hover:bg-gray-100 dark:hover:bg-gray-700">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
