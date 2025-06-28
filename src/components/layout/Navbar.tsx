import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Thematic Areas', path: '/thematic-areas' },
    { name: 'Publications', path: '/publications' },
    { name: 'Our Services', path: '/services' },
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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-full"></div>
              <span className="ml-2 text-xl font-bold text-primary">NPH Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative group
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50 font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-600' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }
                  `}
                >
                  {item.name}
                  {/* Hover indicator line */}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-200
                      ${isActive ? 'opacity-0' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600"
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
        className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white shadow-lg border-t border-gray-100`}
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
                    ? 'text-blue-600 bg-blue-50 font-semibold border-l-4 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span className="flex items-center">
                  {item.name}
                  {isActive && (
                    <svg 
                      className="ml-2 h-4 w-4 text-blue-600" 
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
      <div className={`absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent transform transition-opacity duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`} />
    </nav>
  );
};

export default Navbar; 