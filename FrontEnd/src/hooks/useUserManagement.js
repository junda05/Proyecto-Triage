import { useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/api/authService';
import { getFullName } from '../utils/userFormatUtils';

/**
 * Hook personalizado para gestionar los usuarios del sistema
 * Maneja filtros, paginación y estado de los usuarios
 */
const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [allUsersData, setAllUsersData] = useState([]); // Mantener datos originales
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Para simplicidad inicial, no implementamos paginación backend
  // pero mantenemos la estructura para futuras mejoras
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10
  });

  const [filters, setFilters] = useState({
    role: '', // admin, estandar
    status: '', // activo, inactivo
    search: '', // buscar por nombre o usuario
    sortBy: 'date_joined' // ordenar por fecha de registro por defecto
  });

  /**
   * Transforma y filtra los datos de usuarios del backend
   */
  const processUsersData = useCallback((backendUsers) => {
    if (!Array.isArray(backendUsers)) {
      return [];
    }

    let filteredUsers = [...backendUsers];

    // Aplicar filtro por rol
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    // Aplicar filtro por estado
    if (filters.status) {
      const isActive = filters.status === 'activo';
      filteredUsers = filteredUsers.filter(user => {
        // Si is_active no existe, considerar activo por defecto
        const userIsActive = user.is_active !== false;
        return userIsActive === isActive;
      });
    }

    // Aplicar filtro de búsqueda (nombre completo o usuario)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => {
        const fullName = getFullName(user).toLowerCase();
        const username = user.username.toLowerCase();
        const email = (user.email || '').toLowerCase();
        
        return fullName.includes(searchLower) || 
               username.includes(searchLower) || 
               email.includes(searchLower);
      });
    }

    // Aplicar ordenamiento
    filteredUsers.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_joined':
          return new Date(b.date_joined) - new Date(a.date_joined);
        case 'username':
          return a.username.localeCompare(b.username);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'last_login':
          if (!a.last_login && !b.last_login) return 0;
          if (!a.last_login) return 1;
          if (!b.last_login) return -1;
          return new Date(b.last_login) - new Date(a.last_login);
        default:
          return 0;
      }
    });

    return filteredUsers;
  }, [filters]);

  /**
   * Implementa paginación local (frontend)
   */
  const paginateUsers = useCallback((allUsers) => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    const totalPages = Math.ceil(allUsers.length / pagination.pageSize);

    setPagination(prev => ({
      ...prev,
      totalPages: totalPages,
      totalItems: allUsers.length
    }));

    return paginatedUsers;
  }, [pagination.currentPage, pagination.pageSize]);

  /**
   * Obtiene todos los usuarios del sistema
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allUsers = await authService.obtenerTodosLosUsuarios();
      
      // Guardar datos originales
      setAllUsersData(allUsers);
      
      const filteredUsers = processUsersData(allUsers);
      const paginatedUsers = paginateUsers(filteredUsers);
      
      setUsers(paginatedUsers);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(err.message || 'Error al cargar usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [processUsersData, paginateUsers]);

  /**
   * Maneja cambios en los filtros
   */
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Resetear a la primera página cuando cambian los filtros
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Maneja cambios de página
   */
  const handlePageChange = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  }, []);

  /**
   * Forza actualización de datos
   */
  const refetch = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Maneja edición de usuarios
   * Nota: Los datos ahora pueden venir optimizados (solo campos modificados)
   * gracias al nuevo sistema de detección de cambios inteligente
   */
  const handleEditUser = useCallback(async (userId, userData) => {
    try {
      // Log para debugging - remover en producción
      console.info('Enviando actualización de usuario:', { userId, userData });
      
      const updatedUser = await authService.actualizarUsuario(userId, userData);
      
      // Actualizar el usuario en los datos locales
      setAllUsersData(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      
      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar usuario'
      };
    }
  }, []);

  /**
   * Estadísticas calculadas de usuarios
   */
  const statistics = useMemo(() => {
    // Usar los datos originales para estadísticas correctas
    const filteredUsers = processUsersData(allUsersData);
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter(user => user.is_active !== false).length; // Considerar activos por defecto
    const adminUsers = filteredUsers.filter(user => user.role === 'admin').length;
    const standardUsers = filteredUsers.filter(user => user.role === 'estandar').length;

    return {
      total: totalUsers,
      activos: activeUsers,
      inactivos: totalUsers - activeUsers,
      administradores: adminUsers,
      estandar: standardUsers
    };
  }, [allUsersData, processUsersData]);

  // Efecto unificado para cargar y recalcular usuarios
  useEffect(() => {
    if (allUsersData.length === 0) {
      // Cargar usuarios inicialmente
      fetchUsers();
    } else {
      // Recalcular cuando cambien los filtros sobre datos ya cargados
      const filteredUsers = processUsersData(allUsersData);
      const paginatedUsers = paginateUsers(filteredUsers);
      setUsers(paginatedUsers);
    }
  }, [allUsersData, filters, processUsersData, paginateUsers, fetchUsers]);

  return {
    users,
    allUsersData,
    loading,
    error,
    pagination,
    filters,
    statistics,
    handleFilterChange,
    handlePageChange,
    handleEditUser,
    refetch
  };
};

export default useUserManagement;