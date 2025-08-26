import React from 'react';
import Dropdown from '../ui/Dropdown';

const PatientFilters = ({ 
  filters, 
  onFilterChange,
  onExportCSV
}) => {
  const esiOptions = [
    { value: '', label: 'Todos' },
    { value: '1', label: 'ESI 1' },
    { value: '2', label: 'ESI 2' },
    { value: '3', label: 'ESI 3' },
    { value: '4', label: 'ESI 4' },
    { value: '5', label: 'ESI 5' }
  ];

  const sortOptions = [
    { value: 'arrivalTime', label: 'Hora de llegada' },
    { value: 'name', label: 'Nombre' },
    { value: 'esiLevel', label: 'ESI' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'En espera', label: 'En espera' },
    { value: 'En atención', label: 'En atención' },
    { value: 'Atendido', label: 'Atendido' }
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
          
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              &nbsp;
            </label>
            <button
              onClick={onExportCSV}
              className="flex items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 
                       rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            >
              <DownloadIcon />
              CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientFilters;
