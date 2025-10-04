import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  pageSize,
  onPageChange,
  showInfo = true,
  showPageNumbers = true,
  maxPageNumbers = 5
}) => {
  // No mostrar paginación si hay una sola página o menos
  if (totalPages <= 1) return null;

  // Calcular rango de páginas a mostrar
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
    
    // Ajustar el inicio si estamos cerca del final
    if (endPage - startPage < maxPageNumbers - 1) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const PrevIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );

  const NextIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
      {/* Información de elementos */}
      {showInfo && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {startItem} - {endItem} de {totalItems} pacientes
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                   bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                   rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700
                   transition-colors duration-200"
        >
          <PrevIcon />
          <span className="hidden sm:inline ml-2">Anterior</span>
        </button>

        {/* Números de página */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {/* Primera página si no está visible */}
            {pageNumbers[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                           bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300
                           transition-colors duration-200"
                >
                  1
                </button>
                {pageNumbers[0] > 2 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
              </>
            )}

            {/* Páginas visibles */}
            {pageNumbers.map(pageNum => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Última página si no está visible */}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                           bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                           rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300
                           transition-colors duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        {/* Botón Siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 
                   bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                   rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-300
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700
                   transition-colors duration-200"
        >
          <span className="hidden sm:inline mr-2">Siguiente</span>
          <NextIcon />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
