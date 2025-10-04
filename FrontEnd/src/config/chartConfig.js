/**
 * Configuración centralizada para todos los gráficos
 * Maneja colores, estilos y opciones comunes
 */

/**
 * Configuración base para Chart.js con alta calidad visual
 */
export const getBaseChartConfig = (isDarkMode = false) => {
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  
  return {
    // Configuración Ultra HD 4K para máxima calidad visual
    devicePixelRatio: 3,
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    // Configuración base de plugins
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 16,
          boxWidth: 16,
          boxHeight: 16,
          color: textColor,
          font: {
            size: 13,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            weight: '500'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels && data.labels.length && data.datasets && data.datasets.length) {
              return data.labels.map((label, index) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[index],
                strokeStyle: data.datasets[0].borderColor ? data.datasets[0].borderColor[index] : 'transparent',
                lineWidth: 1,
                pointStyle: 'circle',
                hidden: false,
                index: index
              }));
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12
      }
    },
    // Configuración base para escalas
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        },
        grid: {
          color: gridColor,
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        },
        grid: {
          color: gridColor
        }
      }
    },
    // Configuración para animaciones suaves
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };
};

/**
 * Configuración específica para gráficos de dona/pie
 */
export const getDoughnutChartConfig = (isDarkMode = false) => {
  const textColor = isDarkMode ? '#D1D5DB' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#E5E7EB';
  
  return {
    // Configuración Ultra HD 4K para máxima calidad visual
    devicePixelRatio: 3,
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 14,
          boxWidth: 14,
          boxHeight: 10,
          color: textColor,
          font: {
            size: 12,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.parsed} pacientes (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };
};

/**
 * Configuración específica para gráficos de barras
 */
export const getBarChartConfig = (isDarkMode = false, options = {}) => {
  const baseConfig = getBaseChartConfig(isDarkMode);
  const { hideXGrid = true, hideLegend = false, suggestedMax } = options;
  
  return {
    ...baseConfig,
    maintainAspectRatio: false,
    plugins: {
      ...baseConfig.plugins,
      legend: {
        ...baseConfig.plugins.legend,
        display: !hideLegend
      }
    },
    scales: {
      ...baseConfig.scales,
      x: {
        ...baseConfig.scales.x,
        grid: {
          ...baseConfig.scales.x.grid,
          display: !hideXGrid
        }
      },
      y: {
        ...baseConfig.scales.y,
        ...(suggestedMax && { suggestedMax })
      }
    }
  };
};

/**
 * Configuración de colores uniformes
 */
export const getChartColors = (isDarkMode = false) => {
  return {
    // Colores para texto consistentes en todos los gráficos
    text: isDarkMode ? '#D1D5DB' : '#374151',
    textSecondary: isDarkMode ? '#9CA3AF' : '#6B7280',
    grid: isDarkMode ? '#374151' : '#E5E7EB',
    border: isDarkMode ? '#4B5563' : '#D1D5DB',
    
    // Paletas de colores para datos
    esi: {
      1: 'rgba(248, 113, 113, 0.85)',  // Red - más intenso
      2: 'rgba(251, 146, 60, 0.85)',   // Orange - más intenso
      3: 'rgba(250, 204, 21, 0.85)',   // Yellow - más intenso
      4: 'rgba(34, 197, 94, 0.85)',    // Green - más intenso
      5: 'rgba(59, 130, 246, 0.85)'    // Blue - más intenso
    },
    esiBorders: {
      1: '#dc2626',  // Red border
      2: '#ea580c',  // Orange border
      3: '#eab308',  // Yellow border
      4: '#16a34a',  // Green border
      5: '#2563eb'   // Blue border
    },
    genero: {
      'M': 'rgba(59, 130, 246, 0.85)',   // Blue
      'F': 'rgba(236, 72, 153, 0.85)',   // Pink
      'NA': 'rgba(16, 185, 129, 0.85)'   // Green
    },
    generoBorders: {
      'M': '#2563eb',  // Blue border
      'F': '#db2777',  // Pink border
      'NA': '#059669'  // Green border
    },
    estados: {
      'EN_ESPERA': 'rgba(250, 204, 21, 0.85)',   
      'EN_ATENCION': 'rgba(59, 130, 246, 0.85)', 
      'ATENDIDO': 'rgba(34, 197, 94, 0.85)',     
      'ABANDONO': 'rgba(239, 68, 68, 0.85)'      
    },
    estadosBorders: {
      'EN_ESPERA': '#eab308',   
      'EN_ATENCION': '#2563eb', 
      'ATENDIDO': '#16a34a',    
      'ABANDONO': '#dc2626'     
    }
  };
};

/**
 * Función helper para generar datasets con colores consistentes
 */
export const createDataset = (data, colorType, isDarkMode = false, options = {}) => {
  const colors = getChartColors(isDarkMode);
  const { 
    label = '', 
    borderWidth = 2, 
    hoverOffset = 4,
    borderRadius = 4,
    borderSkipped = false
  } = options;
  
  // Determinar si data es array de números o array de objetos
  const isArrayOfNumbers = Array.isArray(data) && data.length > 0 && typeof data[0] === 'number';
  
  const getColor = (item, index) => {
    if (colorType === 'esi') {
      return colors.esi[item] || colors.esi[((index % 5) + 1)];
    }
    if (colorType === 'genero') {
      return colors.genero[item] || colors.genero['NA'];
    }
    if (colorType === 'estados') {
      return colors.estados[item] || colors.estados['EN_ESPERA'];
    }
    // Para arrays de edades u otros, usar colores ESI cíclicos
    return colors.esi[((index % 5) + 1)];
  };
  
  const getBorderColor = (item, index) => {
    if (colorType === 'esi') {
      return colors.esiBorders[item] || colors.esiBorders[((index % 5) + 1)];
    }
    if (colorType === 'genero') {
      return colors.generoBorders[item] || colors.generoBorders['NA'];
    }
    if (colorType === 'estados') {
      return colors.estadosBorders[item] || colors.estadosBorders['EN_ESPERA'];
    }
    // Para arrays de edades u otros, usar bordes ESI cíclicos
    return colors.esiBorders[((index % 5) + 1)];
  };
  
  // Extraer valores y keys
  let values, keys;
  if (isArrayOfNumbers) {
    values = data;
    keys = data.map((_, index) => ((index % 5) + 1).toString());
  } else {
    values = data.map(item => item.cantidad || item.value || item);
    keys = data.map(item => item.key || item.nivel_esi || item.genero || item.estado);
  }
  
  return {
    label,
    data: values,
    backgroundColor: keys.map((key, index) => getColor(key, index)),
    borderColor: keys.map((key, index) => getBorderColor(key, index)),
    borderWidth,
    ...(hoverOffset && { hoverOffset }), // Solo para pie/doughnut charts
    ...(borderRadius && { borderRadius }), // Solo para bar charts
    ...(borderSkipped !== undefined && { borderSkipped }) // Solo para bar charts
  };
};

/**
 * Configuración de callbacks comunes para tooltips
 */
export const getTooltipCallbacks = (chartType = 'default') => {
  return {
    // Para gráficos de porcentaje
    percentage: {
      label: function(context) {
        const total = context.dataset.data.reduce((a, b) => a + b, 0);
        const percentage = ((context.parsed / total) * 100).toFixed(1);
        return `${context.parsed} pacientes (${percentage}%)`;
      }
    },
    
    // Para gráficos de tiempo
    time: {
      label: function(context) {
        const minutes = context.parsed.y || context.parsed;
        if (minutes < 60) {
          return `${Math.round(minutes)} minutos`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}min`;
      }
    },
    
    // Para gráficos de barras con porcentaje en Y
    barPercentage: {
      label: function(context) {
        const percentage = context.parsed.y.toFixed(1);
        return `${percentage}%`;
      }
    }
  };
};