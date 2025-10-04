import React, { memo, useCallback } from 'react';
import UserTableRow from './UserTableRow';

const UserTable = memo(({ users, onEditUser, onDeleteUser, editLoading, currentUser }) => {
  
  /**
   * Memoizar funciones para evitar re-renders innecesarios de UserTableRow
   */
  const memoizedOnEditUser = useCallback((userId) => {
    onEditUser(userId);
  }, [onEditUser]);

  const memoizedOnDeleteUser = useCallback((user) => {
    onDeleteUser(user);
  }, [onDeleteUser]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1200px] w-full table-fixed">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr className="border-b border-gray-200 dark:border-gray-600">
            <th className="w-48 text-left py-3 px-3 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              NOMBRE COMPLETO
            </th>
            <th className="w-28 text-left py-3 px-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              USUARIO
            </th>
            <th className="w-28 text-center py-3 px-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ROL
            </th>
            <th className="w-32 text-center py-3 px-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              TELÉFONO
            </th>
            <th className="w-36 text-center py-3 px-3 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ÚLTIMO LOGIN
            </th>
            <th className="w-24 text-center py-3 px-3 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ESTADO
            </th>
            <th className="w-36 text-center py-3 px-3 text-[0.8rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onEditUser={memoizedOnEditUser}
              onDeleteUser={memoizedOnDeleteUser}
              editLoading={editLoading}
              currentUser={currentUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});

UserTable.displayName = 'UserTable';

export default UserTable;