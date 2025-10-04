import React from 'react';
import { getFullName } from '../../utils/userFormatUtils';
import useAuth from '../../hooks/useAuth';

/**
 * Componente reutilizable para mostrar la información del usuario en el header
 * Incluye título, rol, nombre completo y email con estilos consistentes
 * 
 * @param {Object} props
 * @param {string|React.ReactNode} props.title - Título principal de la página (puede incluir JSX)
 * @param {string} [props.subtitle] - Subtítulo opcional
 * @param {boolean} [props.showEmail=true] - Si mostrar el email del usuario
 * @param {string} [props.className] - Clases CSS adicionales
 */
const UserInfoHeader = ({ 
  title, 
  subtitle,
  showEmail = true, 
  className = "" 
}) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return null;
  }

  const nombreCompleto = getFullName(usuario);
  const roleLabel = usuario?.role === 'admin' ? 'Administrador' : 'Dr.';

  return (
    <div className={className}>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary dark:text-blue-400">
        {title}
      </h1>
      
      {subtitle && (
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
      
      <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
        {roleLabel} - {nombreCompleto}
      </p>
      
      {showEmail && usuario?.email && (
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {usuario.email}
        </p>
      )}
    </div>
  );
};

export default UserInfoHeader;