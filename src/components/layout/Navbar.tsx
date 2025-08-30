import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import companyLogo from '../../assets/Company-logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Thematic Areas', path: '/thematic-areas' },
    { name: 'Publications', path: '/publications' },
    { name: 'Services', path: '/services' },
    // { name: 'Blog', path: '/blog' },
    { name: 'Data Insights', path: '/data' },
    { name: 'Contact', path: '/contact' },
  ];

  // Check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${isHomePage ? 'absolute top-0 left-0 right-0 z-50' : 'relative'} w-full transition-all duration-300 bg-gray-900 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={companyLogo}
                alt="NPH Solutions Logo" 
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white">NPH Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group
                    ${isActive 
                      ? 'text-green-400 bg-gray-800 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-green-400' 
                      : 'text-white hover:text-green-400 hover:bg-gray-800'
                    }
                  `}
                >
                  {item.name}
                  {/* Hover indicator line */}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform origin-left transition-transform duration-200
                      ${isActive ? 'opacity-0' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-400"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-gray-900 shadow-lg border-t border-gray-700`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const isActive = isActivePath(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-green-400 bg-gray-800 font-semibold border-l-4 border-green-400'
                    : 'text-white hover:text-green-400 hover:bg-gray-800 hover:border-l-4 hover:border-green-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  {item.name}
                  {isActive && (
                    <svg 
                      className="ml-2 h-4 w-4 text-green-400" 
                      fill="none" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom border for the entire navbar */}
      <div className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent transform transition-opacity duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`} />
    </nav>
  );
};

export default Navbar; 