import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ThematicBlock from '../components/thematic/ThematicBlock';

const mockThematicAreas = [
  {
    title: 'Public Health Research',
    description: 'Conducting comprehensive research to address critical public health challenges and inform evidence-based policies.',
    image: '/images/research.jpg',
    objectives: [
      'Develop innovative research methodologies',
      'Analyze health trends and patterns',
      'Generate evidence for policy recommendations'
    ]
  },
  {
    title: 'Health Systems Strengthening',
    description: 'Supporting the development of robust and resilient health systems through strategic interventions and capacity building.',
    image: '/images/health-systems.jpg',
    objectives: [
      'Improve healthcare delivery systems',
      'Enhance healthcare workforce capacity',
      'Optimize resource allocation'
    ]
  },
  {
    title: 'Community Health Initiatives',
    description: 'Implementing community-based programs to promote health awareness and preventive care measures.',
    image: '/images/community.jpg',
    objectives: [
      'Develop community health programs',
      'Promote health education',
      'Foster community engagement'
    ]
  }
];

const ThematicAreas: React.FC = () => {
  return (
    <PageLayout
      title="Thematic Areas of Work"
      intro="Our work focuses on key thematic areas that address critical challenges in public health and contribute to sustainable development goals."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockThematicAreas.map((area, index) => (
          <ThematicBlock
            key={index}
            title={area.title}
            description={area.description}
            image={area.image}
            objectives={area.objectives}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default ThematicAreas;