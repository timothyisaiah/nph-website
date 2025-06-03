import React from 'react';
import PageLayout from '../components/common/PageLayout';
import PublicationCard from '../components/publications/PublicationCard';

const mockPublications = [
  {
    title: 'Impact of Community Health Workers on Public Health Outcomes',
    authors: ['John Smith', 'Sarah Johnson', 'Michael Brown'],
    abstract: 'This comprehensive study examines the role and impact of community health workers in improving public health outcomes across various settings.',
    publishDate: 'March 2024',
    type: 'research',
    downloadUrl: '/publications/chw-impact-2024.pdf'
  },
  {
    title: 'Annual Health Systems Performance Report',
    authors: ['NPH Research Team'],
    abstract: 'A detailed analysis of health system performance metrics, challenges, and recommendations for improvement in the region.',
    publishDate: 'January 2024',
    type: 'report',
    downloadUrl: '/publications/annual-report-2024.pdf'
  },
  {
    title: 'Innovative Approaches to Healthcare Delivery in Rural Areas',
    authors: ['Emily Wilson', 'David Chen'],
    abstract: 'This article explores innovative strategies and technologies being used to improve healthcare delivery in rural and remote areas.',
    publishDate: 'February 2024',
    type: 'article',
    downloadUrl: '/publications/rural-healthcare-2024.pdf'
  }
];

const Publications: React.FC = () => {
  return (
    <PageLayout
      title="Publications"
      intro="Explore our collection of research papers, reports, and articles that contribute to the advancement of public health knowledge and practice."
    >
      <div className="space-y-6">
        {mockPublications.map((publication, index) => (
          <PublicationCard
            key={index}
            title={publication.title}
            authors={publication.authors}
            abstract={publication.abstract}
            publishDate={publication.publishDate}
            type={publication.type as 'report' | 'article' | 'research'}
            downloadUrl={publication.downloadUrl}
          />
        ))}
      </div>
    </PageLayout>
  );
};

export default Publications;