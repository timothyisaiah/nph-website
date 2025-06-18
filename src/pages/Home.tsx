import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeVisualization from '../components/globe/GlobeVisualization';
import { useIndicator } from '../context/IndicatorContext';
import Footer from '../components/layout/Footer';
import { images } from '../assets/images';
import companyLogo from '../assets/Company-logo.jpg';

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSelectedIndicator } = useIndicator();

  const handleIndicatorSelect = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    navigate(`/data?indicator=${indicatorId}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Main Content Section with Globe */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start pt-16 md:pt-24 z-0">
          {/* Globe Container */}
          <div className="w-full md:w-1/2 aspect-square rounded-full overflow-hidden order-2 md:order-1">
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700 max-w-md text-center mx-4">
                  <p className="text-lg mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full">
                <GlobeVisualization onError={setError} onIndicatorSelect={handleIndicatorSelect} />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 order-1 md:order-2 md:pl-12">
            <div className="text-center md:text-left mb-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <img 
                  src={companyLogo}
                  alt="NPH Solutions Logo" 
                  className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-full shadow-lg"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Narratives of Public Health Solutions LTD</h2>
                  <p className="text-gray-600">Transforming Healthcare Through Data</p>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-800 leading-tight">
                Visualizing Public Health<br />in Uganda
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10">
                Explore key health indicators through an interactive global lens. Click on any indicator to dive deeper into the data.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('/data')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg transform hover:scale-105 duration-200"
                >
                  Explore All Data
                </button>
                <button 
                  onClick={() => navigate('/about')}
                  className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-lg transform hover:scale-105 duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Images Section */}
      <div className="relative z-10 bg-white py-16 md:py-24 mt-16 md:mt-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">Our Impact Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 md:h-56">
                <img src={images.research.url} alt={images.research.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Research Excellence</h3>
                <p className="text-gray-600">Leading the way in public health research and analysis.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 md:h-56">
                <img src={images.community.url} alt={images.community.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Community Impact</h3>
                <p className="text-gray-600">Making a difference in communities across Uganda.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 md:h-56">
                <img src={images.dataAnalysis.url} alt={images.dataAnalysis.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Data-Driven Insights</h3>
                <p className="text-gray-600">Transforming health data into actionable insights.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
