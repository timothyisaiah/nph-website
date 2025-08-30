import { images } from '../assets/images';

export interface DataBrief {
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

export const dataBriefs: DataBrief[] = [
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
