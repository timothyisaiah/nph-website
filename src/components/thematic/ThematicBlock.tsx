import React from 'react';
import type { ResponsiveImageAsset } from '../../assets/image-types';
import OptimizedImage from '../common/OptimizedImage';

interface ThematicBlockProps {
  title: string;
  description: string;
  image?: ResponsiveImageAsset;
}

const ThematicBlock: React.FC<ThematicBlockProps> = ({ 
  title, 
  description, 
  image
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full">
      <div className="flex flex-col lg:flex-row h-full">
        {image && (
          <div className="h-56 overflow-hidden lg:h-full lg:min-h-72 lg:w-1/3">
            <OptimizedImage
              asset={image}
              alt={image.alt || title}
              className="h-full w-full"
              imageClassName="transform transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 1023px) calc(100vw - 2rem), 17vw"
              loading="lazy"
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
