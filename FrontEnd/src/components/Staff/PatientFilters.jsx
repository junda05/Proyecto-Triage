import React from 'react';
import Dropdown from '../ui/Dropdown';
import useCsvExport from '../../hooks/useCsvExport';

const PatientFilters = ({ 
  filters, 
  onFilterChange,
  loading = false
}) => {
  const { exportarCSV, loading: csvLoading } = useCsvExport();
  const esiOptions = [
    { value: '', label: 'Todos' },
    { value: '1', label: 'ESI 1' },
    { value: '2', label: 'ESI 2' },
    { value: '3', label: 'ESI 3' },
    { value: '4', label: 'ESI 4' },
    { value: '5', label: 'ESI 5' }
  ];

  const sortOptions = [
    { value: 'fecha_inicio', label: 'Hora de llegada' },
    { value: 'name', label: 'Nombre' },
    { value: 'esiLevel', label: 'Nivel ESI' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'En espera', label: 'En espera' },
    { value: 'En atención', label: 'En atención' },
    { value: 'Atendido', label: 'Atendido' },
    { value: 'Abandono', label: 'Abandono' }
  ];

  const DownloadIcon = () => (
    <svg 
      className="w-4 h-4 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
      />
    </svg>
  );

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Lado izquierdo - Filtros principales */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown
            id="esiFilter"
            label="Filtrar por ESI"
            value={filters.esi}
            onChange={(e) => onFilterChange('esi', e.target.value)}
            options={esiOptions}
            placeholder="Todos"
          />
          
          <Dropdown
            id="sortBy"
            label="Ordenar por"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            options={sortOptions}
            placeholder="Hora de llegada"
          />
        </div>
        
        {/* Lado derecho - Estado y Exportar */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="min-w-[150px]">
            <Dropdown
              id="statusFilter"
              label="Estado"
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              options={statusOptions}
              placeholder="Todos"
            />
          </div>
          
          <div className="flex-shrink-0 relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Exportar CSV
            </label>
            <button
              onClick={exportarCSV}
              disabled={loading || csvLoading}
              className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 
                       rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       hover:border-gray-400 dark:hover:border-gray-500
                       transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                       text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed h-[52px]
                       cursor-pointer"
              title="Exportar pacientes a CSV"
            >
              <DownloadIcon />
              <span>CSV</span>
              <svg className="w-3 h-3 ml-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>

          </div>
        </div>
      </div>
      

    </div>
  );
};

export default PatientFilters;
