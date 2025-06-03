import React from 'react';

interface PageLayoutProps {
  title: string;
  intro: string;
  children: React.ReactNode;
  bgImage?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, intro, children, bgImage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Background Image */}
      <div className="relative py-16 md:py-24 mb-12">
        {bgImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        )}
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">{intro}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 