import React, { useState, useRef, useEffect, memo } from 'react';
import { ChevronDownLucide as ChevronDownIcon } from '../icons/Icons';

/**
 * Dropdown unificado que combina todas las opciones de filtro
 * con mejor UX y organización visual
 */
const UnifiedDropdown = memo(({
  filters,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Opciones organizadas por categoría
  const filterCategories = [
    {
      id: 'role',
      title: 'Filtrar por Rol',
      options: [
        { value: '', label: 'Todos los roles' },
        { value: 'admin', label: 'Administrador' },
        { value: 'estandar', label: 'Estándar' }
      ]
    },
    {
      id: 'status',
      title: 'Filtrar por Estado',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'activo', label: 'Activos' },
        { value: 'inactivo', label: 'Inactivos' }
      ]
    },
    {
      id: 'sort',
      title: 'Ordenar por',
      options: [
        { value: 'date_joined', label: 'Fecha de registro' },
        { value: 'username', label: 'Usuario' },
        { value: 'role', label: 'Rol' },
        { value: 'last_login', label: 'Último login' }
      ]
    }
  ];

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener el filtro activo actualmente
  const getActiveFilter = () => {
    if (filters.role && filters.role !== '') {
      return { type: 'role', value: filters.role, label: getOptionLabel('role', filters.role) };
    }
    if (filters.status && filters.status !== '') {
      return { type: 'status', value: filters.status, label: getOptionLabel('status', filters.status) };
    }
    if (filters.sortBy && filters.sortBy !== 'date_joined') {
      return { type: 'sort', value: filters.sortBy, label: getOptionLabel('sort', filters.sortBy) };
    }
    return { type: 'none', value: '', label: 'Filtros Rápidos' };
  };

  // Obtener label de una opción
  const getOptionLabel = (categoryId, value) => {
    const category = filterCategories.find(cat => cat.id === categoryId);
    if (!category) return value;
    
    const option = category.options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Manejar selección de opción
  const handleOptionSelect = (categoryId, value) => {
    const newFilters = {
      role: '',
      status: '',
      sortBy: filters.sortBy || 'date_joined'
    };
    
    if (categoryId !== 'sort') {
      newFilters[categoryId] = value;
    } else {
      newFilters.sortBy = value;
    }
    
    onFilterChange(newFilters);
    setIsOpen(false);
  };

  const activeFilter = getActiveFilter();

  return (
    <div className="relative min-w-[220px]" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Filtros Rápidos
      </label>
      
      {/* Botón del dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-blue-400 dark:focus:border-blue-400
                 transition-colors duration-200 flex items-center justify-between
                 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <span className={`text-left ${activeFilter.type === 'none' ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
          {activeFilter.label}
        </span>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Menú dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2">
          {filterCategories.map((category, categoryIndex) => (
            <div key={category.id}>
              {/* Título de categoría */}
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                {category.title}
              </div>
              
              {/* Opciones de la categoría */}
              {category.options.map((option) => (
                <button
                  key={`${category.id}-${option.value}`}
                  onClick={() => handleOptionSelect(category.id, option.value)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                    ${activeFilter.type === category.id && activeFilter.value === option.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                >
                  {option.label}
                </button>
              ))}
              
              {/* Separador entre categorías */}
              {categoryIndex < filterCategories.length - 1 && (
                <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
              )}
            </div>
          ))}
          
          {/* Botón para limpiar todos los filtros */}
          {activeFilter.type !== 'none' && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
              <button
                onClick={() => {
                  onFilterChange({
                    role: '',
                    status: '',
                    sortBy: 'date_joined'
                  });
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
              >
                ✕ Limpiar filtros
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

UnifiedDropdown.displayName = 'UnifiedDropdown';

export default UnifiedDropdown;