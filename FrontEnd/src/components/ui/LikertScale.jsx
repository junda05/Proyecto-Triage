import React, { useState } from 'react';
import { getSeverityIcon, getSeverityColor, getSeveritySelectedColor } from '../icons/Icons';

const LikertScale = ({ 
  min = 1, 
  max = 10, 
  value, 
  onChange, 
  labels = {},
  disabled = false,
  className = '',
  showNumbers = true,
  showLabels = true,
  error = '',
  showProgressBar = false,
  states = {}
}) => {
  const [hoveredValue, setHoveredValue] = useState(null);

  const handleClick = (scaleValue) => {
    if (!disabled && onChange) {
      onChange(scaleValue);
    }
  };

  const handleRadioChange = (scaleValue) => {
    if (!disabled && onChange) {
      onChange(parseInt(scaleValue));
    }
  };

  const getProgressBarColor = (progress) => {
    if (progress <= 30) return 'from-green-500 to-green-600';
    if (progress <= 50) return 'from-yellow-500 to-yellow-600';
    if (progress <= 70) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getProgressBarBgColor = (progress) => {
    if (progress <= 30) return 'bg-green-100';
    if (progress <= 50) return 'bg-yellow-100';
    if (progress <= 70) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getButtonStyles = (scaleValue) => {
    const isSelected = value === scaleValue;
    const isHovered = hoveredValue === scaleValue;
    
    let baseClasses = 'relative flex flex-col items-center justify-center min-w-[3rem] h-16 text-sm font-medium rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    
    if (disabled) {
      baseClasses += ' cursor-not-allowed opacity-50';
    } else {
      baseClasses += ' cursor-pointer transform hover:scale-105 active:scale-95';
    }
    
    if (isSelected) {
      baseClasses += ` ${getSeveritySelectedColor(scaleValue)}`;
    } else if (isHovered) {
      baseClasses += ` ${getSeverityColor(scaleValue)} shadow-md border-opacity-70`;
    } else {
      baseClasses += ` ${getSeverityColor(scaleValue)} hover:shadow-md`;
    }
    
    return baseClasses;
  };

  const getLabelForValue = (scaleValue) => {
    return labels[scaleValue] || '';
  };

  const generateScale = () => {
    const scale = [];
    for (let i = min; i <= max; i++) {
      scale.push(i);
    }
    return scale;
  };

  // Renderizado de la barra de progreso
  const renderProgressBar = () => {
    if (!showProgressBar || !value) return null;

    const progress = (value / max) * 100;
    
    return (
      <div className="mb-6">
        <div className={`w-full h-4 ${getProgressBarBgColor(progress)} rounded-full overflow-hidden shadow-inner`}>
          <div 
            className={`h-full bg-gradient-to-r ${getProgressBarColor(progress)} rounded-full transition-all duration-500 ease-in-out relative overflow-hidden`}
            style={{ width: `${progress}%` }}
          >
            <div 
              className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white via-transparent opacity-30"
              style={{
                animation: 'shimmer 2s infinite',
                transform: 'translateX(-100%)'
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderizado de los radio buttons
  const renderRadioButtons = () => {
    if (!showProgressBar) return null;

    return (
      <div className="space-y-4" role="radiogroup" aria-labelledby="likert-scale-label">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Seleccione su nivel de molestia:
        </div>
        
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 max-w-6xl mx-auto">
          {generateScale().map(scaleValue => {
            const isSelected = value === scaleValue;
            
            return (
              <label 
                key={scaleValue} 
                className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  isSelected 
                    ? 'border-primary bg-primary text-white shadow-md' 
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="likert-scale-radio"
                  value={scaleValue}
                  checked={isSelected}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="sr-only"
                  disabled={disabled}
                />
                
                <span className={`text-base sm:text-lg font-bold ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {scaleValue}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Barra de progreso (solo si showProgressBar es true) */}
      {renderProgressBar()}
      
      {/* Radio buttons (solo si showProgressBar es true) */}
      {showProgressBar ? renderRadioButtons() : (
        <>
          {/* Scale buttons container (implementación original) */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {generateScale().map((scaleValue) => (
              <div key={scaleValue} className="flex flex-col items-center">
                {/* Scale button */}
                <button
                  type="button"
                  onClick={() => handleClick(scaleValue)}
                  onMouseEnter={() => setHoveredValue(scaleValue)}
                  onMouseLeave={() => setHoveredValue(null)}
                  disabled={disabled}
                  className={getButtonStyles(scaleValue)}
                  aria-label={`Seleccionar valor ${scaleValue}${getLabelForValue(scaleValue) ? `: ${getLabelForValue(scaleValue)}` : ''}`}
                >
                  {/* Icono y número */}
                  <div className="flex flex-col items-center gap-1">
                    {getSeverityIcon(scaleValue, 18)}
                    {showNumbers && <span className="text-xs font-bold">{scaleValue}</span>}
                  </div>
                </button>
                
                {/* Label below button */}
                {showLabels && getLabelForValue(scaleValue) && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center max-w-[4rem] leading-tight">
                    {getLabelForValue(scaleValue)}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {/* Selected value indicator */}
          {value && (
            <div className="text-center mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Valor seleccionado: {value}
                {getLabelForValue(value) && ` (${getLabelForValue(value)})`}
              </span>
            </div>
          )}
          
          {/* Range indicators */}
          {showLabels && (
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{getLabelForValue(min) || min}</span>
              <span>{getLabelForValue(max) || max}</span>
            </div>
          )}
        </>
      )}
      
      {/* Error message */}
      {error && (
        <div className="text-red-600 text-sm text-center mt-2">
          {error}
        </div>
      )}
      
      {/* Shimmer animation styles */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default LikertScale;