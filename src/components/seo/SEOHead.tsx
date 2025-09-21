import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "NPH Solutions - Public Health Research & Data Analytics",
  description = "NPH Solutions provides comprehensive public health research, monitoring & evaluation, data systems, and health promotion services. Unlocking health data for community and policy action across Africa.",
  keywords = "public health, health research, data analytics, monitoring evaluation, health promotion, Africa health, DHS data, health systems, epidemiology, health policy",
  image = "https://nph-solutions.com/src/assets/Company-logo.jpg",
  url = "https://nph-solutions.com",
  type = "website",
  structuredData
}) => {
  const fullTitle = title.includes("NPH Solutions") ? title : `${title} | NPH Solutions`;
  const fullUrl = url.startsWith("http") ? url : `https://nph-solutions.com${url}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="NPH Solutions" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
