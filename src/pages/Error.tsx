import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';
import ErrorIllustration from '../components/error/ErrorIllustration';

interface ErrorPageProps {
  code?: number;
  message?: string;
  type?: '404' | '500' | 'offline';
}

const getErrorContent = (error: any): ErrorPageProps => {
  if (error?.status === 404 || error?.message?.includes('404')) {
    return {
      code: 404,
      message: "The page you're looking for doesn't exist or has been moved.",
      type: '404'
    };
  }

  if (error?.message?.includes('offline') || error?.message?.includes('network')) {
    return {
      code: 0,
      message: 'Please check your internet connection and try again.',
      type: 'offline'
    };
  }

  return {
    code: 500,
    message: 'Something went wrong. Please try again later.',
    type: '500'
  };
};

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const { code, message, type } = getErrorContent(error);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <ErrorIllustration type={type} />
        
        {code && (
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {code}
          </h1>
        )}
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {type === '404' ? 'Page Not Found' : type === 'offline' ? 'No Connection' : 'Error'}
        </h2>
        
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors w-full sm:w-auto"
          >
            Go Back
          </button>
          <Link
            to="/"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            Back to Home
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Need Help?
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link to="/contact" className="text-blue-600 hover:text-blue-800">
              Contact Support
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link to="/services" className="text-blue-600 hover:text-blue-800">
              Our Services
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link to="/publications" className="text-blue-600 hover:text-blue-800">
              Browse Publications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 