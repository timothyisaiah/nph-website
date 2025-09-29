import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../components/common/PageLayout';
import { images } from '../assets/images';
import { dataBriefs, type DataBrief } from '../data/dataBriefs';

const DataBriefDetail: React.FC = () => {
  const { briefId } = useParams<{ briefId: string }>();
  const navigate = useNavigate();
  const [brief, setBrief] = useState<DataBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (briefId) {
      const foundBrief = dataBriefs.find(b => b.id === briefId);
      if (foundBrief) {
        setBrief(foundBrief);
      } else {
        // Redirect to data insights page if brief not found
        navigate('/data');
      }
    }
    setLoading(false);
  }, [briefId, navigate]);

  const handleDownloadDocx = (brief: DataBrief) => {
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = `/databriefs/${brief.docxFile}`;
    link.download = brief.docxFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackToDataInsights = () => {
    navigate('/data');
  };

  if (loading) {
    return (
      <PageLayout
        title="Loading..."
        intro=""
        bgImage={images.dataAnalysis.url}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data brief...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!brief) {
    return (
      <PageLayout
        title="Brief Not Found"
        intro="The requested data brief could not be found."
        bgImage={images.dataAnalysis.url}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Brief Not Found</h2>
            <p className="text-gray-600 mb-6">The requested data brief could not be found.</p>
            <button
              onClick={handleBackToDataInsights}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Data Insights
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={brief.title}
      intro={`${brief.category} • ${brief.date} • by ${brief.author}`}
      bgImage={images.dataAnalysis.url}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDataInsights}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Data Insights
          </button>
        </div>

        {/* Single Content Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Header Info */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              {brief.category}
            </span>
            <span className="text-sm text-gray-500">{brief.date}</span>
            <span className="text-sm text-gray-500">by {brief.author}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
            {brief.title}
          </h1>

          {/* Chart Image - Now comes first */}
          <div className="mb-8">
            {/* <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Visualization</h2> */}
            <div className="flex justify-center">
              <img 
                src={brief.chartImage} 
                alt={brief.title}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Summary/Excerpt */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {brief.excerpt}
            </p>
          </div>

          {/* Full Content */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Full Report</h2>
            <div className="prose max-w-none">
              {brief.fullContent.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Download Full Report</h3>
              <p className="text-blue-700">
                Get the complete report in Microsoft Word format for detailed analysis and sharing.
              </p>
            </div>
            <button
              onClick={() => handleDownloadDocx(brief)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download (.docx)
            </button>
          </div>
        </div>

        {/* Related Briefs */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Other Data Briefs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataBriefs
              .filter(b => b.id !== brief.id)
              .slice(0, 2)
              .map((relatedBrief) => (
                <div key={relatedBrief.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-blue-600 font-medium">{relatedBrief.category}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{relatedBrief.date}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {relatedBrief.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {relatedBrief.excerpt}
                  </p>
                  <button
                    onClick={() => navigate(`/data-brief/${relatedBrief.id}`)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                  >
                    Read more...
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DataBriefDetail;
