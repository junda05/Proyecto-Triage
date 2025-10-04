import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { 
  StretchVerticalLucide as StretchVertical 
} from '../icons/Icons';
import { useTheme } from '../../hooks/useTheme';
import { getDoughnutChartConfig, getBarChartConfig, createDataset } from '../../config/chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DemographicsChart = ({ datos, loading = false }) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <h3 className="text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <StretchVertical className="h-5 w-5 mr-2 text-primary dark:text-blue-400" />
          Distribución Demográfica
        </h3>
        <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando distribución demográfica...</p>
          </div>
        </div>
      </div>
    );
  }

  // Usar los datos directos del backend
  const distribucionGenero = datos?.distribucion_genero || [];
  const distribucionEdad = datos?.distribucion_edad || [];
  
  if (!datos || (distribucionGenero.length === 0 && distribucionEdad.length === 0)) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <StretchVertical className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Distribución Demográfica</span>
        </h3>
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ minHeight: '400px' }}>
          No hay datos disponibles para el período seleccionado
        </div>
      </div>
    );
  }

  // Datos para gráfico de género
  const generoData = distribucionGenero.length > 0 ? {
    labels: distribucionGenero.map(item => {
      const labels = {
        'M': 'Masculino',
        'F': 'Femenino', 
        'NA': 'No Aplica'
      };
      return labels[item.genero] || item.genero;
    }),
    datasets: [createDataset(distribucionGenero, 'genero', isDarkMode, { hoverOffset: 4 })]
  } : null;

  // Datos para gráfico de edad - convertir a porcentajes
  const edadData = distribucionEdad.length > 0 ? {
    labels: distribucionEdad.map(item => item.rango_edad),
    datasets: [createDataset(
      distribucionEdad.map(item => {
        const totalEdad = distribucionEdad.reduce((sum, e) => sum + e.cantidad, 0);
        return ((item.cantidad / totalEdad) * 100);
      }),
      'esi', 
      isDarkMode, 
      { 
        label: 'Porcentaje de Pacientes',
        borderRadius: 4,
        borderSkipped: false
      }
    )]
  } : null;

  // Calcular total de pacientes
  const totalPacientes = datos?.total_pacientes || 
    distribucionGenero.reduce((sum, item) => sum + item.cantidad, 0) || 
    distribucionEdad.reduce((sum, item) => sum + item.cantidad, 0) || 0;

  const chartOptions = getDoughnutChartConfig(isDarkMode);

  // Calculate max value for age chart with padding
  const maxPercentage = edadData ? Math.max(...edadData.datasets[0].data) : 0;
  const suggestedMax = maxPercentage <= 50 ? Math.ceil(maxPercentage / 10) * 10 + 10 : 100;

  const barOptions = {
    ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }),
    plugins: {
      ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }).plugins,
      tooltip: {
        ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }).plugins.tooltip,
        callbacks: {
          label: function(context) {
            const porcentaje = context.parsed.y.toFixed(1);
            // Calculate count from percentage
            const totalEdad = distribucionEdad.reduce((sum, e) => sum + e.cantidad, 0);
            const count = Math.round((context.parsed.y / 100) * totalEdad);
            return `${porcentaje}% (${count} pacientes)`;
          }
        }
      }
    },
    scales: {
      ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }).scales,
      y: {
        ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }).scales.y,
        ticks: {
          ...getBarChartConfig(isDarkMode, { hideLegend: true, suggestedMax }).scales.y.ticks,
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };



  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 flex items-center">
          <StretchVertical className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Distribución Demográfica</span>
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{totalPacientes}</span> pacientes
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Gráfico de Género */}
        {generoData && (
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
              Por Género
            </h4>
            <div className="flex justify-center">
              <div style={{ width: '400px', height: '400px' }}>
                <Doughnut key={`demographics-gender-${isDarkMode}`} data={generoData} options={chartOptions} />
              </div>
            </div>
            

          </div>
        )}

        {/* Gráfico de Edad */}
        {edadData && (
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
              Por Rango de Edad
            </h4>
            <div style={{ height: '300px' }}>
              <Bar key={`demographics-age-${isDarkMode}`} data={edadData} options={barOptions} />
            </div>
            

          </div>
        )}
      </div>


    </div>
  );
};

export default DemographicsChart;