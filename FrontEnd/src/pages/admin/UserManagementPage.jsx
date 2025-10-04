import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/ui/PageContainer';
import UserAvatar from '../../components/ui/UserAvatar';
import UserInfoHeader from '../../components/ui/UserInfoHeader';
import UserTable from '../../components/Admin/UserTable';
import UserEditModal from '../../components/Admin/UserEditModal';
import UserCreateModal from '../../components/Admin/UserCreateModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import AdminFilters from '../../components/Admin/AdminFilters';
import Pagination from '../../components/ui/Pagination';
import NotificationContainer from '../../components/Common/NotificationContainer';

import { getFullName } from '../../utils/userFormatUtils';
import authService from '../../services/api/authService';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';
import useUserManagement from '../../hooks/useUserManagement';
import useLoadingStates from '../../hooks/useLoadingStates';
import useModalManager from '../../hooks/useModalManager';
import useAvatarMenu from '../../hooks/useAvatarMenu';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { mostrarExito, mostrarError, notificaciones, eliminarNotificacion: cerrarNotificacion } = useNotificaciones();
  
  const {
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
  } = useUserManagement();

  // Hook unificado para estados de loading
  const { setLoading, isLoading } = useLoadingStates();
  
  // Hook unificado para manejo de modales
  const { 
    openModal, 
    closeModal, 
    isModalOpen, 
    getModalData 
  } = useModalManager(['edit', 'create', 'delete']);

  // Hook reutilizable para manejar acciones del menú del avatar
  const { handleMenuClick } = useAvatarMenu({ refetch });

  /**
   * Manejar apertura del modal de edición
   */
  const onEditUser = async (userId) => {
    // Encontrar el usuario en la lista
    const user = users.find(u => u.id === userId) || 
                  allUsersData?.find(u => u.id === userId);
    
    if (user) {
      openModal('edit', user);
    } else {
      mostrarError('Usuario no encontrado', {
        titulo: 'Error'
      });
    }
  };

  /**
   * Manejar guardado del usuario editado
   */
  const handleSaveUser = async (userData) => {
    const selectedUser = getModalData('edit');
    if (!selectedUser) return;

    setLoading(`edit-${selectedUser.id}`, true, selectedUser);

    try {
      const result = await handleEditUser(selectedUser.id, userData);
      
      if (result.success) {
        mostrarExito('Usuario actualizado correctamente', {
          titulo: 'Actualización exitosa'
        });
        handleCloseEditModal();
      } else {
        mostrarError(result.error || 'Error al actualizar usuario', {
          titulo: 'Error al actualizar'
        });
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      mostrarError(error.message || 'Error inesperado al actualizar usuario', {
        titulo: 'Error inesperado'
      });
    } finally {
      setLoading(`edit-${selectedUser.id}`, false);
    }
  };

  /**
   * Manejar apertura del modal de creación
   */
  const handleOpenCreateModal = () => {
    openModal('create');
  };

  /**
   * Manejar cierre del modal de creación
   */
  const handleCloseCreateModal = () => {
    closeModal('create');
    setLoading('create', false);
  };

  /**
   * Manejar creación de nuevo usuario
   */
  const handleCreateUser = async (userData) => {
    setLoading('create', true);

    try {
      const nuevoUsuario = await authService.crearUsuario(userData);
      
      if (nuevoUsuario) {
        mostrarExito('Usuario creado correctamente', {
          titulo: 'Creación exitosa'
        });
        
        // Refrescar la lista de usuarios
        refetch();
        
        // Cerrar el modal inmediatamente - la limpieza se hace en el modal
        handleCloseCreateModal();
        
        // Retornar éxito para que el modal pueda limpiar el formulario
        return Promise.resolve();
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      mostrarError(error.message || 'Error inesperado al crear usuario', {
        titulo: 'Error al crear usuario'
      });
      // Rechazar la promesa para mantener el formulario con los datos
      throw error;
    } finally {
      setLoading('create', false);
    }
  };

  /**
   * Manejar cierre del modal de edición
   */
  const handleCloseEditModal = () => {
    closeModal('edit');
    setLoading('edit', false);
  };

  /**
   * Manejar solicitud de eliminación de usuario
   */
  const onDeleteUser = (user) => {
    openModal('delete', user);
  };

  /**
   * Manejar confirmación de eliminación de usuario
   */
  const handleConfirmDelete = async () => {
    const userToDelete = getModalData('delete');
    if (!userToDelete) return;

    setLoading('delete', true, userToDelete);

    try {
      await authService.eliminarUsuario(userToDelete.id);
      
      mostrarExito(`Usuario "${getFullName(userToDelete)}" eliminado correctamente`, {
        titulo: 'Usuario eliminado'
      });
      
      handleCloseDeleteModal();
      
      // Refrescar la lista de usuarios
      refetch();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      mostrarError(error.message || 'Error inesperado al eliminar usuario', {
        titulo: 'Error al eliminar usuario'
      });
    } finally {
      setLoading('delete', false);
    }
  };

  /**
   * Manejar cierre del modal de confirmación de eliminación
   */
  const handleCloseDeleteModal = () => {
    closeModal('delete');
    setLoading('delete', false);
  };

  // Obtener nombre completo del usuario para mostrar usando utilidad DRY
  const nombreCompleto = getFullName(usuario);

  // Si no hay usuario autenticado, mostrar error de autenticación
  if (!usuario) {
    mostrarError('No se pudo obtener la información del usuario', {
      titulo: 'Error de Autenticación'
    });
    navigate('/login');
    return null;
  }

  return (
    <>
      <NotificationContainer 
        notificaciones={notificaciones}
        onClose={cerrarNotificacion}
      />
      <div className="w-full max-w-[1400px] mx-auto">
      <PageContainer variant="form" className="!p-8">
        {/* Header de Administración */}
        <div className="flex justify-between items-start mb-6">
          <UserInfoHeader title="Administración de Usuarios" />
          <UserAvatar 
            userName={nombreCompleto} 
            onMenuClick={handleMenuClick}
            mostrarExito={mostrarExito}
            mostrarError={mostrarError}
          />
        </div>

        {/* Línea separadora */}
        <div className="w-4/4 h-px bg-gray-200 dark:bg-gray-600 mb-8"></div>

        {/* Filtros de usuarios unificados */}
        <AdminFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          searchPlaceholder="Nombre, usuario o email..."
          totalItems={statistics.total}
          itemsLabel="usuarios"
          showCreateButton={true}
          createButtonText="Crear Usuario"
          onCreateClick={handleOpenCreateModal}
        />

        {/* Tabla de Usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden min-h-[600px] flex flex-col">
          {/* Mostrar error si existe */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {error}
              </p>
              <button 
                onClick={refetch}
                className="mt-2 text-sm text-red-700 dark:text-red-300 underline hover:no-underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Indicador de carga */}
          {loading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Cargando usuarios...
                </span>
              </div>
            </div>
          )}

          {/* Tabla o mensaje vacío */}
          {!loading && (
            <>
              {users.length > 0 ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <UserTable 
                      users={users}
                      onEditUser={onEditUser}
                      onDeleteUser={onDeleteUser}
                      editLoading={(userId) => isLoading(`edit-${userId}`)}
                      currentUser={usuario}
                    />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600">
                    <Pagination 
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.totalItems}
                      pageSize={pagination.pageSize}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {error ? 'Error al cargar los datos' : 'No se encontraron usuarios con los filtros aplicados.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Estadísticas rápidas */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Usuarios</h3>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{statistics.total}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600 dark:text-green-400">Activos</h3>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {statistics.activos}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">Administradores</h3>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {statistics.administradores}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Estándar</h3>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {statistics.estandar}
            </p>
          </div>
        </div>
      </PageContainer>

      {/* Modal de edición */}
      {isModalOpen('edit') && getModalData('edit') && (
        <UserEditModal
          isOpen={isModalOpen('edit')}
          user={getModalData('edit')}
          onSave={handleSaveUser}
          onClose={handleCloseEditModal}
          loading={isLoading(`edit-${getModalData('edit').id}`)}
        />
      )}

      {/* Modal de creación */}
      <UserCreateModal
        isOpen={isModalOpen('create')}
        onSave={handleCreateUser}
        onClose={handleCloseCreateModal}
        loading={isLoading('create')}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={isModalOpen('delete')}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message={
          getModalData('delete') ? 
          `¿Estás seguro que deseas eliminar al usuario "${getFullName(getModalData('delete'))}"? Esta acción no se puede deshacer.` :
          '¿Estás seguro que deseas eliminar este usuario?'
        }
        confirmText={isLoading('delete') ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        variant="danger"
      />
      </div>
    </>
  );
};

export default UserManagementPage;