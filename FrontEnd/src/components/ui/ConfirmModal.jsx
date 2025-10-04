import React from 'react';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar", 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  variant = "primary" // 'primary' | 'danger'
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = variant === 'danger' 
    ? 'px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white transition-colors duration-200'
    : 'px-4 py-1.5 text-sm';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-4 py-1.5 text-sm"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={confirmButtonClass}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
