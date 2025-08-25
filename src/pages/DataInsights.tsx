import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { images } from '../assets/images';

interface DataBrief {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  fullContent: string;
  chartImage: string;
  docxFile: string;
}

const DataInsights: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'briefs' | 'visualization'>('briefs');
  const [selectedBrief, setSelectedBrief] = useState<DataBrief | null>(null);
  const [showFullView, setShowFullView] = useState(false);

  const dataBriefs: DataBrief[] = [
         {
       id: 'mdd-east-africa-2025',
       title: 'Why millions of infants and young children in East Africa are vulnerable to malnutrition and its lifelong consequences',
       date: 'Aug 17, 2025',
       author: 'Joseph Kyanjo',
       category: 'Nutrition',
       excerpt: 'The first 1,000 days of life are a critical window for child growth, brain development, and future health. Nutrition during this period not only determines survival but also lays the foundation for learning and future productivity. Poor diets in infancy are strongly linked to stunting, micronutrient deficiencies, and illness.',
       fullContent: `The first 1,000 days of life are a critical window for child growth, brain development, and future health. Nutrition during this period not only determines survival but also lays the foundation for learning and future productivity. Poor diets in infancy are strongly linked to stunting, micronutrient deficiencies, and illness. To address this, WHO and UNICEF emphasize the importance of complementary feeding, the process of introducing foods and beverages alongside continued breastfeeding from six months onward. A central indicator is the Minimum Dietary Diversity (MDD), which requires children 6–23 months to consume at least five of eight defined food groups in a day for healthy growth and development.

Yet, the latest data from East Africa highlight a worrying picture. Even in Kenya, the best-performing country, only 37 percent of children aged 6–23 months achieve minimum dietary diversity. At the other end of the spectrum, the Democratic Republic of Congo records just 17 percent. This means that most children in the region are not receiving the diversity of foods essential for their growth and development, leaving millions vulnerable to malnutrition and its lifelong consequences.`,
       chartImage: '/databriefs/MDD in East Africa 17082025 chart.png',
       docxFile: 'MDD in East Africa 17082025 story.docx'
     },
    {
      id: 'maternal-health-uganda-2024',
      title: 'Maternal and Child Health Indicators in Uganda',
      date: 'Dec 15, 2024',
      author: 'Dr. Sarah Johnson',
      category: 'Maternal Health',
      excerpt: 'Comprehensive analysis of maternal and child health indicators across different regions of Uganda reveals significant disparities in healthcare access and outcomes. The study identifies key factors influencing maternal mortality rates and child survival, providing evidence-based recommendations for targeted interventions.',
      fullContent: `Comprehensive analysis of maternal and child health indicators across different regions of Uganda reveals significant disparities in healthcare access and outcomes. The study identifies key factors influencing maternal mortality rates and child survival, providing evidence-based recommendations for targeted interventions.

The research examined data from 45 districts across Uganda, analyzing indicators such as antenatal care attendance, skilled birth attendance, postnatal care utilization, and child immunization rates. Key findings include:

1. Regional Disparities: Northern and Eastern regions show lower maternal health indicators compared to Central and Western regions.

2. Healthcare Access: Distance to health facilities and transportation challenges significantly impact maternal health service utilization.

3. Socioeconomic Factors: Household wealth quintile and maternal education level are strongly associated with maternal and child health outcomes.

4. Quality of Care: While facility-based deliveries have increased, concerns remain about the quality of care provided.

5. Community Factors: Cultural beliefs and traditional practices continue to influence healthcare-seeking behavior.

The study recommends strengthening health systems, improving transportation infrastructure, enhancing community health worker programs, and implementing targeted interventions in underserved regions.`,
      chartImage: images.dataAnalysis.url,
      docxFile: 'Maternal_Health_Uganda_2024.docx'
    },
    {
      id: 'malaria-prevention-2024',
      title: 'Malaria Prevalence and Prevention Strategies',
      date: 'Nov 20, 2024',
      author: 'Dr. Michael Chen',
      category: 'Infectious Diseases',
      excerpt: 'Evaluation of malaria prevalence data and current prevention strategies in East African communities shows mixed results. While some regions have achieved significant reductions in malaria cases, others continue to face challenges with resistance and implementation gaps.',
      fullContent: `Evaluation of malaria prevalence data and current prevention strategies in East African communities shows mixed results. While some regions have achieved significant reductions in malaria cases, others continue to face challenges with resistance and implementation gaps.

The analysis covers data from 12 countries in East Africa, examining malaria prevalence rates, intervention coverage, and effectiveness of prevention strategies. Key findings include:

1. Geographic Variations: Malaria prevalence varies significantly across regions, with some areas showing remarkable progress while others lag behind.

2. Intervention Effectiveness: Insecticide-treated nets (ITNs) and indoor residual spraying (IRS) remain highly effective when properly implemented.

3. Resistance Challenges: Emerging resistance to certain insecticides and antimalarial drugs poses new challenges for control efforts.

4. Climate Factors: Seasonal variations and climate change impacts influence malaria transmission patterns.

5. Community Engagement: Successful programs demonstrate strong community involvement and local ownership.

Recommendations focus on strengthening surveillance systems, developing resistance management strategies, enhancing community-based interventions, and improving cross-border coordination.`,
      chartImage: images.dataAnalysis.url,
      docxFile: 'Malaria_Prevention_Strategies_2024.docx'
    },
    {
      id: 'nutrition-children-2024',
      title: 'Nutritional Status of Children Under Five',
      date: 'Oct 10, 2024',
      author: 'Dr. Emily Rodriguez',
      category: 'Child Health',
      excerpt: 'Assessment of nutritional indicators including stunting, wasting, and underweight among children under five years in rural communities reveals persistent challenges despite global progress. The study identifies key determinants and effective intervention strategies.',
      fullContent: `Assessment of nutritional indicators including stunting, wasting, and underweight among children under five years in rural communities reveals persistent challenges despite global progress. The study identifies key determinants and effective intervention strategies.

The research analyzed data from 8,500 households across 15 rural districts, examining nutritional status, feeding practices, and household characteristics. Key findings include:

1. Prevalence Rates: Stunting affects 32% of children under five, wasting 8%, and underweight 15% in the study areas.

2. Age Patterns: Nutritional status deteriorates significantly between 6-24 months, coinciding with complementary feeding introduction.

3. Feeding Practices: Inappropriate complementary feeding practices and poor dietary diversity contribute to malnutrition.

4. Household Factors: Food insecurity, low maternal education, and poor water and sanitation facilities are key determinants.

5. Seasonal Variations: Nutritional status worsens during lean seasons when food availability is limited.

The study recommends strengthening nutrition-sensitive agriculture, improving maternal and child health services, enhancing social protection programs, and implementing community-based nutrition education.`,
      chartImage: images.dataAnalysis.url,
      docxFile: 'Nutrition_Children_Under_Five_2024.docx'
    }
  ];

  const handleReadFullBrief = (brief: DataBrief) => {
    setSelectedBrief(brief);
    setShowFullView(true);
  };

  const handleDownloadDocx = (brief: DataBrief) => {
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = `/databriefs/${brief.docxFile}`;
    link.download = brief.docxFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const closeFullView = () => {
    setShowFullView(false);
    setSelectedBrief(null);
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
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {dataBriefs.map((brief) => (
                <div key={brief.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex">
                    {/* Chart Image Section (40% width) */}
                    <div className="w-2/5 p-4">
                      <img 
                        src={brief.chartImage} 
                        alt={brief.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Content Section (60% width) */}
                    <div className="w-3/5 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-600 font-medium">{brief.date} | {brief.category}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight">
                        {brief.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {brief.excerpt.length > 150 
                          ? `${brief.excerpt.substring(0, 150)}...` 
                          : brief.excerpt
                        }
                      </p>
                      
                      <button 
                        onClick={() => handleReadFullBrief(brief)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center"
                      >
                        Read more →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full View Modal */}
        {showFullView && selectedBrief && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-blue-600 font-medium">
                        {selectedBrief.date} | {selectedBrief.category}
                      </span>
                      <span className="text-sm text-gray-500">by {selectedBrief.author}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedBrief.title}</h2>
                  </div>
                  <button
                    onClick={closeFullView}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Chart Image */}
                <div className="mb-6">
                  <img 
                    src={selectedBrief.chartImage} 
                    alt={selectedBrief.title}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                </div>

                {/* Full Content */}
                <div className="prose max-w-none mb-6">
                  {selectedBrief.fullContent.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                                 {/* Download Button */}
                 <div className="flex justify-end pt-4 border-t border-gray-200">
                   <button
                     onClick={() => handleDownloadDocx(selectedBrief)}
                     className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                   >
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                     Download Full Report (.docx)
                   </button>
                 </div>
              </div>
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