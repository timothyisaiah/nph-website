import React, { Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Lazy load the heavy Globe page
const GlobePage = React.lazy(() => import('./Globe'));

const LazyGlobePage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Loading globe visualization...</p>
        </div>
      </div>
    }>
      <GlobePage />
    </Suspense>
  );
};

export default LazyGlobePage;
