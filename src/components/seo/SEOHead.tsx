import { Helmet } from 'react-helmet-async';

interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: any;
  article?: ArticleMeta;
}

const SITE_ORIGIN = 'https://nph-solutions.com';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/src/assets/Company-logo.jpg`;

const toAbsoluteUrl = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${SITE_ORIGIN}${value}`;
  return `${SITE_ORIGIN}/${value}`;
};

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "NPH Solutions - Public Health Research & Data Analytics",
  description = "NPH Solutions provides comprehensive public health research, monitoring & evaluation, data systems, and health promotion services. Unlocking health data for community and policy action across Africa.",
  keywords = "public health, health research, data analytics, monitoring evaluation, health promotion, Africa health, DHS data, health systems, epidemiology, health policy",
  image,
  url = "/",
  type = "website",
  structuredData,
  article
}) => {
  const fullTitle = title.includes("NPH Solutions") ? title : `${title} | NPH Solutions`;
  const fullUrl = url.startsWith("http") ? url : `${SITE_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
  const fullImage = toAbsoluteUrl(image, DEFAULT_IMAGE);

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
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="NPH Solutions" />

      {/* Article-specific Open Graph (only when type="article") */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}
      {type === 'article' && article?.section && (
        <meta property="article:section" content={article.section} />
      )}
      {type === 'article' && article?.tags && article.tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

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
