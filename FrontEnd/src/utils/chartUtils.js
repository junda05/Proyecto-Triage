/**
 * Utilidades para configuración de charts con soporte para tema oscuro/claro
 * Evita duplicación de código en componentes de charts
 */

/**
 * Configuración común de colores para charts
 */
export const chartColors = {
  // Colores para textos y etiquetas
  text: {
    light: '#6B7280',
    dark: '#D1D5DB'
  },
  // Colores para grillas
  grid: {
    light: '#E5E7EB',
    dark: '#374151'
  },
  // Colores para bordes
  border: {
    light: '#E5E7EB',
    dark: '#374151'
  },
  // Colores para fondos
  background: {
    light: '#FFFFFF',
    dark: '#1F2937'
  }
};

/**
 * Obtiene el color apropiado según el tema actual
 * @param {string} colorType - Tipo de color ('text', 'grid', 'border', 'background')
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @returns {string} Color hexadecimal
 */
export const getChartColor = (colorType, isDarkMode) => {
  const colorConfig = chartColors[colorType];
  if (!colorConfig) {
    console.warn(`Tipo de color no válido: ${colorType}`);
    return chartColors.text[isDarkMode ? 'dark' : 'light'];
  }
  
  return colorConfig[isDarkMode ? 'dark' : 'light'];
};

/**
 * Configuración común para ticks de escalas
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @returns {object} Configuración de ticks
 */
export const getCommonTicksConfig = (isDarkMode) => ({
  color: getChartColor('text', isDarkMode)
});

/**
 * Configuración común para grillas de escalas
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @returns {object} Configuración de grid
 */
export const getCommonGridConfig = (isDarkMode) => ({
  color: getChartColor('grid', isDarkMode)
});

/**
 * Configuración común para escalas Y con unidad
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @param {string} unit - Unidad a mostrar (ej: 'min', '%', etc.)
 * @returns {object} Configuración completa de escala Y
 */
export const getYScaleConfig = (isDarkMode, unit = '') => ({
  beginAtZero: true,
  ticks: {
    ...getCommonTicksConfig(isDarkMode),
    callback: function(value) {
      return unit ? `${value} ${unit}` : value;
    }
  },
  grid: getCommonGridConfig(isDarkMode)
});

/**
 * Configuración común para escalas X
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @returns {object} Configuración completa de escala X
 */
export const getXScaleConfig = (isDarkMode) => ({
  ticks: getCommonTicksConfig(isDarkMode),
  grid: getCommonGridConfig(isDarkMode)
});

/**
 * Configuración común para tooltips con porcentajes
 * @param {string} label - Etiqueta base para el tooltip
 * @returns {object} Configuración de tooltip
 */
export const getPercentageTooltipConfig = (label = '') => ({
  callbacks: {
    label: function(context) {
      const total = context.dataset.data.reduce((a, b) => a + b, 0);
      const percentage = ((context.parsed / total) * 100).toFixed(1);
      const baseLabel = label || context.parsed;
      return `${baseLabel} (${percentage}%)`;
    }
  }
});

/**
 * Configuración común para leyendas
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @param {object} options - Opciones adicionales para la leyenda
 * @returns {object} Configuración de leyenda
 */
export const getLegendConfig = (isDarkMode, options = {}) => ({
  display: options.display !== false,
  position: options.position || 'top',
  labels: {
    usePointStyle: options.usePointStyle !== false,
    pointStyleWidth: options.pointStyleWidth || 12,
    boxWidth: options.boxWidth || 12,
    boxHeight: options.boxHeight || 12,
    color: getChartColor('text', isDarkMode),
    font: {
      size: options.fontSize || 12
    },
    ...options.labels
  }
});

/**
 * Configuración base común para todos los charts
 * @param {boolean} isDarkMode - Si está en modo oscuro
 * @param {object} customOptions - Opciones personalizadas
 * @returns {object} Configuración base del chart
 */
export const getBaseChartOptions = (isDarkMode, customOptions = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: customOptions.legend || { display: false },
    tooltip: customOptions.tooltip || {},
    ...customOptions.plugins
  },
  scales: {
    y: customOptions.yScale || getYScaleConfig(isDarkMode),
    x: customOptions.xScale || getXScaleConfig(isDarkMode),
    ...customOptions.scales
  },
  ...customOptions
});