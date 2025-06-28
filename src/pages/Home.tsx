import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobeVisualization from '../components/globe/GlobeVisualization';
import { useIndicator } from '../context/IndicatorContext';
import Footer from '../components/layout/Footer';
import { images } from '../assets/images';
import companyLogo from '../assets/Company-logo.jpg';

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<any>(null);
  const navigate = useNavigate();
  const { setSelectedIndicator } = useIndicator();

  const handleIndicatorSelect = (indicatorId: string) => {
    setSelectedIndicator(indicatorId);
    navigate(`/data?indicator=${indicatorId}`);
  };

  const handleCountrySelect = (country: any) => {
    setSelectedCountry(country?.properties?.name || null);
    // In a real implementation, you would fetch country-specific data here
    setCountryData({
      indicators: Math.floor(Math.random() * 50) + 10, // Mock data
      surveys: Math.floor(Math.random() * 20) + 5,
      lastUpdated: new Date().toLocaleDateString()
    });
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
                <GlobeVisualization 
                  onError={setError} 
                  onIndicatorSelect={handleIndicatorSelect}
                  onCountrySelect={handleCountrySelect}
                />
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
                  className="w-30 h-30 md:w-24 md:h-24 object-contain rounded-lg shadow-lg"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">Narratives of Public Health Solutions LTD</h2>
                  <p className="text-gray-600">Unlocking health data for community and policy action</p>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 text-gray-800 leading-tight">
                Narratives of Public Health Solutions LTD
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Unlocking health data for community and policy action
              </p>
              
              {/* Services Bullet Points */}
              <div className="mb-10">
                <ul className="space-y-4 text-lg text-gray-700">
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium">Public health research</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium">Monitoring and evaluation of public health interventions</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium">Data systems and analytics</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-green-500 text-2xl font-bold mt-1">✓</span>
                    <span className="font-medium">Health promotion</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col gap-4 justify-center md:justify-start">
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

              {/* Dynamic Country Data Section */}
              {selectedCountry && countryData && (
                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    📊 DHS Data for {selectedCountry}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{countryData.indicators}</div>
                      <div className="text-gray-600">Health Indicators</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{countryData.surveys}</div>
                      <div className="text-gray-600">Surveys Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{countryData.lastUpdated}</div>
                      <div className="text-gray-600">Last Updated</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Click on indicators above to explore detailed data for {selectedCountry}
                  </p>
                </div>
              )}
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
