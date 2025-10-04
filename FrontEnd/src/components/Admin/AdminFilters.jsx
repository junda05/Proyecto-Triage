import React, { memo } from 'react';
import UnifiedDropdown from './UnifiedDropdown';
import Button from '../ui/Button';
import { PlusIcon } from '../icons/Icons';

/**
 * Componente unificado para filtros de administración
 * Reutilizable para diferentes secciones de administración
 */
const AdminFilters = memo(({
  filters,
  onFilterChange,
  searchPlaceholder = "Buscar...",
  showSearch = true,
  showRole = true,
  showStatus = true,
  showSort = true,
  totalItems = 0,
  itemsLabel = "elementos",
  showCreateButton = false,
  onCreateClick,
  createButtonText = "Crear",
  createButtonIcon = true
}) => {
  
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Lado izquierdo - Búsqueda */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Filtro por búsqueda */}
          {showSearch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar Usuario
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                placeholder={searchPlaceholder}
                className="w-full px-4 py-3 border rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:outline-none 
                         border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400
                         transition-colors duration-200"
              />
            </div>
          )}

          {/* Dropdown unificado para Rol, Estado y Ordenar */}
          <UnifiedDropdown
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>

        {/* Lado derecho - Botón crear */}
        <div className="flex flex-col justify-end">
          {/* Espaciador para alinear verticalmente con los dropdowns */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 invisible">
              &nbsp;
            </label>
          </div>
          
          {/* Botón para crear elemento */}
          {showCreateButton && onCreateClick && (
            <Button
              onClick={onCreateClick}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0451BC] to-[#1d4ed8] 
                       hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-semibold rounded-xl
                       transition-all duration-200 whitespace-nowrap h-[50px] min-w-[160px]"
            >
              {createButtonIcon && <PlusIcon className="h-5 w-5 mr-2" />}
              {createButtonText}
            </Button>
          )}
        </div>
      </div>

      {/* Información de resultados */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {totalItems} {itemsLabel} encontrados
      </div>
    </div>
  );
});

AdminFilters.displayName = 'AdminFilters';

export default AdminFilters;