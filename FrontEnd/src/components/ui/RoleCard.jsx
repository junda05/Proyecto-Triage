import React from 'react';

const RoleCard = ({ 
  role, 
  title, 
  description, 
  icon, 
  onClick, 
  isSelected, 
  isVisible 
}) => {
  // Debug: Log de props recibidas
  console.log(`🎭 RoleCard [${role}] renderizado con props:`, {
    role,
    title,
    description,
    isSelected,
    isVisible,
    hasIcon: !!icon,
    hasOnClick: !!onClick
  });

  const handleClick = () => {
    console.log(`🔥 RoleCard [${role}] clickeado`);
    onClick(role);
  };

  // Clases CSS que coinciden exactamente con home.html
  const cardClasses = `
    role-card 
    bg-white dark:bg-gray-700 
    rounded-xl 
    shadow-md 
    p-6 
    cursor-pointer 
    border-2 
    transition-all 
    duration-300
    ${isSelected 
      ? 'border-primary dark:border-blue-400' 
      : 'border-transparent hover:border-primary dark:hover:border-blue-400'
    }
  `;

  console.log(`🎨 RoleCard [${role}] clases CSS:`, cardClasses.trim());

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      data-role={role}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex flex-col items-center">
        {/* Icono del rol */}
        <div className={`
          mb-4 
          p-4 
          rounded-full 
          bg-gray-100 dark:bg-gray-600 
          text-primary dark:text-blue-400
          transition-colors duration-300
        `}>
          {icon}
        </div>
        
        {/* Título del rol */}
        <h3 className={`
          text-xl 
          font-bold 
          mb-2 
          text-gray-900 dark:text-white
          transition-colors duration-300
        `}>
          {title}
        </h3>
        
        {/* Descripción del rol */}
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};

export default RoleCard;
