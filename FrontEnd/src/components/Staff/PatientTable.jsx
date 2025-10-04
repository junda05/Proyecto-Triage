import React, { useState } from 'react';
import ESIBadge from '../ui/ESIBadge';
import StatusBadge from '../ui/StatusBadge';
import ConfirmModal from '../ui/ConfirmModal';

const PatientTable = ({ patients, onViewHistory, onStartAttention, onFinishAttention, onMarkAbandoned, actionLoading }) => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, patientId: null, patientName: '' });

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };



  const handleMarkAbandoned = (patient) => {
    setConfirmModal({
      isOpen: true,
      patientId: patient.id,
      patientName: patient.fullName || patient.name
    });
  };

  const handleConfirmAbandon = async () => {
    if (confirmModal.patientId && onMarkAbandoned) {
      await onMarkAbandoned(confirmModal.patientId);
    }
    setConfirmModal({ isOpen: false, patientId: null, patientName: '' });
  };

  const handleCloseModal = () => {
    setConfirmModal({ isOpen: false, patientId: null, patientName: '' });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1300px] w-full table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr className="border-b border-gray-200 dark:border-gray-600">
            <th className="w-16 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ESI
            </th>
            <th className="w-52 text-left py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              PACIENTE
            </th>
            <th className="w-16 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ID
            </th>
            <th className="w-24 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              EDAD/SEXO
            </th>
            <th className="w-44 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              LLEGADA
            </th>
            <th className="w-64 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              MOTIVO
            </th>
            <th className="w-28 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ESTADO
            </th>
            <th className="w-64 text-center py-4 px-4 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr 
              key={`patient-${patient.id}-${patient.sesionId}`}
              className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="py-4 px-4 text-center">
                <div className="flex justify-center">
                  <ESIBadge esiLevel={patient.esiLevel} />
                </div>
              </td>
              <td className="py-4 px-4 text-left">
                <span className="text-[0.9rem] font-regular text-gray-900 dark:text-gray-100">
                  {patient.fullName || patient.name}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-400">
                  {patient.id}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-500">
                  {patient.age} / {patient.gender}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-[0.9rem] text-gray-500 dark:text-gray-300">
                  {formatDateTime(patient.arrivalTime)}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <span 
                  className="text-[0.9rem] text-gray-700 dark:text-gray-300 max-w-xs truncate block mx-auto cursor-help" 
                  title={patient.reason}
                >
                  {patient.reason}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex justify-center">
                  <StatusBadge status={patient.status} />
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex justify-center items-center gap-2 min-h-[40px]">
                  <button
                    onClick={() => onViewHistory(patient.id)}
                    className="px-2 py-1 text-blue-700 dark:text-blue-800 bg-blue-100 dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 hover:text-blue-800 dark:hover:text-blue-900 text-xs font-medium transition-all duration-150 whitespace-nowrap border border-blue-300 dark:border-blue-400 rounded"
                  >
                    Ver historial
                  </button>
                  
                  {patient.status === 'En espera' && (
                    <>
                      <button
                        onClick={() => onStartAttention(patient.id)}
                        disabled={actionLoading === patient.id}
                        className="px-2 py-1 text-green-700 dark:text-green-800 bg-green-100 dark:bg-green-200 hover:bg-green-200 dark:hover:bg-green-300 hover:text-green-800 dark:hover:text-green-900 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-green-300 dark:border-green-400 rounded min-w-[70px]"
                      >
                        {actionLoading === patient.id ? 'Iniciando...' : 'Iniciar'}
                      </button>
                      <button
                        onClick={() => handleMarkAbandoned(patient)}
                        disabled={actionLoading === patient.id}
                        className="px-2 py-1 text-red-700 dark:text-red-800 bg-red-100 dark:bg-red-200 hover:bg-red-200 dark:hover:bg-red-300 hover:text-red-800 dark:hover:text-red-900 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-red-300 dark:border-red-400 rounded"
                      >
                        Abandono
                      </button>
                    </>
                  )}
                  
                  {patient.status === 'En atención' && (
                    <>
                      <button
                        onClick={() => onFinishAttention(patient.id)}
                        disabled={actionLoading === patient.id}
                        className="px-2 py-1 text-emerald-700 dark:text-emerald-800 bg-emerald-100 dark:bg-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-900 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-emerald-300 dark:border-emerald-400 rounded min-w-[70px]"
                      >
                        {actionLoading === patient.id ? 'Finalizando...' : 'Finalizar'}
                      </button>
                      <button
                        onClick={() => handleMarkAbandoned(patient)}
                        disabled={actionLoading === patient.id}
                        className="px-2 py-1 text-red-700 dark:text-red-800 bg-red-100 dark:bg-red-200 hover:bg-red-200 dark:hover:bg-red-300 hover:text-red-800 dark:hover:text-red-900 text-xs font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border border-red-300 dark:border-red-400 rounded"
                      >
                        Abandono
                      </button>
                    </>
                  )}

                  {(patient.status === 'Atendido' || patient.status === 'Abandono') && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                      Sin acciones
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Confirmar abandono"
        message={`¿Está seguro de marcar a ${confirmModal.patientName} como abandonado? Esta acción no se puede deshacer.`}
        confirmText="Marcar como abandonado"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmAbandon}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PatientTable;
