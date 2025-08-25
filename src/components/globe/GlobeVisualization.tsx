import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'globe.gl';
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

interface GlobeVisualizationProps {
  onCountrySelect?: (country: Country) => void;
  onError?: (error: string) => void;
  selectedCountry?: { value: string; label: string } | null;
  showCountryDialog?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({
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

  // Convert TopoJSON to GeoJSON
  const geoJSONData = topojson.feature(topologyData, topologyData.objects.wb_countries) as any;

  useEffect(() => {
    if (!globeRef.current) return;

    // Initialize globe
    const globe = new Globe(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .polygonsData(geoJSONData.features)
      .polygonCapColor((polygon: any) => {
        const countryCode = polygon.properties?.ISO_A3;
        if (countryCode === internalSelectedCountry) {
          return '#ef4444'; // Red for selected
        } else if (countryCode === hoveredCountry) {
          return '#f59e0b'; // Orange for hovered
        }
        return 'rgba(59, 131, 246, 0)'; // Transparent blue for normal
      })
      .polygonSideColor((polygon: any) => {
        const countryCode = polygon.properties?.ISO_A3;
        if (countryCode === internalSelectedCountry) {
          return '#dc2626'; // Darker red for selected
        } else if (countryCode === hoveredCountry) {
          return '#d97706'; // Darker orange for hovered
        }
        return '#1e3a8a'; // Darker blue for normal
      })
      .polygonStrokeColor(() => '#ffffff')
      .polygonAltitude((polygon: any) => {
        const countryCode = polygon.properties?.ISO_A3;
        if (countryCode === internalSelectedCountry) {
          return 0.05; // Higher altitude for selected
        } else if (countryCode === hoveredCountry) {
          return 0.03; // Medium altitude for hovered
        }
        return 0.01; // Normal altitude
      })
      .polygonCapCurvatureResolution(3)
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

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Set loading to false
    setIsLoading(false);

    // Cleanup
    return () => {
      if (globeRef.current) {
        globeRef.current.innerHTML = '';
      }
      globeInstanceRef.current = null;
    };
  }, []); // Empty dependency array for initial setup

  // Update globe colors when selection/hover changes
  useEffect(() => {
    if (globeInstanceRef.current) {
      globeInstanceRef.current
        .polygonCapColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === internalSelectedCountry) {
            return '#ef4444'; // Red for selected
          } else if (countryCode === hoveredCountry) {
            return '#f59e0b'; // Orange for hovered
          }
          return 'rgba(59, 130, 246, 0.3)'; // Transparent blue for normal
        })
        .polygonSideColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === internalSelectedCountry) {
            return '#dc2626'; // Darker red for selected
          } else if (countryCode === hoveredCountry) {
            return '#d97706'; // Darker orange for hovered
          }
          return '#1e3a8a'; // Darker blue for normal
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
  }, [internalSelectedCountry, hoveredCountry]);

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

  // Update dialog state when prop changes
  useEffect(() => {
    setIsCountryDialogOpen(showCountryDialog);
  }, [showCountryDialog]);

  // Function to reset globe (clear selection and resume rotation)
  const resetGlobe = () => {
    setInternalSelectedCountry(null);
    setHoveredCountry(null);
    
    // Reset camera to default position
    if (globeInstanceRef.current) {
      globeInstanceRef.current.pointOfView(
        { lat: 0, lng: 0, altitude: 2.5 },
        1000
      );
    }
  };

  // Function to handle country selection from dialog
  const handleCountrySelectFromDialog = (country: Country) => {
    // Find the ISO3 code for this DHS country
    const mapping = countryMapping.find(m => m.dhsCode === country.value);
    
    if (mapping && mapping.iso3Code) {
      setInternalSelectedCountry(mapping.iso3Code);
      
      // Focus on the country
      const countryFeature = geoJSONData.features.find((f: any) => f.properties.ISO_A3 === mapping.iso3Code);
      if (countryFeature && globeInstanceRef.current) {
        const center = d3.geoCentroid(countryFeature);
        globeInstanceRef.current.pointOfView(
          { lat: center[1], lng: center[0], altitude: 2.5 },
          1000
        );
      }
    }
    
    if (onCountrySelect) {
      onCountrySelect(country);
    }
    
         setIsCountryDialogOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-10">
          <LoadingSpinner />
        </div>
      )}
      
      <div 
        ref={globeRef} 
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      
             {/* Country Selection Dialog */}
      <AnimatePresence>
        {isCountryDialogOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <CountrySelectionDialog
              isOpen={isCountryDialogOpen}
              onClose={() => setIsCountryDialogOpen(false)}
              onCountrySelect={handleCountrySelectFromDialog}
            />
          </div>
        )}
      </AnimatePresence>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
                 <button
           onClick={() => setIsCountryDialogOpen(true)}
           className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
         >
          Select Country
        </button>
        
        {internalSelectedCountry && (
          <button
            onClick={resetGlobe}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Selected Country Info */}
      {internalSelectedCountry && (
        <div className="absolute bottom-4 left-4 bg-blue-900 bg-opacity-90 text-white p-3 rounded-lg">
          <h3 className="text-sm font-semibold">Selected Country</h3>
          <p className="text-xs text-blue-200">
            {countryMapping.find(m => m.iso3Code === internalSelectedCountry)?.countryName || internalSelectedCountry}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobeVisualization; 