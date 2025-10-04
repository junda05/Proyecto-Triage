import React from 'react';

const SectionDescription = ({ children, className = '' }) => {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4 leading-relaxed ${className}`}>
      {children}
    </p>
  );
};

export default SectionDescription;
