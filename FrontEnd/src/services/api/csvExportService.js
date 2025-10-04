import apiClient from '../../config/axios';

/**
 * Servicio para manejar la exportación de pacientes a CSV
 * Siguiendo el principio de Single Responsibility
 */
export const csvExportService = {
  
  /**
   * Exporta tabla de pacientes a CSV
   * @returns {Promise<Blob>} - Archivo CSV como blob
   */
  async exportarPacientesCSV() {
    try {
      // Realizar petición al endpoint sin parámetros
      const response = await apiClient.get('/pacientes/exportar-csv/', {
        responseType: 'blob', // Importante para manejar archivos
        headers: {
          'Accept': '*/*'
        }
      });
      
      return {
        success: true,
        data: response.data,
        filename: this._extractFilename(response.headers['content-disposition'])
      };
      
    } catch (error) {
      console.error('Error al exportar CSV:', error);
      
      // Si el error tiene respuesta, intentar parsear el mensaje
      if (error.response && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          return {
            success: false,
            error: errorData.mensaje || 'Error al exportar CSV'
          };
        } catch (parseError) {
          return {
            success: false,
            error: 'Error al procesar la respuesta del servidor'
          };
        }
      }
      
      return {
        success: false,
        error: error.message || 'Error de conexión al exportar CSV'
      };
    }
  },

  /**
   * Descarga un blob como archivo
   * @param {Blob} blob - El blob a descargar
   * @param {string} filename - Nombre del archivo
   */
  downloadBlob(blob, filename = 'reporte_pacientes.csv') {
    try {
      // Crear URL del blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento anchor temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Agregar al DOM temporalmente y hacer click
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
      
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      return {
        success: false,
        error: 'Error al descargar el archivo'
      };
    }
  },

  /**
   * Exporta y descarga automáticamente el CSV
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async exportarYDescargar() {
    const exportResult = await this.exportarPacientesCSV();
    
    if (!exportResult.success) {
      return exportResult;
    }
    
    const downloadResult = this.downloadBlob(exportResult.data, exportResult.filename);
    
    return {
      success: downloadResult.success,
      error: downloadResult.error,
      filename: exportResult.filename
    };
  },

  /**
   * Extrae el nombre del archivo del header Content-Disposition
   * @param {string} contentDisposition - Header Content-Disposition
   * @returns {string} - Nombre del archivo
   */
  _extractFilename(contentDisposition) {
    if (!contentDisposition) {
      return 'reporte_pacientes.csv';
    }
    
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, '');
    }
    
    return 'reporte_pacientes.csv';
  },


};

export default csvExportService;