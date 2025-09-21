import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './routes';
import { IndicatorProvider } from './context/IndicatorContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <IndicatorProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </IndicatorProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;