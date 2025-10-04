import React, { memo, useCallback } from 'react';
import { EditIcon, TrashIcon } from '../icons/Icons';
import StatusBadge from '../ui/StatusBadge';
import { 
  formatPhoneNumber, 
  getFullName, 
  formatDateTime, 
  getRoleBadgeConfig 
} from '../../utils/userFormatUtils';

/**
 * Componente optimizado para renderizar una fila de usuario en la tabla
 * Memoizado para evitar re-renders innecesarios cuando la lista de usuarios cambia
 */
const UserTableRow = memo(({ 
  user, 
  onEditUser, 
  onDeleteUser, 
  editLoading, 
  currentUser 
}) => {
  
  /**
   * Verificar si el usuario no puede ser eliminado (es el mismo usuario logueado)
   */
  const isDeleteDisabled = useCallback(() => {
    return currentUser && user.id === currentUser.id;
  }, [currentUser, user.id]);

  /**
   * Verificar si este usuario está en estado de loading para edición
   */
  const isEditLoading = useCallback(() => {
    return typeof editLoading === 'function' 
      ? editLoading(user.id) 
      : editLoading === user.id;
  }, [editLoading, user.id]);

  /**
   * Manejar click de editar - memoizado
   */
  const handleEditClick = useCallback(() => {
    onEditUser(user.id);
  }, [onEditUser, user.id]);

  /**
   * Manejar click de eliminar - memoizado
   */
  const handleDeleteClick = useCallback(() => {
    onDeleteUser(user);
  }, [onDeleteUser, user]);

  /**
   * Obtener configuración del badge de rol
   */
  const getRoleBadge = useCallback((role) => {
    const config = getRoleBadgeConfig(role);
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }, []);

  return (
    <tr 
      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
    >
      {/* Nombre completo */}
      <td className="py-3 px-3 text-left">
        <div className="flex flex-col">
          <span className="text-[0.9rem] font-medium text-gray-900 dark:text-gray-100 leading-tight">
            {getFullName(user)}
          </span>
          <span className="text-[0.8rem] text-gray-500 dark:text-gray-400 mt-0.5">
            {user.email}
          </span>
        </div>
      </td>

      {/* Usuario */}
      <td className="py-3 px-3 text-left">
        <span className="text-[0.9rem] font-medium text-gray-700 dark:text-gray-300">
          {user.username}
        </span>
      </td>

      {/* Rol */}
      <td className="py-3 px-3 text-center">
        {getRoleBadge(user.role)}
      </td>

      {/* Teléfono */}
      <td className="py-3 px-3 text-center">
        <span className="text-[0.9rem] text-gray-600 dark:text-gray-400">
          {formatPhoneNumber(user.phone_prefix, user.phone)}
        </span>
      </td>

      {/* Último Login */}
      <td className="py-3 px-3 text-center">
        <span className="text-[0.9rem] text-gray-500 dark:text-gray-400">
          {formatDateTime(user.last_login)}
        </span>
      </td>

      {/* Estado */}
      <td className="py-3 px-3 text-center">
        <div className="flex justify-center">
          <StatusBadge 
            status={user.is_active !== false ? 'Activo' : 'Inactivo'}
          />
        </div>
      </td>

      {/* Acciones */}
      <td className="py-3 px-3">
        <div className="flex justify-center space-x-2">
          <button
            onClick={handleEditClick}
            disabled={isEditLoading()}
            className="inline-flex items-center px-2 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 
                     hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                     rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar usuario"
          >
            <EditIcon className="h-4 w-4 mr-1" />
            {isEditLoading() ? 'Cargando...' : 'Editar'}
          </button>
          
          <button
            onClick={handleDeleteClick}
            disabled={isDeleteDisabled()}
            className={`inline-flex items-center px-2 py-1.5 text-sm font-medium 
                     rounded-md transition-colors duration-150
                     ${isDeleteDisabled() 
                       ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50' 
                       : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                     }`}
            title={isDeleteDisabled() ? "No puedes eliminarte a ti mismo" : "Eliminar usuario"}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
});

UserTableRow.displayName = 'UserTableRow';

export default UserTableRow;