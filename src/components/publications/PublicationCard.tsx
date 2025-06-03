import React from 'react';

interface PublicationCardProps {
  title: string;
  authors: string[];
  abstract: string;
  publishDate: string;
  type: 'report' | 'article' | 'research';
  downloadUrl?: string;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  title,
  authors,
  abstract,
  publishDate,
  type,
  downloadUrl,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 capitalize">
          {type}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        {authors.join(', ')} • {publishDate}
      </p>
      <p className="text-gray-600 mb-4 line-clamp-3">{abstract}</p>
      {downloadUrl && (
        <a
          href={downloadUrl}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          Download PDF
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </a>
      )}
    </div>
  );
};

export default PublicationCard; 