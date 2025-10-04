import React from 'react';
import { CalendarDaysIcon } from '../icons/Icons';
import { getCurrentDateString } from '../../utils/dateUtils';
import Button from '../ui/Button';

const DateRangeFilter = ({ 
  filtros, 
  onFiltrosChange, 
  onRangoRapido, 
  onGenerarReporte,
  loading = false
}) => {
  
  const handleFechaChange = (campo, valor) => {
    onFiltrosChange({
      [campo]: valor
    });
  };

  const rangosRapidos = [
    { key: 'hoy', label: 'Hoy', dias: 0 },
    { key: '7dias', label: '7 días', dias: 7 },
    { key: '30dias', label: '30 días', dias: 30 },
    { key: '90dias', label: '90 días', dias: 90 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-primary dark:text-blue-400 flex items-center">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-primary dark:text-blue-400" />
          Período de Análisis
        </h3>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rangos Rapidos
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {rangosRapidos.map(rango => (
            <button
              key={rango.key}
              onClick={() => onRangoRapido(rango.key)}
              disabled={loading}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-[#0451BC] hover:bg-opacity-10 dark:hover:bg-[#0451BC] dark:hover:bg-opacity-20 hover:text-[#0451BC] dark:hover:text-[#0451BC] hover:border-[#0451BC] dark:hover:border-[#0451BC] focus:outline-none focus:ring-2 focus:ring-[#0451BC] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {rango.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Fechas con más ancho */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={filtros.fecha_inicio}
              onChange={(e) => handleFechaChange('fecha_inicio', e.target.value)}
              disabled={loading}
              max={filtros.fecha_fin}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0451BC] focus:border-[#0451BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Fin
            </label>
            <input
              type="date"
              value={filtros.fecha_fin}
              onChange={(e) => handleFechaChange('fecha_fin', e.target.value)}
              disabled={loading}
              min={filtros.fecha_inicio}
              max={getCurrentDateString()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0451BC] focus:border-[#0451BC] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
          </div>
        </div>

        {/* Botón con el mismo ancho que los rangos rápidos */}
        <div className="lg:w-auto">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            &nbsp;
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2 lg:w-48">
            <Button
              onClick={onGenerarReporte}
              disabled={loading}
              loading={loading}
              variant="primary"
              size="sm"
              className="col-span-2 sm:col-span-4 lg:col-span-1 whitespace-nowrap h-[42px] flex items-center justify-center"
            >
              {!loading && <CalendarDaysIcon className="h-4 w-4 mr-2 flex-shrink-0" />}
              <span className="flex-1 text-center">{loading ? 'Generando...' : 'Generar Informe'}</span>
            </Button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DateRangeFilter;