import React from 'react';

const FormInput = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  disabled = false,
  required = false,
  children, // Para elementos adicionales como botones dentro del input
  className = ''
}) => {
  const baseInputClasses = `
    w-full px-4 py-3 border rounded-xl 
    focus:ring-2 focus:outline-none 
    transition-colors duration-200 
    bg-white dark:bg-gray-700 
    text-gray-900 dark:text-white
  `;

  const errorClasses = error 
    ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400';

  const inputClasses = `${baseInputClasses} ${errorClasses} ${className}`.trim();

  return (
    <div>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
        {children}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
