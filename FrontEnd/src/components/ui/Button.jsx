import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '',
  ...props 
}) => {
  // Debug: Log de renderizado del botón
  console.log('🔘 Button renderizado:', { children, variant, size, disabled, hasOnClick: !!onClick });

  const handleClick = (e) => {
    console.log('🔘 Button clickeado:', children);
    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = 'text-[0.8rem] font-semibold rounded-xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `
      bg-[#0b63c6] hover:opacity-90 text-white 
      focus:ring-[#0b63c6] dark:focus:ring-[#0b63c6] 
      shadow-[0_6px_18px_rgba(11,99,198,0.18)]
      ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-700 
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 
      focus:ring-gray-500
    `
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
