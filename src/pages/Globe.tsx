import React, { useRef, useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import data with type assertions
// @ts-ignore
import topologyData from '../data/topology.js';
// @ts-ignore
import shortcodesData from '../data/shortcodes.js';

const GlobePage: React.FC = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

  // Load dependencies asynchronously
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        // Load all heavy dependencies in parallel
        await Promise.all([
          import('globe.gl'),
          import('topojson-client'),
          import('d3-geo')
        ]);
        setDependenciesLoaded(true);
      } catch (err) {
        console.error('Failed to load globe dependencies:', err);
        setError('Failed to load globe visualization');
        setIsLoading(false);
      }
    };

    loadDependencies();
  }, []);

  // Initialize globe when dependencies are loaded
  useEffect(() => {
    if (!globeRef.current || !dependenciesLoaded) return;
    
    const initializeGlobe = async () => {
      try {
        // Dynamically import dependencies
        const [GlobeGLModule, topojsonModule, d3Module] = await Promise.all([
          import('globe.gl'),
          import('topojson-client'),
          import('d3-geo')
        ]);

        // Convert TopoJSON to GeoJSON using topojson-client
        const geoJSONData = topojsonModule.feature(topologyData, topologyData.objects.wb_countries) as any;

        // Initialize globe with optimized settings
        const globe = new GlobeGLModule.default(globeRef.current!)
          .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
          .backgroundColor('#ffffff')
          .polygonsData(geoJSONData.features)
          .polygonCapColor((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === selectedCountry) {
              return '#ef4444'; // Red for selected
            } else if (countryCode === hoveredCountry) {
              return '#f59e0b'; // Orange for hovered
            }
            return 'rgba(59, 131, 246, 0.3)'; // Transparent blue for normal
          })
          .polygonSideColor((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === selectedCountry) {
              return '#dc2626'; // Darker red for selected
            } else if (countryCode === hoveredCountry) {
              return '#d97706'; // Darker orange for hovered
            }
            return '#1e3a8a'; // Darker blue for normal
          })
          .polygonStrokeColor(() => '#ffffff')
          .polygonAltitude((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === selectedCountry) {
              return 0.05; // Higher altitude for selected
            } else if (countryCode === hoveredCountry) {
              return 0.03; // Medium altitude for hovered
            }
            return 0.01; // Normal altitude
          })
          .polygonCapCurvatureResolution(2) // Reduced for better performance
          .width(800)
          .height(600);

        // Store globe instance
        globeInstanceRef.current = globe;

        // Set up event handlers
        globe.onPolygonClick((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode) {
            setSelectedCountry(countryCode);
            
            // Pause rotation when country is selected
            setIsRotating(false);
            
            // Focus on the selected country
            if (polygon) {
              let center: [number, number];
              
              // Calculate the centroid of the country
              center = d3Module.geoCentroid(polygon);
              
              // Focus on the selected country with smooth animation
              globe.pointOfView(
                { 
                  lat: center[1], 
                  lng: center[0], 
                  altitude: 2.5 
                },
                1000 // Animation duration in milliseconds
              );
            }
          }
        });

        globe.onPolygonHover((polygon: any) => {
          const countryCode = polygon?.properties?.ISO_A3;
          setHoveredCountry(countryCode || null);
          document.body.style.cursor = polygon ? 'pointer' : 'default';
        });

        // Auto-rotate with optimized settings
        globe.controls().autoRotate = isRotating;
        globe.controls().autoRotateSpeed = 0.3; // Reduced speed for better performance

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize globe:', err);
        setError('Failed to initialize globe visualization');
        setIsLoading(false);
      }
    };

    initializeGlobe();

    // Cleanup
    return () => {
      if (globeRef.current) {
        globeRef.current.innerHTML = '';
      }
      globeInstanceRef.current = null;
    };
  }, [dependenciesLoaded]); // Only re-run when dependencies are loaded

  // Update rotation state
  useEffect(() => {
    if (globeInstanceRef.current) {
      globeInstanceRef.current.controls().autoRotate = isRotating;
    }
  }, [isRotating]);

  // Update globe colors when selection/hover changes
  useEffect(() => {
    if (globeInstanceRef.current && !isLoading) {
      globeInstanceRef.current
        .polygonCapColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return '#ef4444'; // Red for selected
          } else if (countryCode === hoveredCountry) {
            return '#f59e0b'; // Orange for hovered
          }
          return 'rgba(59, 131, 246, 0.3)'; // Transparent blue for normal
        })
        .polygonSideColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return '#dc2626'; // Darker red for selected
          } else if (countryCode === hoveredCountry) {
            return '#d97706'; // Darker orange for hovered
          }
          return '#1e3a8a'; // Darker blue for normal
        })
        .polygonAltitude((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return 0.05; // Higher altitude for selected
          } else if (countryCode === hoveredCountry) {
            return 0.03; // Medium altitude for hovered
          }
          return 0.01; // Normal altitude
        });
    }
  }, [selectedCountry, hoveredCountry, isLoading]);

  // Function to reset globe (clear selection and resume rotation)
  const resetGlobe = () => {
    setSelectedCountry(null);
    setHoveredCountry(null);
    setIsRotating(true);
    
    // Reset camera to default position
    if (globeInstanceRef.current) {
      globeInstanceRef.current.pointOfView(
        { lat: 0, lng: 0, altitude: 2.5 },
        1000
      );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg">Loading interactive globe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Globe Loading Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Controls */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
            </button>
            
            {selectedCountry && (
              <button
                onClick={resetGlobe}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Reset View
              </button>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <div 
            ref={globeRef} 
            className="overflow-hidden"
            style={{ width: '800px', height: '600px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
