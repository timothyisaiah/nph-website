import React from 'react';
import { Link } from 'react-router-dom';
import type { ResponsiveImageAsset } from '../../assets/image-types';
import OptimizedImage from '../common/OptimizedImage';

interface ServiceCardProps {
  title: string;
  description: string;
  image: ResponsiveImageAsset;
  imageAlt: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  image,
  imageAlt,
  link
}) => {
  return (
    <Link to={link} className="block group">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 md:h-56 overflow-hidden">
          <OptimizedImage
            asset={image}
            alt={imageAlt}
            className="h-full w-full"
            imageClassName="transform transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) calc(100vw - 2rem), 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
