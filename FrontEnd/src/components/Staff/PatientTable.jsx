import React from 'react';
import ESIBadge from '../ui/ESIBadge';
import StatusBadge from '../ui/StatusBadge';

const PatientTable = ({ patients, onViewHistory, onStartAttention }) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr className="border-b border-gray-200 dark:border-gray-600">
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ESI
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              PACIENTE
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              EDAD/SEXO
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              LLEGADA
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              MOTIVO
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ESTADO
            </th>
            <th className="text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr 
              key={patient.id}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="py-4 px-4">
                <ESIBadge esiLevel={patient.esiLevel} />
              </td>
              <td className="py-4 px-4">
                <span className="text-[0.9rem] font-regular text-gray-900 dark:text-gray-100">
                  {patient.name}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-400">
                  {patient.id}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-500">
                  {patient.age} / {patient.gender}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-300">
                  {formatTime(patient.arrivalTime)}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="text-[0.9rem] text-gray-700 dark:text-gray-300 max-w-xs truncate block">
                  {patient.reason}
                </span>
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={patient.status} />
              </td>
              <td className="py-4 px-4">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onViewHistory(patient.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-150"
                  >
                    Ver historial
                  </button>
                  {patient.status === 'En espera' && (
                    <button
                      onClick={() => onStartAttention(patient.id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium transition-colors duration-150"
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
