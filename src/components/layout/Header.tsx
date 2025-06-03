import { Link } from 'react-router-dom';

const Header = () => {
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Thematic Areas', path: '/thematic-areas' },
    { name: 'Publications', path: '/publications' },
    { name: 'Our Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-primary text-white">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            NPH Solutions
          </Link>
          <div className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-gray-300 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
          {/* Add mobile menu button and dropdown here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;