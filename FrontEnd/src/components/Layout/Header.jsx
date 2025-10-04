import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { SunIcon, MoonIcon } from '../icons/Icons';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center">
        <img 
          src={process.env.PUBLIC_URL + '/Logo1.png'} 
          alt="Logo Sistema Pre-Triaje" 
          className="h-10 w-auto object-contain mr-2"
        />
        <h1 className="ml-2 text-xl font-bold text-primary dark:text-blue-400">
          Sistema de Pre-Triage
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-colors duration-200"
          aria-label="Alternar tema"
        >
          {/* Sun Icon (visible in dark mode) */}
          <SunIcon className={`h-6 w-6 text-gray-600 dark:text-gray-300 ${isDarkMode ? 'block' : 'hidden'}`} />
          
          {/* Moon Icon (visible in light mode) */}
          <MoonIcon className={`h-6 w-6 text-gray-600 dark:text-gray-300 ${isDarkMode ? 'hidden' : 'block'}`} />
        </button>
        
        {/* Language Toggle Button */}
        <button 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-colors duration-200"
          aria-label="Cambiar idioma"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-600 dark:text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
