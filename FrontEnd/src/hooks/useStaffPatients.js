import { useState, useEffect, useCallback, useMemo } from 'react';
import { pacienteService } from '../services/api/pacienteService';

/**
 * Hook personalizado para gestionar los pacientes del staff
 * Maneja filtros, paginación y estado de los pacientes
 */
const useStaffPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const [filters, setFilters] = useState({
    esi: '',
    sortBy: 'fecha_inicio', // Ordenar por hora de llegada por defecto
    status: '',
    search: '',
    completado: true // Solo pacientes con triage completado
  });

  /**
   * Transforma los datos del backend al formato esperado por el frontend
   */
  const transformPatientData = useCallback((backendPatient) => {
    // Buscar la sesión de triage completada más reciente
    const sesionesCompletadas = backendPatient.sesiones_triage?.filter(
      sesion => sesion.completado === true
    ).sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));

    if (!sesionesCompletadas || sesionesCompletadas.length === 0) {
      return null; // No mostrar pacientes sin triage completado
    }

    // Usar la sesión más reciente
    const sesionMasReciente = sesionesCompletadas[0];

    return {
      id: backendPatient.id,
      name: `${backendPatient.primer_nombre} ${backendPatient.primer_apellido}`,
      fullName: `${backendPatient.primer_nombre} ${backendPatient.segundo_nombre || ''} ${backendPatient.primer_apellido} ${backendPatient.segundo_apellido || ''}`.trim(),
      age: backendPatient.edad,
      gender: backendPatient.sexo === 'M' ? 'M' : 'F',
      esiLevel: sesionMasReciente.nivel_triage,
      arrivalTime: sesionMasReciente.fecha_inicio,
      reason: backendPatient.sintomas_iniciales,
      status: mapBackendStatus(backendPatient.estado),
      documentNumber: backendPatient.numero_documento,
      documentType: backendPatient.tipo_documento,
      phone: `${backendPatient.prefijo_telefonico}${backendPatient.telefono}`,
      eps: backendPatient.eps,
      // Datos adicionales que podrían ser útiles
      sesionId: sesionMasReciente.id,
      fechaRegistro: backendPatient.creado
    };
  }, []);

  /**
   * Mapea los estados del backend a los del frontend
   */
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'EN_ESPERA': 'En espera',
      'EN_ATENCION': 'En atención', 
      'ATENDIDO': 'Atendido',
      'ABANDONO': 'Abandono'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  /**
   * Mapea los estados del frontend a los del backend
   */
  const mapFrontendStatus = (frontendStatus) => {
    const statusMap = {
      'En espera': 'EN_ESPERA',
      'En atención': 'EN_ATENCION',
      'Atendido': 'ATENDIDO',
      'Abandono': 'ABANDONO'
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  /**
   * Construye los parámetros de consulta para la API
   */
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    
    // Solo pacientes con triage completado
    params.append('triage_completado', 'true');
    
    // Filtros
    if (filters.esi) {
      params.append('nivel_triage', filters.esi);
    }
    
    if (filters.status) {
      params.append('estado', mapFrontendStatus(filters.status));
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }

    // Ordenamiento
    let ordering = '';
    switch (filters.sortBy) {
      case 'name':
        ordering = 'primer_nombre';
        break;
      case 'esiLevel':
        ordering = 'sesiones_triage__nivel_triage';
        break;
      case 'fecha_inicio':
      default:
        ordering = '-sesiones_triage__fecha_inicio';  // Descendente para mostrar más recientes primero
        break;
    }
    params.append('ordering', ordering);
    
    // Paginación
    params.append('page', pagination.currentPage.toString());
    params.append('page_size', pagination.pageSize.toString());
    
    return params.toString();
  }, [filters, pagination.currentPage, pagination.pageSize]);

  /**
   * Obtiene los pacientes desde la API
   */
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryString = buildQueryParams();
      const url = `/pacientes/?${queryString}`;
      
      const response = await pacienteService.obtenerPacientes(url);
      
      if (response.success) {
        // Transformar datos del backend
        const transformedPatients = response.data.results
          ?.map(transformPatientData)
          .filter(Boolean) || []; // Filtrar pacientes nulos
        
        // Eliminar duplicados por ID de paciente (en caso de que el backend envíe duplicados)
        const uniquePatients = transformedPatients.reduce((acc, patient) => {
          if (!acc.find(p => p.id === patient.id)) {
            acc.push(patient);
          }
          return acc;
        }, []);
        
        setPatients(uniquePatients);
        
        // Actualizar paginación si viene del backend
        if (response.data.count !== undefined) {
          setPagination(prev => ({
            ...prev,
            totalItems: response.data.count,
            totalPages: Math.ceil(response.data.count / prev.pageSize)
          }));
        }
      } else {
        setError(response.message || 'Error al obtener los pacientes');
        setPatients([]);
      }
    } catch (err) {
      setError('Error de conexión al obtener los pacientes');
      setPatients([]);
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, transformPatientData]);

  /**
   * Actualiza el estado de un paciente
   */
  const updatePatientStatus = useCallback(async (patientId, newStatus) => {
    try {
      const backendStatus = mapFrontendStatus(newStatus);
      const response = await pacienteService.actualizarPaciente(patientId, {
        estado: backendStatus
      });
      
      if (response.success) {
        // Actualizar el estado local
        setPatients(prev => 
          prev.map(patient => 
            patient.id === patientId 
              ? { ...patient, status: newStatus }
              : patient
          )
        );
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error('Error updating patient status:', err);
      return { success: false, error: 'Error de conexión' };
    }
  }, []);

  /**
   * Maneja el cambio de filtros
   */
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Reset a la primera página cuando cambian los filtros
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  /**
   * Maneja el cambio de página
   */
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  }, []);

  // Estado para estadísticas globales
  const [globalStats, setGlobalStats] = useState({
    total: 0,
    enEspera: 0,
    enAtencion: 0,
    atendidos: 0,
    abandono: 0,
    esi1: 0,
    esi2: 0,
    esi3: 0,
    esi4: 0,
    esi5: 0,
  });

  /**
   * Obtiene estadísticas globales sin filtros de paginación
   */
  const fetchGlobalStatistics = useCallback(async () => {
    try {
      // Consulta sin paginación para obtener todos los pacientes con triage completado
      const params = new URLSearchParams();
      params.append('triage_completado', 'true');
      params.append('page_size', '1000'); // Número alto para obtener todos los registros
      
      const url = `/pacientes/?${params.toString()}`;
      const response = await pacienteService.obtenerPacientes(url);
      
      if (response.success && response.data.results) {
        const allPatients = response.data.results.map(transformPatientData).filter(Boolean);
        
        // Usar los datos transformados que ya tienen el estado mapeado
        setGlobalStats({
          total: allPatients.length,
          enEspera: allPatients.filter(p => p.status === 'En espera').length,
          enAtencion: allPatients.filter(p => p.status === 'En atención').length,
          atendidos: allPatients.filter(p => p.status === 'Atendido').length,
          abandono: allPatients.filter(p => p.status === 'Abandono').length,
          esi1: allPatients.filter(p => p.esiLevel === 1).length,
          esi2: allPatients.filter(p => p.esiLevel === 2).length,
          esi3: allPatients.filter(p => p.esiLevel === 3).length,
          esi4: allPatients.filter(p => p.esiLevel === 4).length,
          esi5: allPatients.filter(p => p.esiLevel === 5).length,
        });
      }
    } catch (error) {
      console.error('Error fetching global statistics:', error);
    }
  }, [transformPatientData]);

  /**
   * Estadísticas calculadas de los pacientes (ahora usando estadísticas globales)
   */
  const statistics = globalStats;

  // Efecto para cargar los pacientes cuando cambian los filtros o la paginación
  useEffect(() => {
    fetchPatients();
    fetchGlobalStatistics(); // Cargar estadísticas globales
  }, [fetchPatients, fetchGlobalStatistics]);

  return {
    // Estado
    patients,
    loading,
    error,
    pagination,
    filters,
    statistics,
    
    // Acciones
    handleFilterChange,
    handlePageChange,
    updatePatientStatus,
    refetch: () => {
      fetchPatients();
      fetchGlobalStatistics();
    }
  };
};

export default useStaffPatients;