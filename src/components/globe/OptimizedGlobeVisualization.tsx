import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import CountrySelectionDialog from './CountrySelectionDialog';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';

// Import data with type assertions
// @ts-ignore
import topologyData from '../../data/topology.js';
// @ts-ignore
import shortcodesData from '../../data/shortcodes.js';
// @ts-ignore
import countryMapping from '../../data/country-mapping.json';

interface Country {
  value: string;
  label: string;
  flag?: string;
}

interface OptimizedGlobeVisualizationProps {
  onCountrySelect?: (country: Country) => void;
  onError?: (error: string) => void;
  selectedCountry?: { value: string; label: string } | null;
  showCountryDialog?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const OptimizedGlobeVisualization: React.FC<OptimizedGlobeVisualizationProps> = ({
  onCountrySelect,
  onError,
  selectedCountry,
  showCountryDialog = false,
  className = '',
  width = 800,
  height = 600
}) => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [internalSelectedCountry, setInternalSelectedCountry] = useState<string | null>(null);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(showCountryDialog);
  const [globeLoaded, setGlobeLoaded] = useState(false);

  // Convert TopoJSON to GeoJSON - memoized to prevent recalculation
  const geoJSONData = React.useMemo(() => 
    topojson.feature(topologyData, topologyData.objects.wb_countries) as any, 
    []
  );

    // Lazy load the Globe library
  const initializeGlobe = useCallback(async () => {
    if (!globeRef.current || globeLoaded) return;

    try {
      // Dynamically import the heavy Globe library
      const { default: Globe } = await import('globe.gl');
      const globe = new Globe(globeRef.current)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundColor('rgba(255, 255, 255, 0)')
        .polygonsData(geoJSONData.features)
        .polygonCapColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return '#ef4444'; // Red for selected
          } else if (countryCode === hoveredCountry) {
            return '#f59e0b'; // Orange for hovered
          }
          return 'rgba(203, 216, 236, 0)'; // Transparent blue for normal
        })
        .polygonSideColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return '#dc2626'; // Darker red for selected
          } else if (countryCode === hoveredCountry) {
            return '#d97706'; // Darker orange for hovered
          }
          return 'rgba(203, 216, 236, 0)'; // Darker blue for normal
        })
        .polygonAltitude((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
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

      // Set up event handlers
      globe.onPolygonClick((polygon: any) => {
        const countryCode = polygon.properties?.ISO_A3;
        if (countryCode) {
          // Find the DHS country mapping
          const mapping = countryMapping.find(m => m.iso3Code === countryCode);
          
          if (mapping) {
            setInternalSelectedCountry(countryCode);
            
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
      });

      globe.onPolygonHover((polygon: any) => {
        const countryCode = polygon?.properties?.ISO_A3;
        setHoveredCountry(countryCode || null);
        document.body.style.cursor = polygon ? 'pointer' : 'default';
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
  }, [geoJSONData.features, internalSelectedCountry, hoveredCountry, width, height, onCountrySelect, onError, globeLoaded]);

  // Initialize globe on mount
  useEffect(() => {
    initializeGlobe();
  }, [initializeGlobe]);

  // Update globe colors when selection/hover changes
  useEffect(() => {
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
  }, [internalSelectedCountry, hoveredCountry, globeLoaded]);

  // Update internal selected country when prop changes
  useEffect(() => {
    if (selectedCountry) {
      // Find the ISO3 code for this DHS country
      const mapping = countryMapping.find(m => m.dhsCode === selectedCountry.value);
      if (mapping && mapping.iso3Code) {
        setInternalSelectedCountry(mapping.iso3Code);
      }
    } else {
      setInternalSelectedCountry(null);
    }
  }, [selectedCountry]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (globeRef.current) {
        globeRef.current.innerHTML = '';
      }
      globeInstanceRef.current = null;
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
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
      
      {/* Country Selection Dialog */}
      <AnimatePresence>
        {isCountryDialogOpen && (
          <CountrySelectionDialog
            isOpen={isCountryDialogOpen}
            onClose={() => setIsCountryDialogOpen(false)}
            onCountrySelect={(country) => {
              if (onCountrySelect) {
                onCountrySelect(country);
              }
              setIsCountryDialogOpen(false);
            }}
            selectedCountry={selectedCountry}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizedGlobeVisualization;
