import { useState } from 'react';

const useMultiStepForm = (totalSteps, initialData = {}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const updateFormData = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const updateNestedFormData = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const clearErrors = (fieldNames = []) => {
    if (fieldNames.length === 0) {
      setErrors({});
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        fieldNames.forEach(field => delete newErrors[field]);
        return newErrors;
      });
    }
  };

  const setFieldErrors = (newErrors) => {
    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
  };

  const getProgress = () => {
    return (currentStep / totalSteps) * 100;
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    nextStep,
    previousStep,
    goToStep,
    updateFormData,
    updateNestedFormData,
    clearErrors,
    setFieldErrors,
    getProgress,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
};

export default useMultiStepForm;
