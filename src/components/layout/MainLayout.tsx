import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col ${!isHomePage ? 'bg-gray-50' : ''}`}>
      {/* Navigation */}
      <nav className={`${isHomePage ? 'absolute top-0 left-0 right-0 z-20 bg-white bg-opacity-90 backdrop-blur-sm' : 'bg-white shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-gray-800">
              NPH Solutions
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop menu */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link to="/thematic-areas" className="text-gray-600 hover:text-gray-900 transition-colors">Thematic Areas</Link>
              <Link to="/publications" className="text-gray-600 hover:text-gray-900 transition-colors">Publications</Link>
              <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <Link to="/data" className="text-gray-600 hover:text-gray-900 transition-colors">Data</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white py-4 px-2 rounded-lg mt-2 shadow-lg`}
          >
            <div className="flex flex-col space-y-3">
              <Link to="/" className="px-3 py-2 rounded hover:bg-gray-100">Home</Link>
              <Link to="/about" className="px-3 py-2 rounded hover:bg-gray-100">About</Link>
              <Link to="/thematic-areas" className="px-3 py-2 rounded hover:bg-gray-100">Thematic Areas</Link>
              <Link to="/publications" className="px-3 py-2 rounded hover:bg-gray-100">Publications</Link>
              <Link to="/services" className="px-3 py-2 rounded hover:bg-gray-100">Services</Link>
              <Link to="/blog" className="px-3 py-2 rounded hover:bg-gray-100">Blog</Link>
              <Link to="/data" className="px-3 py-2 rounded hover:bg-gray-100">Data</Link>
              <Link to="/contact" className="px-3 py-2 rounded hover:bg-gray-100">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

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