import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {

  const handleClick = (e) => {
    if (onClick && !loading) {
      onClick(e);
    }
  };

  // Filtrar props que no deben pasarse al DOM
  const { loading: _, ...domProps } = props;

  const baseClasses = 'text-[0.8rem] font-semibold rounded-xl shadow-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `
      bg-[#0b63c6] hover:opacity-90 text-white 
      focus:ring-[#0b63c6] dark:focus:ring-[#0b63c6] 
      shadow-[0_6px_18px_rgba(11,99,198,0.18)]
      ${disabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-700 
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 
      focus:ring-gray-500
    `,
    outline: `
      border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700
      dark:border-gray-600 dark:hover:border-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200
      focus:ring-gray-500 dark:focus:ring-gray-400
      ${disabled || loading ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500' : 'cursor-pointer'}
    `,
    success: `
      bg-green-500 hover:bg-green-600 text-white 
      focus:ring-green-500 dark:focus:ring-green-500 
      shadow-[0_6px_18px_rgba(34,197,94,0.18)]
      ${disabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}
    `
  };

  const sizes = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-6 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...domProps}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
