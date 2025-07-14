import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import ThematicAreas from './pages/ThematicAreas';
import Publications from './pages/Publications';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import ErrorPage from './pages/Error';
import DataCanvas from './components/data/DataCanvas';
import DataInsights from './pages/DataInsights';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'thematic-areas',
        element: <ThematicAreas />,
      },
      {
        path: 'publications',
        element: <Publications />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'data',
        element: <DataInsights />,
      },
      {
        path: 'data-explorer',
        element: <DataCanvas />,
      },
    ],
  },
], {
  basename: '/' // Updated to match your GitHub Pages URL path
});