import React from 'react';

interface ThematicBlockProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

const ThematicBlock: React.FC<ThematicBlockProps> = ({ 
  title, 
  description, 
  image, 
  imageAlt
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
      <div className="flex flex-col lg:flex-row h-full">
        {image && (
          <div className="lg:w-1/3 lg:h-full overflow-hidden">
            <img 
              src={image} 
              alt={imageAlt || title} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
            />
          </div>
        )}
        <div className="lg:w-2/3 p-6 flex flex-col justify-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-tight">{title}</h3>
          <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ThematicBlock; 