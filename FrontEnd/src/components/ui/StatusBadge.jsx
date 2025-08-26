import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    'En espera': {
      color: 'bg-yellow-100 font-semibold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      text: 'En espera'
    },
    'En atención': {
      color: 'bg-blue-100 font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      text: 'En atención'
    },
    'Atendido': {
      color: 'bg-green-100 font-semibold text-green-800 dark:bg-green-900 dark:text-green-300',
      text: 'Atendido'
    }
  };

  const config = statusConfig[status] || {
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    text: status
  };

  return (
    <span className={`
      inline-flex px-2 py-1 text-xs font-medium rounded-full
      ${config.color}
    `}>
      {config.text}
    </span>
  );
};

export default StatusBadge;
