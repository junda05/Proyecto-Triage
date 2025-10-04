import React from 'react';
import Button from './Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onSubmit,
  isLoading = false,
  nextButtonText = "Siguiente",
  submitButtonText = "Finalizar Registro",
  previousButtonText = "Anterior",
  disabled = false,
  showPrevious = true
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
      {showPrevious && currentStep > 1 ? (
        <Button
          type="button"
          variant="secondary"
          onClick={onPrevious}
          disabled={isLoading || disabled}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          {previousButtonText}
        </Button>
      ) : (
        <div className="w-full sm:w-auto" />
      )}
      
      {isLastStep ? (
        <Button
          type="submit"
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          {isLoading ? 'Registrando...' : submitButtonText}
        </Button>
      ) : (
        <Button
          type="button"
          variant="primary"
          onClick={onNext}
          disabled={isLoading || disabled}
          className="w-full sm:w-auto flex items-center justify-center"
        >
          {nextButtonText}
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
