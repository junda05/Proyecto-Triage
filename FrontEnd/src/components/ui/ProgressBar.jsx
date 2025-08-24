import React from 'react';

const ProgressBar = ({ progress = 16.67, showShimmer = true }) => {
  return (
    <div className="welcome-progress-container mb-8">
      <div className="w-full">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-800 to-blue-600 rounded-full transition-all duration-500 ease-in-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {showShimmer && (
              <div 
                className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white via-transparent opacity-30"
                style={{
                  animation: 'shimmer 2s infinite',
                  transform: 'translateX(-100%)'
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>

    </div>
  );
};

export default ProgressBar;
