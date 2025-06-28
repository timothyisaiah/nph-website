import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import ServiceCard from '../components/services/ServiceCard';
import { images } from '../assets/images';

const services = [
  {
    title: 'Public Health Research',
    description: 'Comprehensive research services including epidemiological studies, health systems analysis, and evidence-based policy development. We conduct rigorous research to address critical public health challenges and inform decision-making processes.',
    detailedServices: [
      'Survey Design: Designing sampling strategies, questionnaires, and digital data collection systems for household, facility, and community surveys.',
      'Survey Implementation: Managing fieldwork, digital data capture, and quality assurance.',
      'Impact Evaluation Methodologies: Randomized trials, difference-in-differences, propensity-score matching and mixed-methods to assess intervention impact.',
      'Data Analysis & Reporting: Performing advanced quantitative and qualitative analyses, and translating results into clear, decision-oriented reports.'
    ],
    image: images.publicHealthResearch.url,
    imageAlt: images.publicHealthResearch.alt,
    link: '/thematic-areas'
  },
  {
    title: 'Monitoring & Evaluation',
    description: 'Monitoring and evaluation are an important element in providing knowledge and evidence to improve programmes, in determining whether your programme is achieving its desired results.',
    detailedServices: [
      'A monitoring and evaluation system.',
      'Standard Operating Procedures for Monitoring.',
      'Logframe.',
      'Theory of change.'
    ],
    image: images.monitoring.url,
    imageAlt: images.monitoring.alt,
    link: '/contact'
  },
  {
    title: 'Data Systems & Analytics',
    description: 'Advanced health data management, analysis, and visualization services. We develop robust data systems, conduct sophisticated analytics, and create actionable insights to support public health initiatives and policy development.',
    detailedServices: [
      'Geospatial mapping, early-warning and forecasting algorithms.',
      'Development of dashboards and Visualizations to support near real-time decision making.'
    ],
    image: images.dataAnalysis.url,
    imageAlt: images.dataAnalysis.alt,
    link: '/data'
  },
  {
    title: 'Health Promotion',
    description: 'Our public health promotion service is designed to empower communities, institutions, and policy makers with the tools and knowledge necessary to improve health outcomes across populations.',
    detailedServices: [
      'Behavioural change communication campaigns to promote healthy lifestyles.',
      'Community mobilization and engagement to identify health priorities and co-developing solutions that are sustainable and locally owned.',
      'Public health campaigns such as vaccination drives, maternal and child health, non-communicable diseases (NCDs) and communicable diseases such as malaria, HIV/AIDS, and TB.',
      'Policy advocacy and social accountability to influence public health policy while enhancing citizen voice and accountability in health service delivery.',
      'Health promotion materials development such as toolkits and multimedia content to support campaigns and outreach efforts.'
    ],
    image: images.community.url,
    imageAlt: images.community.alt,
    link: '/contact'
  }
];

const Services: React.FC = () => {
  return (
    <PageLayout
      title="Our Services"
      intro="We provide specialized public health services that combine research excellence, data-driven insights, and community engagement to address complex health challenges and improve population health outcomes across Africa."
      bgImage={images.services.url}
    >
      <div className="space-y-12">
        {services.map((service, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-64 lg:h-full">
                <img
                  src={service.image}
                  alt={service.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Content Section */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                
                {service.detailedServices && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Our Services Include:</h4>
                    <ul className="space-y-2">
                      {service.detailedServices.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <span className="text-blue-600 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-6">
                  <Link
                    to={service.link}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Learn More
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default Services; 