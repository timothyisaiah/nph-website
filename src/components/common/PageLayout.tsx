import React from 'react';

interface PageLayoutProps {
  title: string;
  intro: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, intro, children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">{intro}</p>
      <div className="space-y-8">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 