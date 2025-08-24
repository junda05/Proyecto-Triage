import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 px-6 shadow-inner transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 md:mb-0">
          © 2025 Sistema de Pre-Triaje. Todos los derechos reservados.
        </p>
        <div className="flex space-x-4">
          <button className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Términos y condiciones
          </button>
          <button className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Política de privacidad
          </button>
          <button className="text-gray-600 dark:text-gray-400 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            Ayuda
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
