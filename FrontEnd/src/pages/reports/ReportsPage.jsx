import React from 'react';
import { AlertCircleIcon as AlertCircle, BarChart3Lucide as BarChart3 } from '../../components/icons/Icons';
import { getFullName } from '../../utils/userFormatUtils';
import DateRangeFilter from '../../components/Reports/DateRangeFilter';
import ESIDistributionChart from '../../components/Reports/ESIDistributionChart';
import DemographicsChart from '../../components/Reports/DemographicsChart';
import WaitTimesChart from '../../components/Reports/WaitTimesChart';
import AttentionStatusChart from '../../components/Reports/AttentionStatusChart';
import UserAvatar from '../../components/ui/UserAvatar';
import UserInfoHeader from '../../components/ui/UserInfoHeader';
import PageContainer from '../../components/ui/PageContainer';
import useReportes from '../../hooks/useReportes';
import useAuth from '../../hooks/useAuth';
import useAvatarMenu from '../../hooks/useAvatarMenu';
import { useTheme } from '../../hooks/useTheme';
import useNotificaciones from '../../hooks/useNotificaciones';
import NotificationContainer from '../../components/Common/NotificationContainer';

const ReportsPage = () => {
  const { usuario } = useAuth();
  const { isDarkMode } = useTheme();
  const { notificaciones, eliminarNotificacion: cerrarNotificacion, mostrarExito, mostrarError } = useNotificaciones();
  const {
    reporte,
    loading,
    error,
    filtros,
    cargarReporte,
    actualizarFiltros,
    establecerRangoFechas
  } = useReportes();

  // Hook para manejar el menú del avatar
  const { handleMenuClick } = useAvatarMenu();

  const handleRangoRapido = (tipoRango) => {
    establecerRangoFechas(tipoRango);
  };

  const handleFiltrosChange = (nuevosFiltros) => {
    actualizarFiltros(nuevosFiltros);
  };

  const handleCargarReporte = async () => {
    try {
      const result = await cargarReporte();
      if (result.success) {
        const totalPacientes = result.data?.total_pacientes || 0;
        mostrarExito(`Análisis completado: ${totalPacientes} pacientes procesados`, {
          titulo: 'Reporte Generado'
        });
      } else {
        mostrarError(result.message || 'Error al generar el reporte', {
          titulo: 'Error'
        });
      }
    } catch (error) {
      mostrarError('Error inesperado', {
        titulo: 'Error del sistema'
      });
    }
  };



  // Nombre completo del usuario
  const nombreCompleto = getFullName(usuario) || 'Usuario';

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar reportes</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleCargarReporte}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <NotificationContainer 
        notificaciones={notificaciones}
        onClose={cerrarNotificacion}
      />
      <div className="w-full max-w-[1400px] mx-auto">
        <PageContainer variant="form" className="!p-4 sm:!p-6 lg:!p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <UserInfoHeader 
            title={
              <div className="flex items-center flex-wrap">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary dark:text-blue-400 flex-shrink-0" />
                <span className="text-xl sm:text-3xl">Reportes y Análisis</span>
              </div>
            }
          />
          
          <div className="flex items-center justify-end">
            {/* Avatar del usuario */}
            <UserAvatar 
              userName={nombreCompleto} 
              onMenuClick={handleMenuClick}
              mostrarExito={mostrarExito}
              mostrarError={mostrarError}
            />
          </div>
        </div>
        
        {/* Línea separadora */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-600 mt-4 sm:mt-6"></div>
      </div>

      {/* Filtros de fecha */}
      <div className="mb-6 sm:mb-8">
        <DateRangeFilter
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          onRangoRapido={handleRangoRapido}
          onGenerarReporte={handleCargarReporte}
          loading={loading}
        />
      </div>

      {/* Gráficos principales - Organizados en una sola columna para mejor visualización */}
      <div className="w-full space-y-6 sm:space-y-8">
        {/* Distribución ESI */}
        <div className="w-full">
          <ESIDistributionChart 
            key={`esi-${isDarkMode}`}
            datos={reporte} 
            loading={loading}
          />
        </div>

        {/* Demografía */}
        <div className="w-full">
          <DemographicsChart 
            key={`demographics-${isDarkMode}`}
            datos={reporte} 
            loading={loading}
          />
        </div>

        {/* Tiempos de Espera */}
        <div className="w-full">
          <WaitTimesChart 
            key={`waittimes-${isDarkMode}`}
            datos={reporte} 
            loading={loading}
          />
        </div>

        {/* Estado de Atención */}
        <div className="w-full">
          <AttentionStatusChart 
            key={`attention-${isDarkMode}`}
            datos={reporte} 
            loading={loading}
          />
        </div>
      </div>

          {/* Información adicional */}
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Información del Reporte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Período:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {reporte?.periodo ? 
                    `${reporte.periodo.fecha_inicio} - ${reporte.periodo.fecha_fin}` :
                    `${new Date(filtros.fecha_inicio).toLocaleDateString('es-ES')} - ${new Date(filtros.fecha_fin).toLocaleDateString('es-ES')}`
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Última actualización:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {reporte?.metadata ? 
                    `${reporte.metadata.fecha_generacion}, ${reporte.metadata.hora_generacion}` :
                    new Date().toLocaleString('es-ES')
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Tipo de análisis:</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {reporte?.metadata?.tipo_reporte || 'Reporte Completo'}
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </>
  );
};

export default ReportsPage;