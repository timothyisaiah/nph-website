import React from 'react';
import PageLayout from '../components/common/PageLayout';
import ThematicBlock from '../components/thematic/ThematicBlock';
import { images } from '../assets/images';

const thematicAreas = [
  {
    title: 'Health Equity and the Social Determinants of Health',
    description: 'We explore how health and disease are shaped by structural determinants operating across historical, social, economic, and political contexts. Guided by a political economy of health framework and ecosocial theory, we analyse how systems of power that are rooted in colonial legacies, global trade regimes, and class, race, and gender hierarchies intersect with governance systems, public policies, and daily living conditions to shape health outcomes. Our work focuses on mapping pathways of health inequities and promoting intersectoral strategies for advancing health equity and addressing the root causes of injustice in health.',
    image: images.community.url,
    imageAlt: images.community.alt
  },
  {
    title: 'Health and Environment',
    description: 'Using a political ecology of health perspective, we examine the complex interplay between environmental degradation and public health. We analyse how industrialization, agribusiness, extractive economies, and climate change degrade ecosystems and produce adverse health outcomes ranging from respiratory and waterborne illnesses to displacement and food insecurity. Our work supports integrated environmental health responses, including regulatory frameworks, urban resilience planning, and environmental justice movements, while promoting sustainable and equitable development.',
    image: images.healthAndEnvironment.url,
    imageAlt: images.globalHealth.alt
  },
  {
    title: 'Globalization and Health',
    description: 'We investigate the health implications of neoliberal globalization, focusing on how financial liberalization, structural adjustment, and austerity measures have impacted health systems particularly in low- and middle-income countries. Our analysis covers the role of international trade regimes, corporate influence, and illicit financial flows in shaping global health policy, health equity, and labour conditions. We also explore grassroots and state-level resistance to health inequities exacerbated by global economic policies, highlighting pathways for reclaiming health as a public good.',
    image: images.dataAnalysis.url,
    imageAlt: images.dataAnalysis.alt
  },
  {
    title: 'Understanding and Organizing Health Care Systems',
    description: 'Our work critically examines health care systems and reform trajectories from universal and primary health care models to market-oriented systems. We analyse core elements including financing, governance, service delivery, human resources, and access to essential medicines. Through case studies, we offer comparative insights into policy innovations that prioritize equity, access, affordability, and quality. We also address emerging challenges such as health workforce migration, commercialization of care, and pharmaceutical industry influence.',
    image: images.healthSystems.url,
    imageAlt: images.healthSystems.alt
  },
  {
    title: 'Political Economy of Health and Development',
    description: 'We apply a critical political economy lens to interrogate dominant development paradigms and their impact on public health. We analyse the historical and structural drivers of health improvements, challenging simplistic biomedical and economic growth narratives. Our work addresses the politics of aid, donor-recipient dynamics, and the contradictions within development frameworks such as the Sustainable Development Goals. We advocate for governance reforms that resist corporate capture and advance health justice through rights-based, redistributive, and decolonial approaches to development.',
    image: images.politicalEconomy.url,
    imageAlt: images.healthPolicy.alt
  },
  {
    title: 'Epidemiologic Profiles of Global Health and Disease',
    description: 'Moving beyond conventional dichotomy of communicable versus noncommunicable diseases, we analyse a typology of disease grounded in political and economic contexts. This covers diseases of marginalization and deprivation, diseases of modernization and labour, diseases at the intersection of marginalization and modernization, and diseases arising from global systemic shifts. We examine population health patterns across the life course and across diverse identity groups, including women, persons with disabilities and Indigenous populations. This approach reveals the structural underpinnings of morbidity and mortality and guides equitable public health responses.',
    image: images.publicHealthResearch.url,
    imageAlt: images.publicHealthResearch.alt
  }
];

const ThematicAreas: React.FC = () => {
  return (
    <PageLayout
      title="Thematic Areas of Work"
      intro="Our work encompasses six critical thematic areas that address the complex challenges facing public health in Africa and globally. Each area represents a key dimension of our comprehensive approach to improving population health outcomes."
      bgImage={images.research.url}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {thematicAreas.map((area, index) => (
          <ThematicBlock
            key={index}
            title={area.title}
            description={area.description}
            image={area.image}
            imageAlt={area.imageAlt}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default ThematicAreas;