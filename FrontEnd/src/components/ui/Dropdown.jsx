import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ 
  id,
  value = '', // Provide default empty string to ensure controlled input
  onChange,
  options,
  placeholder = "Seleccionar...",
  label,
  error,
  className = '',
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionSelect = (optionValue) => {
    // Crear un evento sintético para mantener compatibilidad
    const syntheticEvent = {
      target: { value: optionValue }
    };
    
    // Llamar onChange con el evento sintético
    onChange(syntheticEvent);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <button
        type="button"
        id={id}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left border rounded-xl 
          focus:ring-2 focus:outline-none 
          transition-colors duration-200 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-white
          ${error 
            ? 'border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-[#0451BC] focus:border-[#0451BC]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
          ${className}
        `}
      >
        <div className="flex justify-between items-center">
          <span>{displayValue}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionSelect(option.value)}
              className={`
                w-full text-left px-4 py-3 transition-colors duration-150
                ${value === option.value 
                  ? 'bg-[#0451BC] text-white' 
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                }
                first:rounded-t-xl last:rounded-b-xl
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
