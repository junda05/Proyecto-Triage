import React from 'react';

const ESIBadge = ({ esiLevel }) => {
  const esiColors = {
    1: 'bg-red-500 text-white', // Crítico
    2: 'bg-orange-500 text-white', // Urgente
    3: 'bg-yellow-500 text-white', // Menos urgente
    4: 'bg-green-500 text-white', // Semi-urgente
    5: 'bg-blue-500 text-white'  // No urgente
  };

  const colorClass = esiColors[esiLevel] || 'bg-gray-500 text-white';

  return (
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center 
      text-sm font-bold ${colorClass}
    `}>
      {esiLevel}
    </div>
  );
};

export default ESIBadge;
