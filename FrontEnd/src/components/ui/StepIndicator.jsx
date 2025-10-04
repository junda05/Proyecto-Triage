import React from 'react';
import { CheckIcon } from '../icons/Icons';

const StepIndicator = ({ steps, currentStep, completedSteps = [] }) => {
  return (
    <div className="hidden md:flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = completedSteps.includes(stepNumber);
          const isPast = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                    isCompleted || isPast
                      ? 'bg-primary text-white'
                      : isActive
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isCompleted || isPast ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`mt-1 text-xs text-center max-w-20 ${
                  isActive 
                    ? 'text-primary font-medium' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  isPast ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
