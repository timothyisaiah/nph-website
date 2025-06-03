import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { IndicatorProvider } from './context/IndicatorContext';

function App() {
  return (
    <IndicatorProvider>
      <RouterProvider router={router} />
    </IndicatorProvider>
  );
}

export default App;