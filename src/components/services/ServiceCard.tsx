import React from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {icon && (
        <div className="mb-4">
          <img src={icon} alt={title} className="w-12 h-12" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard; 