import React, { useState, useMemo } from 'react';
import PageContainer from '../components/ui/PageContainer';
import UserAvatar from '../components/ui/UserAvatar';
import PatientFilters from '../components/Staff/PatientFilters';
import PatientTable from '../components/Staff/PatientTable';
import useAuth from '../hooks/useAuth';

const StaffDashboard = () => {
  const { usuario } = useAuth();
  const [filters, setFilters] = useState({
    esi: '',
    sortBy: 'arrivalTime',
    status: ''
  });

  // Datos de ejemplo para los pacientes
  const [patients, setPatients] = useState([
    {
      id: 'P001',
      name: 'Juan Pérez',
      age: 45,
      gender: 'M',
      esiLevel: 2,
      arrivalTime: '2024-01-15T08:30:00',
      reason: 'Dolor torácico intenso',
      status: 'En espera'
    },
    {
      id: 'P002',
      name: 'María González',
      age: 32,
      gender: 'F',
      esiLevel: 3,
      arrivalTime: '2024-01-15T09:15:00',
      reason: 'Dolor abdominal',
      status: 'En atención'
    },
    {
      id: 'P003',
      name: 'Carlos Rodríguez',
      age: 58,
      gender: 'M',
      esiLevel: 1,
      arrivalTime: '2024-01-15T07:45:00',
      reason: 'Dificultad respiratoria severa',
      status: 'En atención'
    },
    {
      id: 'P004',
      name: 'Ana Martín',
      age: 28,
      gender: 'F',
      esiLevel: 4,
      arrivalTime: '2024-01-15T10:20:00',
      reason: 'Dolor de cabeza persistente',
      status: 'En espera'
    },
    {
      id: 'P005',
      name: 'Luis García',
      age: 67,
      gender: 'M',
      esiLevel: 5,
      arrivalTime: '2024-01-15T11:00:00',
      reason: 'Control rutinario',
      status: 'Atendido'
    }
  ]);

  // Función para filtrar y ordenar pacientes
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = [...patients];

    // Filtrar por ESI
    if (filters.esi) {
      filtered = filtered.filter(patient => patient.esiLevel.toString() === filters.esi);
    }

    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(patient => patient.status === filters.status);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'esiLevel':
          return a.esiLevel - b.esiLevel;
        case 'arrivalTime':
        default:
          return new Date(a.arrivalTime) - new Date(b.arrivalTime);
      }
    });

    return filtered;
  }, [patients, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleViewHistory = (patientId) => {
    console.log('Ver historial del paciente:', patientId);
    // Aquí implementarías la navegación al historial del paciente
  };

  const handleStartAttention = (patientId) => {
    console.log('Iniciar atención del paciente:', patientId);
    // Aquí implementarías la lógica para iniciar la atención
    setPatients(prev => 
      prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, status: 'En atención' }
          : patient
      )
    );
  };

  const handleExportCSV = () => {
    console.log('Exportar a CSV');
    // Aquí implementarías la lógica para exportar los datos
  };

  // Obtener nombre completo del usuario para mostrar
  const nombreCompleto = usuario ? 
    `${usuario.first_name || ''} ${usuario.last_name || ''}`.trim() || 
    usuario.username || 'Usuario' 
    : 'Usuario';

  return (
    <div className="w-full max-w-7xl mx-auto">
      <PageContainer variant="form" className="!p-8">
        {/* Header del Dashboard */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-blue-400">
              Panel de Gestión de Pacientes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {usuario?.role === 'admin' ? 'Administrador' : 'Dr.'} {nombreCompleto}
            </p>
            {usuario?.email && (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {usuario.email}
              </p>
            )}
          </div>
          <UserAvatar userName={nombreCompleto} />
        </div>

        {/* Línea separadora */}
        <div className="w-4/4 h-px bg-gray-200 dark:bg-gray-600 mb-8"></div>

        {/* Filtros */}
        <PatientFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          onExportCSV={handleExportCSV}
        />

        {/* Tabla de Pacientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          {filteredAndSortedPatients.length > 0 ? (
            <PatientTable 
              patients={filteredAndSortedPatients}
              onViewHistory={handleViewHistory}
              onStartAttention={handleStartAttention}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron pacientes con los filtros aplicados.
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Pacientes</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{patients.length}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">En Espera</h3>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {patients.filter(p => p.status === 'En espera').length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Atendidos</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {patients.filter(p => p.status === 'Atendido').length}
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default StaffDashboard;
