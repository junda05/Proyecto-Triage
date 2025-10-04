import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  ClipboardListLucide as ClipboardList, 
  UserCheckLucide as UserCheck, 
  ClockLucide as Clock, 
  CheckCircleIcon as CheckCircle, 
  XCircleIcon as XCircle, 
  ActivityLucide as Activity 
} from '../icons/Icons';
import { useTheme } from '../../hooks/useTheme';
import { getDoughnutChartConfig, createDataset } from '../../config/chartConfig';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AttentionStatusChart = ({ datos, loading = false }) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <h3 className="text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary dark:text-blue-400" />
          Estados de Atención
        </h3>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando estadísticas de atención...</p>
          </div>
        </div>
      </div>
    );
  }

  // Usar los datos directos del backend
  const estadisticasEstado = datos?.estadisticas_estado || [];
  
  if (!datos || estadisticasEstado.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Estados de Atención</span>
        </h3>
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ minHeight: '400px' }}>
          No hay datos disponibles para el período seleccionado
        </div>
      </div>
    );
  }

  // Mapeo de estados a etiquetas y colores
  const estadosConfig = {
    'EN_ESPERA': {
      label: 'En Espera',
      color: '#eab308',
      bgColor: 'rgba(250, 204, 21, 0.85)',
      icon: Clock
    },
    'EN_ATENCION': {
      label: 'En Atención',
      color: '#2563eb', 
      bgColor: 'rgba(59, 130, 246, 0.85)',
      icon: UserCheck
    },
    'ATENDIDO': {
      label: 'Atendido',
      color: '#16a34a',
      bgColor: 'rgba(34, 197, 94, 0.85)', 
      icon: CheckCircle
    },
    'ABANDONO': {
      label: 'Abandono',
      color: '#dc2626',
      bgColor: 'rgba(239, 68, 68, 0.85)',
      icon: XCircle
    }
  };

  // Datos para el gráfico circular
  const pieData = {
    labels: estadisticasEstado.map(item => estadosConfig[item.estado]?.label || item.estado),
    datasets: [createDataset(estadisticasEstado, 'estados', isDarkMode, { hoverOffset: 4 })]
  };

  const pieOptions = getDoughnutChartConfig(isDarkMode);

  const totalPacientes = estadisticasEstado.reduce((sum, item) => sum + item.cantidad, 0);

  // Calcular métricas
  const atendidos = estadisticasEstado.find(item => item.estado === 'ATENDIDO')?.cantidad || 0;
  const abandonos = estadisticasEstado.find(item => item.estado === 'ABANDONO')?.cantidad || 0;

  const tasaAtencion = totalPacientes > 0 ? ((atendidos / totalPacientes) * 100).toFixed(1) : 0;
  const tasaAbandono = totalPacientes > 0 ? ((abandonos / totalPacientes) * 100).toFixed(1) : 0;

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 flex items-center">
          <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Estados de Atención</span>
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{totalPacientes}</span> pacientes
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Gráfico circular */}
        <div className="flex justify-center">
          <div style={{ width: '350px', height: '350px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Métricas y detalles */}
        <div className="space-y-4">
          {/* Métricas principales */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Tasa de Atención</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">{tasaAtencion}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">Tasa de Abandono</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">{tasaAbandono}%</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Lista detallada */}
          <div className="space-y-3">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-200">
              Detalle por Estado
            </h4>
            {estadisticasEstado.map(item => {
              const config = estadosConfig[item.estado] || {
                label: item.estado,
                color: '#6B7280',
                icon: Activity
              };
              const IconComponent = config.icon;
              const porcentaje = ((item.cantidad / totalPacientes) * 100).toFixed(1);
              
              return (
                <div key={item.estado} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.bgColor }}
                    ></div>
                    <IconComponent className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {config.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {item.cantidad}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({porcentaje}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AttentionStatusChart;