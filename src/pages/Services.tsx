import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ServiceCard from '../components/services/ServiceCard';

const mockServices = [
  {
    title: 'Research & Analysis',
    description: 'Comprehensive public health research services including data collection, analysis, and evidence-based recommendations.',
    icon: '/icons/research.svg'
  },
  {
    title: 'Health System Consulting',
    description: 'Expert consultation on health system strengthening, policy development, and implementation strategies.',
    icon: '/icons/consulting.svg'
  },
  {
    title: 'Program Evaluation',
    description: 'Systematic assessment of health programs and interventions to measure impact and identify areas for improvement.',
    icon: '/icons/evaluation.svg'
  },
  {
    title: 'Capacity Building',
    description: 'Training and development programs for healthcare professionals and organizations to enhance service delivery.',
    icon: '/icons/training.svg'
  },
  {
    title: 'Data Management',
    description: 'Comprehensive health data management solutions including collection, analysis, and reporting systems.',
    icon: '/icons/data.svg'
  },
  {
    title: 'Community Engagement',
    description: 'Strategies and programs to promote community participation in health initiatives and decision-making.',
    icon: '/icons/community.svg'
  }
];

const Services: React.FC = () => {
  return (
    <PageLayout
      title="Our Services"
      intro="We offer a comprehensive range of public health services designed to support organizations and communities in achieving better health outcomes."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockServices.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Services; 