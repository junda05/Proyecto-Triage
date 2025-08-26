import React from 'react';

const PageContainer = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'p-8',
  maxWidth = 'w-full'
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors duration-300',
    large: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-10 w-full text-center transition-colors duration-300',
    form: 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full transition-colors duration-300',
    loading: 'bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform scale-0 animate-pulse'
  };

  const baseClasses = variants[variant] || variants.default;
  const combinedClasses = `${baseClasses} ${padding} ${maxWidth} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default PageContainer;
