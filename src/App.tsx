import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { router } from './routes';
import { IndicatorProvider } from './context/IndicatorContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <IndicatorProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </IndicatorProvider>
    </ErrorBoundary>
  );
}

export default App;