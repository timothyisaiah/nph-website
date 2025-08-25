import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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