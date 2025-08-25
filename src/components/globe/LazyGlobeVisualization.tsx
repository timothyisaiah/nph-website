import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the heavy GlobeVisualization component
const GlobeVisualization = lazy(() => import('./GlobeVisualization'));

interface LazyGlobeVisualizationProps {
  onCountrySelect?: (country: { value: string; label: string }) => void;
  onError?: (error: string) => void;
  selectedCountry?: { value: string; label: string } | null;
  showCountryDialog?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const LazyGlobeVisualization: React.FC<LazyGlobeVisualizationProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-full min-h-[400px] bg-gray-50 rounded-lg">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-2 text-sm text-gray-600">Loading interactive globe...</p>
        </div>
      </div>
    }>
      <GlobeVisualization {...props} />
    </Suspense>
  );
};

export default LazyGlobeVisualization;
