import React, { useEffect, useRef, useState, useCallback } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';

// Import data with type assertions
// @ts-ignore
import topologyData from '../../data/topology.js';
// @ts-ignore
import shortcodesData from '../../data/shortcodes.js';
// @ts-ignore
import countryMapping from '../../data/country-mapping.json';

// Throttling and debouncing utilities
const throttle = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let lastCall = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
};

const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

interface Country {
  value: string;
  label: string;
  flag?: string;
}

interface OptimizedGlobeVisualizationProps {
  onCountrySelect?: (country: Country) => void;
  onError?: (error: string) => void;
  selectedCountry?: { value: string; label: string } | null;
  className?: string;
  width?: number;
  height?: number;
}

const OptimizedGlobeVisualization: React.FC<OptimizedGlobeVisualizationProps> = ({
  onCountrySelect,
  onError,
  selectedCountry,
  className = '',
  width = 800,
  height = 600
}) => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<string | null>(null);
  const [globeLoaded, setGlobeLoaded] = useState(false);
  const [dependenciesLoaded, setDependenciesLoaded] = useState(false);

  // Throttled and debounced event handlers for better performance
  const throttledSetHoveredCountry = useCallback(
    throttle((countryCode: string | null) => {
      setHoveredCountry(countryCode);
    }, 16), // ~60fps throttling
    []
  );

  const debouncedSetHoveredCountry = useCallback(
    debounce((countryCode: string | null) => {
      setHoveredCountry(countryCode);
    }, 100), // 100ms debounce for hover end
    []
  );

  const throttledUpdateCursor = useCallback(
    throttle((isPointer: boolean) => {
      document.body.style.cursor = isPointer ? 'pointer' : 'default';
    }, 50), // 50ms throttling for cursor updates
    []
  );

  // Convert TopoJSON to GeoJSON - computed synchronously since topology data is static
  const geoJSONData = React.useMemo(() => {
    try {
      return topojson.feature(topologyData, topologyData.objects.wb_countries) as any;
    } catch (error) {
      console.error('Failed to convert TopoJSON to GeoJSON:', error);
      onError?.('Failed to load map data');
      return null;
    }
  }, [onError]);

  // Pre-load dependencies for consistent loading times
  useEffect(() => {
    const preloadDependencies = async () => {
      try {
        // Add a minimum loading time to ensure consistent UX
        const startTime = Date.now();
        const minLoadTime = 1000; // 1 second minimum loading time for smaller component
        
        // Preload critical resources with resource hints
        const preloadResources = () => {
          // Preload earth texture image
          const textureLink = document.createElement('link');
          textureLink.rel = 'preload';
          textureLink.href = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
          textureLink.as = 'image';
          textureLink.crossOrigin = 'anonymous';
          document.head.appendChild(textureLink);
          
          // Preload additional globe textures (night lights, etc.)
          const nightTextureLink = document.createElement('link');
          nightTextureLink.rel = 'prefetch';
          nightTextureLink.href = '//unpkg.com/three-globe/example/img/earth-night.jpg';
          nightTextureLink.as = 'image';
          nightTextureLink.crossOrigin = 'anonymous';
          document.head.appendChild(nightTextureLink);
          
          // Preload WebGL context resources
          const webglLink = document.createElement('link');
          webglLink.rel = 'prefetch';
          webglLink.href = '//unpkg.com/three-globe/example/img/earth-topology.png';
          webglLink.as = 'image';
          webglLink.crossOrigin = 'anonymous';
          document.head.appendChild(webglLink);
        };
        
        // Execute resource preloading
        preloadResources();
        
        // Load dependencies in parallel
        await Promise.all([
          import('globe.gl'),
          import('topojson-client'),
          import('d3-geo')
        ]);
        
        // Ensure minimum loading time for consistent experience
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < minLoadTime) {
          await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsedTime));
        }
        
        setDependenciesLoaded(true);
      } catch (error) {
        console.error('Failed to preload dependencies:', error);
      }
    };
    preloadDependencies();
  }, []);

  // Lazy load the Globe library
  const initializeGlobe = useCallback(async () => {
    if (!globeRef.current || globeLoaded || !dependenciesLoaded) return;

    try {
      // Use preloaded dependencies for consistent loading
      const { default: Globe } = await import('globe.gl');
      const globe = new Globe(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundColor('rgba(255, 255, 255, 0)')
        .polygonsData(geoJSONData.features.filter((feature: any) => 
          feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
        ))
        .polygonCapColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === internalSelectedCountry) {
            return '#ef4444'; // Red for selected
          } else if (countryCode === hoveredCountry) {
            return '#f59e0b'; // Orange for hovered
          }
          return 'rgba(203, 216, 236, 0)'; // Transparent blue for normal
        })
        .polygonSideColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === internalSelectedCountry) {
            return '#dc2626'; // Darker red for selected
          } else if (countryCode === hoveredCountry) {
            return '#d97706'; // Darker orange for hovered
          }
          return 'rgba(203, 216, 236, 0)'; // Darker blue for normal
        })
        .polygonAltitude((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === internalSelectedCountry) {
            return 0.05; // Higher altitude for selected
          } else if (countryCode === hoveredCountry) {
            return 0.03; // Medium altitude for hovered
          }
          return 0.01; // Normal altitude
        })
        .polygonCapCurvatureResolution(2) // Reduced resolution for better performance
        .width(width)
        .height(height);

      // Store globe instance
      globeInstanceRef.current = globe;

                     // Throttled click handler to prevent rapid successive clicks
        const throttledClickHandler = throttle((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode) {
            // Find the DHS country mapping
            const mapping = countryMapping.find(m => m.iso3Code === countryCode);
            
            if (mapping) {
              setInternalSelectedCountry(countryCode);
              
              // Pause rotation when country is clicked
              globe.controls().autoRotate = false;
              
              // Call the onCountrySelect callback
              if (onCountrySelect) {
                onCountrySelect({
                  value: mapping.dhsCode,
                  label: mapping.countryName
                });
              }
              
              // Focus on the selected country
              if (polygon) {
                let center: [number, number];
                
                // Calculate the centroid of the country
                center = d3.geoCentroid(polygon);
                
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
          }
        }, 300); // 300ms throttling to prevent rapid clicks

        // Set up event handlers
        globe.onPolygonClick(throttledClickHandler);

      globe.onPolygonHover((polygon: any) => {
        const countryCode = polygon?.properties?.ISO_A3;
        if (polygon) {
          // Use throttled function for immediate response during hover
          throttledSetHoveredCountry(countryCode || null);
          throttledUpdateCursor(true);
        } else {
          // Use debounced function for hover end to avoid flickering
          debouncedSetHoveredCountry(null);
          throttledUpdateCursor(false);
        }
      });

      // Auto-rotate with reduced speed for better performance
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.3; // Reduced speed

      setGlobeLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load globe:', error);
      if (onError) {
        onError('Failed to load interactive globe');
      }
      setIsLoading(false);
    }
  }, [width, height, onCountrySelect, onError, globeLoaded, dependenciesLoaded]);

  // Initialize globe on mount and when dependencies are loaded
  useEffect(() => {
    if (dependenciesLoaded && !globeLoaded) {
      initializeGlobe();
    }
  }, [initializeGlobe, dependenciesLoaded, globeLoaded]);

  // Throttled color update function
  const throttledUpdateColors = useCallback(
    throttle(() => {
      if (globeInstanceRef.current && globeLoaded) {
        globeInstanceRef.current
          .polygonCapColor((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === internalSelectedCountry) {
              return '#ef4444'; // Red for selected
            } else if (countryCode === hoveredCountry) {
              return '#f59e0b'; // Orange for hovered
            }
            return 'rgba(203, 216, 236, 0)'; // Transparent blue for normal
          })
          .polygonSideColor((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === internalSelectedCountry) {
              return '#dc2626'; // Darker red for selected
            } else if (countryCode === hoveredCountry) {
              return '#d97706'; // Darker orange for hovered
            }
            return 'rgba(203, 216, 236, 0.2)'; // Darker blue for normal
          })
          .polygonAltitude((polygon: any) => {
            const countryCode = polygon.properties?.ISO_A3;
            if (countryCode === internalSelectedCountry) {
              return 0.05; // Higher altitude for selected
            } else if (countryCode === hoveredCountry) {
              return 0.03; // Medium altitude for hovered
            }
            return 0.01; // Normal altitude
          });
      }
    }, 16), // ~60fps throttling for color updates
    [internalSelectedCountry, hoveredCountry, globeLoaded]
  );

  // Update globe colors when selection/hover changes (throttled)
  useEffect(() => {
    throttledUpdateColors();
  }, [throttledUpdateColors]);

  // Throttled country focus function to prevent rapid successive animations
  const throttledFocusCountry = useCallback(
    throttle((mapping: any, countryPolygon: any) => {
      if (globeInstanceRef.current && countryPolygon) {
        // Calculate the centroid of the country
        const center = d3.geoCentroid(countryPolygon);
        
        // Focus on the selected country with smooth animation
        globeInstanceRef.current.pointOfView(
          { 
            lat: center[1], 
            lng: center[0], 
            altitude: 2.5 
          },
          1000 // Animation duration in milliseconds
        );
      }
    }, 500), // 500ms throttling to prevent rapid focus changes
    []
  );

  // Update internal selected country when prop changes and handle globe focus
  useEffect(() => {
    if (selectedCountry) {
      // Find the ISO3 code for this DHS country
      const mapping = countryMapping.find(m => m.dhsCode === selectedCountry.value);
      if (mapping && mapping.iso3Code) {
        setInternalSelectedCountry(mapping.iso3Code);
        
        // Pause rotation when country is selected
        if (globeInstanceRef.current) {
          globeInstanceRef.current.controls().autoRotate = false;
        }
        
        // Focus on the selected country (throttled)
        if (globeInstanceRef.current && mapping.iso3Code) {
          // Find the country polygon in the geoJSON data
          const countryPolygon = geoJSONData.features.find((feature: any) => 
            feature.properties?.ISO_A3 === mapping.iso3Code
          );
          
          if (countryPolygon) {
            throttledFocusCountry(mapping, countryPolygon);
          }
        }
      }
    } else {
      setInternalSelectedCountry(null);
      
      // Resume rotation and reset view when country is cleared
      if (globeInstanceRef.current) {
        globeInstanceRef.current.controls().autoRotate = true;
        globeInstanceRef.current.pointOfView(
          { lat: 0, lng: 0, altitude: 2.5 },
          1000
        );
      }
    }
  }, [selectedCountry, throttledFocusCountry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (globeRef.current) {
        globeRef.current.innerHTML = '';
      }
      globeInstanceRef.current = null;
      
      // Clear any pending timeouts from debounced functions
      // Note: The debounced functions will automatically clear their timeouts
      // when the component unmounts, but we can add additional cleanup here if needed
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white-50 rounded-lg z-1000">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-2 text-sm text-gray-600">Loading interactive globe...</p>
          </div>
        </div>
      )}
      
      {/* Globe container */}
      <div 
        ref={globeRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ width, height }}
      />
    </div>
  );
};

export default OptimizedGlobeVisualization;
