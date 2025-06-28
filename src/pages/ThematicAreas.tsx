import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ThematicBlock from '../components/thematic/ThematicBlock';
import { images } from '../assets/images';

const thematicAreas = [
  {
    title: 'Health Equity and Social Determinants of Health',
    description: 'Addressing health disparities and inequities by examining the social, economic, and environmental factors that influence health outcomes across different populations and communities.',
    image: images.community.url,
    imageAlt: images.community.alt,
    objectives: [
      'Analyze social determinants affecting health outcomes',
      'Develop strategies to reduce health disparities',
      'Promote equitable access to healthcare services',
      'Advocate for policies that address health inequities'
    ]
  },
  {
    title: 'Health and Environment',
    description: 'Investigating the complex relationship between environmental factors and public health, including climate change impacts, environmental pollution, and sustainable health practices.',
    image: images.globalHealth.url,
    imageAlt: images.globalHealth.alt,
    objectives: [
      'Assess environmental health risks and impacts',
      'Develop climate-resilient health strategies',
      'Promote sustainable environmental practices',
      'Monitor environmental health indicators'
    ]
  },
  {
    title: 'Globalization and Health',
    description: 'Examining how global interconnectedness affects health systems, disease transmission, and health policy development across borders and cultures.',
    image: images.dataAnalysis.url,
    imageAlt: images.dataAnalysis.alt,
    objectives: [
      'Analyze global health trends and patterns',
      'Study cross-border health challenges',
      'Develop international health cooperation frameworks',
      'Address global health security concerns'
    ]
  },
  {
    title: 'Understanding and Organizing Health Care Systems',
    description: 'Comprehensive analysis of healthcare system structures, efficiency, accessibility, and effectiveness to improve service delivery and patient outcomes.',
    image: images.healthSystems.url,
    imageAlt: images.healthSystems.alt,
    objectives: [
      'Evaluate healthcare system performance',
      'Optimize healthcare delivery models',
      'Improve healthcare infrastructure planning',
      'Enhance healthcare quality and safety standards'
    ]
  },
  {
    title: 'Political Economy of Health and Development',
    description: 'Exploring the intersection of political systems, economic policies, and health outcomes to understand how governance and economic factors shape public health.',
    image: images.healthPolicy.url,
    imageAlt: images.healthPolicy.alt,
    objectives: [
      'Analyze health policy and economic relationships',
      'Study political influences on health outcomes',
      'Develop evidence-based health policy recommendations',
      'Advocate for health-in-all-policies approach'
    ]
  },
  {
    title: 'Epidemiologic Profiles of Global Health and Disease',
    description: 'Comprehensive epidemiological research to understand disease patterns, risk factors, and health trends across different populations and geographic regions.',
    image: images.publicHealthResearch.url,
    imageAlt: images.publicHealthResearch.alt,
    objectives: [
      'Conduct population-based health studies',
      'Analyze disease patterns and trends',
      'Identify risk factors and protective factors',
      'Develop evidence-based prevention strategies'
    ]
  }
];

const ThematicAreas: React.FC = () => {
  return (
    <PageLayout
      title="Thematic Areas of Work"
      intro="Our work encompasses six critical thematic areas that address the complex challenges facing public health in Africa and globally. Each area represents a key dimension of our comprehensive approach to improving population health outcomes."
      bgImage={images.research.url}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {thematicAreas.map((area, index) => (
          <ThematicBlock
            key={index}
            title={area.title}
            description={area.description}
            image={area.image}
            imageAlt={area.imageAlt}
            objectives={area.objectives}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default ThematicAreas;