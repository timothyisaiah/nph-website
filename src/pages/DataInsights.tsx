import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { images } from '../assets/images';
import { dataBriefs, type DataBrief } from '../data/dataBriefs';

const DataInsights: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'briefs' | 'visualization'>('briefs');



  const handleReadFullBrief = (brief: DataBrief) => {
    navigate(`/data-brief/${brief.id}`);
  };

  return (
    <PageLayout
      title="Data Insights"
      intro="Health data enhances the ability to advocate for or enact needed changes to health policies and services. Explore our data briefs and interactive visualizations to gain insights into public health trends and patterns."
      bgImage={images.dataAnalysis.url}
    >
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('briefs')}
            className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
              activeTab === 'briefs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Data Briefs
          </button>
          <button
            onClick={() => setActiveTab('visualization')}
            className={`px-6 py-3 font-semibold text-lg transition-colors duration-200 ${
              activeTab === 'visualization'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Data Visualization
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'briefs' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">About Data Briefs</h3>
              <p className="text-blue-700">
                Our data briefs provide concise, evidence-based insights into key public health indicators and trends. 
                Each brief is designed to inform policy decisions and program planning with actionable data-driven recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              {dataBriefs
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((brief) => (
                <div 
                  key={brief.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full cursor-pointer"
                  onClick={() => handleReadFullBrief(brief)}
                >
                  <div className="flex flex-col h-full">
                    {/* Chart Image Section - Full width, corner to corner */}
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={brief.chartImage} 
                        alt={brief.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content Section - Full width below image */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600 font-medium">{brief.date} | {brief.category}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                        {brief.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {brief.excerpt.length > 150 
                          ? `${brief.excerpt.substring(0, 150)}...` 
                          : brief.excerpt
                        }
                      </p>
                      
                      <div className="text-blue-600 font-medium text-sm flex items-center">
                        Read more...
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}



        {activeTab === 'visualization' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Interactive Data Visualization</h3>
              <p className="text-green-700">
                Explore interactive visualizations powered by STATcompiler data. Filter by country, indicator, and time period 
                to discover trends and patterns in public health data across Africa.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">STATcompiler Data Explorer</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Access comprehensive health and demographic data from the Demographic and Health Surveys (DHS) program. 
                  Our interactive platform allows you to explore indicators across countries and time periods.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-700">Countries</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
                  <div className="text-gray-700">Indicators</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
                  <div className="text-gray-700">Years of Data</div>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => navigate('/data-explorer')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Launch Data Explorer
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Powered by STATcompiler - Demographic and Health Surveys Program
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Popular Indicators</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Maternal and Child Health</li>
                  <li>• Family Planning</li>
                  <li>• HIV/AIDS Knowledge</li>
                  <li>• Nutrition Status</li>
                  <li>• Healthcare Access</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Data Sources</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Demographic and Health Surveys (DHS)</li>
                  <li>• Malaria Indicator Surveys (MIS)</li>
                  <li>• Service Provision Assessment (SPA)</li>
                  <li>• AIDS Indicator Surveys (AIS)</li>
                  <li>• Key Indicators Surveys (KIS)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DataInsights; 