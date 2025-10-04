import React from 'react';

// Colores consistentes con:
// - Template/home.html
// - Template/scripts.js getEsiColorClass
// - BackEnd/reportes/services.py COLORES_ESI
const ESIBadge = ({ esiLevel }) => {
  const esiColors = {
    1: 'bg-red-600 text-white', // Crítico (Resucitación)
    2: 'bg-orange-500 text-white', // Emergencia
    3: 'bg-yellow-400 text-white', // Urgencia
    4: 'bg-green-500 text-white', // Menor Urgencia
    5: 'bg-blue-500 text-white'  // No Urgente
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
