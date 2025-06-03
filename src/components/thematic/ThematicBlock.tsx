import React from 'react';

interface ThematicBlockProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  objectives: string[];
}

const ThematicBlock: React.FC<ThematicBlockProps> = ({ 
  title, 
  description, 
  image, 
  imageAlt,
  objectives 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={imageAlt || title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" 
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {objectives.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Key Objectives:</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {objectives.map((objective, index) => (
                <li key={index} className="hover:text-gray-800 transition-colors duration-200">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThematicBlock; 