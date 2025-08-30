import React from 'react';

interface StaticGlobeFallbackProps {
  width?: number;
  height?: number;
  className?: string;
}

const StaticGlobeFallback: React.FC<StaticGlobeFallbackProps> = ({
  width = 800,
  height = 600,
  className = ''
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Globe</h3>
        <p className="text-sm text-gray-600">Loading 3D visualization...</p>
      </div>
    </div>
  );
};

export default StaticGlobeFallback;
