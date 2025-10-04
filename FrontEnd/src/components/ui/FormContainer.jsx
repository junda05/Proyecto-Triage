import React from 'react';

const FormContainer = ({ 
  children, 
  className = '',
  title,
  onBack,
  backButtonProps = {},
  showBackButton = false
}) => {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 transition-colors duration-300">
          {/* Header with optional back button */}
          {(title || showBackButton) && (
            <div className="flex items-center mb-6">
              {showBackButton && onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="p-2 text-primary dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-3"
                  aria-label="Volver"
                  {...backButtonProps}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold text-primary dark:text-blue-400">
                  {title}
                </h2>
              )}
            </div>
          )}

          {/* Form content */}
          <div className={`space-y-6 ${className}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;