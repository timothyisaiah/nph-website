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
      {/* Hero Section */}
      <div className="relative z-10 flex-grow">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${images.hero.url})` }}
        />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-8">
              <img 
                src={companyLogo}
                alt="NPH Solutions Logo" 
                className="w-24 h-24 object-contain rounded-full shadow-lg"
              />
              <div className="ml-4 text-left">
                <h2 className="text-2xl font-bold text-gray-800">Narratives of Public Health Solutions LTD</h2>
                <p className="text-gray-600">Transforming Healthcare Through Data</p>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
              Visualizing Public Health<br />in Uganda
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mb-8">
              Explore key health indicators through an interactive global lens. Click on any indicator to dive deeper into the data.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/data')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Explore All Data
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Globe Container */}
      <div className="absolute inset-0">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-red-700 max-w-md text-center">
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
          <GlobeVisualization onError={setError} onIndicatorSelect={handleIndicatorSelect} />
        )}
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent opacity-75 pointer-events-none" />

      {/* Featured Images Section */}
      <div className="relative z-10 mt-[600px] bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={images.research.url} alt={images.research.alt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Research Excellence</h3>
                <p className="text-gray-600">Leading the way in public health research and analysis.</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={images.community.url} alt={images.community.alt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
                <p className="text-gray-600">Making a difference in communities across Uganda.</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img src={images.dataAnalysis.url} alt={images.dataAnalysis.alt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Data-Driven Insights</h3>
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
