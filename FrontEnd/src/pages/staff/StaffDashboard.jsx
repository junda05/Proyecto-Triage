import React, { useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import UserAvatar from '../../components/ui/UserAvatar';
import UserInfoHeader from '../../components/ui/UserInfoHeader';
import PatientFilters from '../../components/Staff/PatientFilters';
import PatientTable from '../../components/Staff/PatientTable';
import Pagination from '../../components/ui/Pagination';
import { getFullName } from '../../utils/userFormatUtils';
import useAuth from '../../hooks/useAuth';
import useStaffPatients from '../../hooks/useStaffPatients';
import useNotificaciones from '../../hooks/useNotificaciones';
import useAvatarMenu from '../../hooks/useAvatarMenu';
import NotificationContainer from '../../components/Common/NotificationContainer';

const StaffDashboard = () => {
  const { usuario } = useAuth();
  const { mostrarExito, mostrarError, mostrarInfo, notificaciones, eliminarNotificacion: cerrarNotificacion } = useNotificaciones();
  
  const {
    patients,
    loading,
    error,
    pagination,
    filters,
    statistics,
    handleFilterChange,
    handlePageChange,
    updatePatientStatus,
    refetch
  } = useStaffPatients();

  const [actionLoading, setActionLoading] = useState(null);

  // Hook reutilizable para manejar acciones del menú del avatar
  const { handleMenuClick } = useAvatarMenu({ refetch });

  const handleViewHistory = (patientId) => {
    // TODO: Implementar navegación al historial del paciente
    mostrarInfo('Funcionalidad de historial en desarrollo', {
      titulo: 'Próximamente'
    });
  };

  const handleStartAttention = async (patientId) => {
    setActionLoading(patientId);
    try {
      const result = await updatePatientStatus(patientId, 'En atención');
      if (result.success) {
        mostrarExito('Atención iniciada correctamente', {
          titulo: 'Estado actualizado'
        });
      } else {
        mostrarError(result.error || 'Error al iniciar atención', {
          titulo: 'Error'
        });
      }
    } catch (error) {
      mostrarError('Error de conexión al actualizar estado', {
        titulo: 'Error de red'
      });
      console.error('Error al iniciar atención:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinishAttention = async (patientId) => {
    setActionLoading(patientId);
    try {
      const result = await updatePatientStatus(patientId, 'Atendido');
      if (result.success) {
        mostrarExito('Paciente marcado como atendido', {
          titulo: 'Atención finalizada'
        });
      } else {
        mostrarError(result.error || 'Error al finalizar atención', {
          titulo: 'Error'
        });
      }
    } catch (error) {
      mostrarError('Error de conexión al actualizar estado', {
        titulo: 'Error de red'
      });
      console.error('Error al finalizar atención:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAbandoned = async (patientId) => {
    setActionLoading(patientId);
    try {
      const result = await updatePatientStatus(patientId, 'Abandono');
      if (result.success) {
        mostrarExito('Paciente marcado como abandonado', {
          titulo: 'Estado actualizado'
        });
      } else {
        mostrarError(result.error || 'Error al marcar abandono', {
          titulo: 'Error'
        });
      }
    } catch (error) {
      mostrarError('Error de conexión al actualizar estado', {
        titulo: 'Error de red'
      });
      console.error('Error al marcar abandono:', error);
    } finally {
      setActionLoading(null);
    }
  };



  // Obtener nombre completo del usuario para mostrar
  const nombreCompleto = getFullName(usuario) || 'Usuario';

  return (
    <>
      <NotificationContainer 
        notificaciones={notificaciones}
        onClose={cerrarNotificacion}
      />
      <div className="w-full max-w-[1400px] mx-auto">
      <PageContainer variant="form" className="!p-8">
        {/* Header del Dashboard */}
        <div className="flex justify-between items-start mb-6">
          <UserInfoHeader title="Panel de Gestión de Pacientes" />
          <UserAvatar 
            userName={nombreCompleto} 
            onMenuClick={handleMenuClick}
            mostrarExito={mostrarExito}
            mostrarError={mostrarError}
          />
        </div>

        {/* Línea separadora */}
        <div className="w-4/4 h-px bg-gray-200 dark:bg-gray-600 mb-8"></div>

        {/* Filtros */}
        <PatientFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Tabla de Pacientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden min-h-[600px] flex flex-col">
          {/* Mostrar error si existe */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </p>
              <button 
                onClick={refetch}
                className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Indicador de carga */}
          {loading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Cargando pacientes...
                </span>
              </div>
            </div>
          )}

          {/* Tabla o mensaje vacío */}
          {!loading && (
            <>
              {patients.length > 0 ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <PatientTable 
                      patients={patients}
                      onViewHistory={handleViewHistory}
                      onStartAttention={handleStartAttention}
                      onFinishAttention={handleFinishAttention}
                      onMarkAbandoned={handleMarkAbandoned}
                      actionLoading={actionLoading}
                    />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600">
                    <Pagination 
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      pageSize={pagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {error ? 'Error al cargar los datos' : 'No se encontraron pacientes con los filtros aplicados.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Pacientes</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statistics.total}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">En Espera</h3>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {statistics.enEspera}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Atendidos</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {statistics.atendidos}
            </p>
          </div>
        </div>
      </PageContainer>
      </div>
    </>
  );
};

export default StaffDashboard;
