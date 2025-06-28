import React, { useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import { images } from '../assets/images';

const DataInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'briefs' | 'visualization'>('briefs');

  const dataBriefs = [
    {
      title: 'Maternal and Child Health Indicators in Uganda',
      date: 'December 2024',
      description: 'Analysis of key maternal and child health indicators across different regions of Uganda, highlighting disparities and opportunities for intervention.',
      tags: ['Maternal Health', 'Child Health', 'Uganda']
    },
    {
      title: 'Malaria Prevalence and Prevention Strategies',
      date: 'November 2024',
      description: 'Comprehensive review of malaria prevalence data and evaluation of current prevention strategies in East African communities.',
      tags: ['Malaria', 'Prevention', 'East Africa']
    },
    {
      title: 'Nutritional Status of Children Under Five',
      date: 'October 2024',
      description: 'Assessment of nutritional indicators including stunting, wasting, and underweight among children under five years in rural communities.',
      tags: ['Nutrition', 'Child Health', 'Rural Health']
    },
    {
      title: 'Healthcare Access and Utilization Patterns',
      date: 'September 2024',
      description: 'Analysis of healthcare access patterns and utilization rates across different socioeconomic groups and geographic regions.',
      tags: ['Healthcare Access', 'Health Systems', 'Equity']
    }
  ];

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataBriefs.map((brief, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500">{brief.date}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">New</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{brief.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{brief.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {brief.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                      Read Full Brief →
                    </button>
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
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
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