// Sistema centralizado de colores y tema
export const colors = {
  primary: '#0451BC',
  primaryHover: '#1d4ed8',
  secondary: '#6B7280',
  light: '#F3F4F6',
  danger: '#EF4444',
  dangerHover: '#dc2626',
  warning: '#F59E0B',
  warningHover: '#d97706',
  success: '#10B981',
  successHover: '#059669',
  
  // Colores específicos para fondos y superficies
  background: {
    light: '#ffffff',
    dark: '#111827'
  },
  surface: {
    light: '#ffffff',
    dark: '#1f2937'
  },
  
  // Colores de texto
  text: {
    primary: {
      light: '#111827',
      dark: '#f9fafb'
    },
    secondary: {
      light: '#6b7280',
      dark: '#9ca3af'
    },
    muted: {
      light: '#9ca3af',
      dark: '#6b7280'
    }
  },
  
  // Colores de borde
  border: {
    light: '#e5e7eb',
    dark: '#374151'
  },
  
  // Colores de hover y focus
  hover: {
    light: '#f3f4f6',
    dark: '#374151'
  },

  // Paleta de colores pasteles para gráficos
  pastel: {
    // Colores ESI pasteles (basados en los colores del Percentil 90)
    esi: {
      1: 'rgba(248, 113, 113, 0.8)',  // Red pastel
      2: 'rgba(251, 146, 60, 0.8)',   // Orange pastel  
      3: 'rgba(250, 204, 21, 0.8)',   // Yellow pastel
      4: 'rgba(34, 197, 94, 0.8)',    // Green pastel
      5: 'rgba(59, 130, 246, 0.8)'    // Blue pastel
    },
    // Colores para género pasteles
    genero: {
      'M': 'rgba(59, 130, 246, 0.8)',   // Blue pastel for Masculino
      'F': 'rgba(236, 72, 153, 0.8)',   // Pink pastel for Femenino
      'NA': 'rgba(16, 185, 129, 0.8)'   // Green pastel for No Aplica
    },
    // Colores para estados de atención (usando el mismo amarillo que ESI)
    estados: {
      'EN_ESPERA': 'rgba(250, 204, 21, 0.8)',   // Mismo amarillo que ESI 3
      'EN_ATENCION': 'rgba(59, 130, 246, 0.8)', // blue-500 - En atención  
      'ATENDIDO': 'rgba(34, 197, 94, 0.8)',     // green-500 - Atendido
      'ABANDONO': 'rgba(239, 68, 68, 0.8)'      // red-500 - Abandono
    },
    // Bordes más intensos para mejor contraste
    esiBorder: {
      1: '#dc2626',  // Red border
      2: '#ea580c',  // Orange border
      3: '#eab308',  // Yellow border
      4: '#16a34a',  // Green border
      5: '#2563eb'   // Blue border
    },
    generoBorder: {
      'M': '#2563eb',  // Blue border
      'F': '#db2777',  // Pink border
      'NA': '#059669'  // Green border
    },
    estadosBorder: {
      'EN_ESPERA': '#fef08a',   // yellow-200 border (más suave)
      'EN_ATENCION': '#dbeafe', // blue-200 border (más suave)
      'ATENDIDO': '#bbf7d0',    // green-200 border (más suave)
      'ABANDONO': '#fecaca'     // red-200 border (más suave)
    }
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem'
};

export const borderRadius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem'
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem'
};

// Hook personalizado para obtener los colores según el tema
export const getThemeColors = (isDark = false) => {
  return {
    primary: colors.primary,
    primaryHover: colors.primaryHover,
    secondary: colors.secondary,
    danger: colors.danger,
    dangerHover: colors.dangerHover,
    warning: colors.warning,
    warningHover: colors.warningHover,
    success: colors.success,
    successHover: colors.successHover,
    
    background: isDark ? colors.background.dark : colors.background.light,
    surface: isDark ? colors.surface.dark : colors.surface.light,
    
    textPrimary: isDark ? colors.text.primary.dark : colors.text.primary.light,
    textSecondary: isDark ? colors.text.secondary.dark : colors.text.secondary.light,
    textMuted: isDark ? colors.text.muted.dark : colors.text.muted.light,
    
    border: isDark ? colors.border.dark : colors.border.light,
    hover: isDark ? colors.hover.dark : colors.hover.light,
    
    // Colores pasteles disponibles
    pastelESI: colors.pastel.esi,
    pastelGenero: colors.pastel.genero,
    pastelEstados: colors.pastel.estados,
    pastelESIBorder: colors.pastel.esiBorder,
    pastelGeneroBorder: colors.pastel.generoBorder,
    pastelEstadosBorder: colors.pastel.estadosBorder
  };
};
