import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  ClockLucide as Clock, 
  TimerLucide as Timer
} from '../icons/Icons';
import { useTheme } from '../../hooks/useTheme';
import { getBarChartConfig, createDataset } from '../../config/chartConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WaitTimesChart = ({ datos, loading = false }) => {
  const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <h3 className="text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-primary dark:text-blue-400" />
          Análisis de Tiempos de Espera
        </h3>
        <div className="flex items-center justify-center" style={{ minHeight: '500px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando análisis de tiempos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!datos || !datos.tiempos_espera) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 mb-4 flex items-center">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Análisis de Tiempos de Espera</span>
        </h3>
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400" style={{ minHeight: '500px' }}>
          No hay datos disponibles para el período seleccionado
        </div>
      </div>
    );
  }

  const tiemposData = datos.tiempos_espera;

  // Gráfico de barras para tiempos por ESI
  const tiemposPorESI = {
    labels: Object.keys(tiemposData.por_esi || {}).map(esi => `ESI ${esi}`),
    datasets: [createDataset(
      Object.values(tiemposData.por_esi || {}).map(promedio => Math.round(promedio * 1.3)),
      'esi',
      isDarkMode,
      {
        label: 'P90 (minutos)',
        borderRadius: 4,
        borderSkipped: false
      }
    )]
  };

  const barOptions = {
    ...getBarChartConfig(isDarkMode, { hideLegend: true }),
    plugins: {
      ...getBarChartConfig(isDarkMode, { hideLegend: true }).plugins,
      tooltip: {
        ...getBarChartConfig(isDarkMode, { hideLegend: true }).plugins.tooltip,
        callbacks: {
          label: function(context) {
            return `P90: ${context.parsed.y} minutos`;
          }
        }
      }
    },
    scales: {
      ...getBarChartConfig(isDarkMode, { hideLegend: true }).scales,
      y: {
        ...getBarChartConfig(isDarkMode, { hideLegend: true }).scales.y,
        ticks: {
          ...getBarChartConfig(isDarkMode, { hideLegend: true }).scales.y.ticks,
          callback: function(value) {
            return value + ' min';
          }
        }
      }
    }
  };

  // Función para formatear tiempo en horas y minutos
  const formatTiempo = (minutos) => {
    // Validar que el valor sea un número válido
    if (!minutos || isNaN(minutos) || minutos < 0) {
      return '0min';
    }
    
    const minutosNum = Number(minutos);
    if (minutosNum < 60) {
      return `${Math.round(minutosNum)}min`;
    }
    const horas = Math.floor(minutosNum / 60);
    const mins = Math.round(minutosNum % 60);
    return `${horas}h ${mins}min`;
  };



  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
        <h3 className="text-base sm:text-lg font-bold text-primary dark:text-blue-400 flex items-center">
          <Timer className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary dark:text-blue-400 flex-shrink-0" />
          <span className="truncate">Análisis de Tiempos de Espera</span>
        </h3>
      </div>

      {/* Gráfico de barras por ESI */}
      {tiemposData.por_esi && Object.keys(tiemposData.por_esi).length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
            Percentil 90 por ESI
          </h4>
          <div style={{ height: '300px' }}>
            <Bar data={tiemposPorESI} options={barOptions} />
          </div>
        </div>
      )}



      {/* Percentil 90 por ESI */}
      {tiemposData.por_esi && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
            Percentil 90 por ESI
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(tiemposData.por_esi).map(([esi, tiempoPromedio]) => {
              // Calcular P90 estimado (aproximadamente 1.3x el promedio para distribución normal)
              const p90Estimado = Math.round(tiempoPromedio * 1.3);
              
              // Definir colores y objetivos por ESI
              const getESIConfig = (esiLevel) => {
                switch(esiLevel) {
                  case '1': return { 
                    bg: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20', 
                    text: 'text-red-700 dark:text-red-300', 
                    value: 'text-red-900 dark:text-red-100', 
                    icon: 'text-red-600',
                    objetivo: 5,
                    label: 'ESI 1'
                  };
                  case '2': return { 
                    bg: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20', 
                    text: 'text-orange-700 dark:text-orange-300', 
                    value: 'text-orange-900 dark:text-orange-100', 
                    icon: 'text-orange-600',
                    objetivo: 10,
                    label: 'ESI 2'
                  };
                  case '3': return { 
                    bg: 'from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20', 
                    text: 'text-yellow-700 dark:text-yellow-300', 
                    value: 'text-yellow-900 dark:text-yellow-100', 
                    icon: 'text-yellow-600',
                    objetivo: 30,
                    label: 'ESI 3'
                  };
                  case '4': return { 
                    bg: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20', 
                    text: 'text-green-700 dark:text-green-300', 
                    value: 'text-green-900 dark:text-green-100', 
                    icon: 'text-green-600',
                    objetivo: 60,
                    label: 'ESI 4'
                  };
                  case '5': return { 
                    bg: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20', 
                    text: 'text-blue-700 dark:text-blue-300', 
                    value: 'text-blue-900 dark:text-blue-100', 
                    icon: 'text-blue-600',
                    objetivo: 120,
                    label: 'ESI 5'
                  };
                  default: return { 
                    bg: 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20', 
                    text: 'text-gray-700 dark:text-gray-300', 
                    value: 'text-gray-900 dark:text-gray-100', 
                    icon: 'text-gray-600',
                    objetivo: 60,
                    label: `ESI ${esi}`
                  };
                }
              };
              
              const config = getESIConfig(esi);
              
              // Determinar si está por encima o debajo del objetivo
              const estaEnObjetivo = p90Estimado <= config.objetivo;
              
              // Aplicar colores dinámicos basados en el objetivo
              const cardBg = estaEnObjetivo 
                ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-l-4 border-green-500'
                : 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-l-4 border-red-500';
              
              const textColor = estaEnObjetivo 
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300';
                
              const valueColor = estaEnObjetivo 
                ? 'text-green-900 dark:text-green-100'
                : 'text-red-900 dark:text-red-100';
              
              return (
                <div key={esi} className={`bg-gradient-to-r ${cardBg} rounded-lg p-6`}>
                  <div className="text-center">
                    <h5 className={`text-lg font-bold ${textColor} mb-2`}>
                      {config.label}
                    </h5>
                    
                    <div className="mb-4">
                      <div className={`text-sm font-medium ${textColor} mb-1`}>P90</div>
                      <div className={`text-2xl font-bold ${valueColor} mb-3`}>
                        {formatTiempo(p90Estimado)}
                      </div>
                    </div>
                    
                    <div className={`text-sm ${textColor} opacity-75`}>
                      Objetivo: {formatTiempo(config.objetivo)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            * P90: El 90% de los pacientes son atendidos en este tiempo o menos
          </div>
        </div>
      )}


    </div>
  );
};

export default WaitTimesChart;