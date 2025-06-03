const Footer = () => {
    return (
      <footer className="bg-primary text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NPH Solutions</h3>
              <p className="text-gray-300">
                Providing innovative solutions for a better future.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">
                Email: info@nphsolutions.com<br />
                Phone: +1 234 567 890
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {/* Add social media links here */}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © {new Date().getFullYear()} NPH Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;