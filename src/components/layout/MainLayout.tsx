import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import { images } from '../../assets/images';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isServicesPage = location.pathname === '/services';

  // Preload only the first critical image for services page
  useEffect(() => {
    if (isServicesPage) {
      // Only preload the first image to avoid warnings
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = images.publicHealth.url;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
    }
  }, [isServicesPage]);

  return (
    <div className={`min-h-screen flex flex-col ${!isHomePage ? 'bg-gray-50' : ''}`}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className={`flex-grow ${!isHomePage ? 'container mx-auto px-4 py-8' : ''}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {!isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;