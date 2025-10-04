import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Title
} from 'chart.js';
import { ChartNoAxesColumnLucide as ChartNoAxesColumn } from '../icons/Icons';
import { useTheme } from '../../hooks/useTheme';
import { getDoughnutChartConfig, createDataset } from '../../config/chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ESIDistributionChart = ({ datos, loading = false }) => {
  const { isDarkMode } = useTheme();
  
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <h3 className="text-lg font-bold text-[#0451BC] dark:text-[#0451BC] mb-4 flex items-center">
          <ChartNoAxesColumn className="h-5 w-5 mr-2 text-[#0451BC]" />
          Distribución por Niveles ESI
        </h3>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando distribución ESI...</p>
          </div>
        </div>
      </div>
    );
  }

  // Usar los datos directos del backend
  const distribucionESI = datos?.distribucion_esi || [];
  
  if (!datos || distribucionESI.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-[#0451BC] dark:text-[#0451BC] mb-4 flex items-center">
          <ChartNoAxesColumn className="h-5 w-5 mr-2 text-[#0451BC]" />
          Distribución por Niveles ESI
        </h3>
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ minHeight: '400px' }}>
          No hay datos disponibles para el período seleccionado
        </div>
      </div>
    );
  }

  const etiquetasESI = {
    '1': 'ESI 1',
    '2': 'ESI 2',
    '3': 'ESI 3', 
    '4': 'ESI 4',
    '5': 'ESI 5'
  };

  const chartData = {
    labels: distribucionESI.map(item => etiquetasESI[item.nivel_esi] || `ESI ${item.nivel_esi}`),
    datasets: [createDataset(distribucionESI, 'esi', isDarkMode, { hoverOffset: 4 })]
  };

  const options = getDoughnutChartConfig(isDarkMode);

  const totalPacientes = distribucionESI.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 flex items-center">
          <ChartNoAxesColumn className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Distribución por Niveles ESI</span>
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{totalPacientes}</span> pacientes
        </div>
      </div>

      <div className="flex justify-center">
        <div style={{ width: '400px', height: '400px' }}>
          <Doughnut data={chartData} options={options} />
        </div>
      </div>




    </div>
  );
};

export default ESIDistributionChart;