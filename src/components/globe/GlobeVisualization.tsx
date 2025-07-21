import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'globe.gl';
import LoadingSpinner from '../common/LoadingSpinner';
import CountrySelectionDialog from './CountrySelectionDialog';
import * as d3 from 'd3-geo';
import { countryBoundariesService } from '../../services/countryBoundariesService';
import type { CountryFeature } from '../../services/countryBoundariesService';

interface Country {
  value: string;
  label: string;
  flag?: string;
}

interface GlobeVisualizationProps {
  onError?: (error: string) => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
  enableRotation?: boolean;
  rotationSpeed?: number;
  onCountrySelect?: (country: Country) => void;
  showCountryDialog?: boolean; // New prop to control dialog visibility
  selectedCountry?: Country | null; // External selected country for highlighting
}

// Polygon styling constants
const POLYGON_STYLES = {
  default: {
    capColor: 'rgba(255, 255, 255, 0.1)',
    sideColor: 'rgba(255, 255, 255, 0.1)',
    strokeColor: 'rgba(0, 0, 0, 0.3)',
    altitude: 0.01
  },
  highlighted: {
    capColor: 'rgba(59, 130, 246, 0.6)',
    sideColor: 'rgba(59, 130, 246, 0.4)',
    strokeColor: 'rgba(59, 130, 246, 0.8)',
    altitude: 0.01
  }
};

// Point styling constants
const POINT_STYLES = {
  default: {
    color: '#3B82F6',
    size: 0.5,
    altitude: 0.01
  },
  highlighted: {
    color: '#FFD700',
    size: 1.0,
    altitude: 0.01
  }
};

const HIGHLIGHT_POINT_STYLE = {
  color: '#FF0000', // bright red
  size: 1.5,
  altitude: 0.03
};

// POLYGON-ONLY VERSION: All country visualization and interaction uses polygons only for benchmarking.
const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ 
  onError, 
  width,
  height,
  backgroundColor = '#ffffff',
  enableRotation = true,
  rotationSpeed = 0.05,
  onCountrySelect,
  showCountryDialog = true, // Default to true
  selectedCountry // New prop
}) => {
  const globeRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountryState, setSelectedCountry] = useState<Country | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [boundariesLoaded, setBoundariesLoaded] = useState(false);
  const animationRef = useRef<number>();
  const [highlightPoint, setHighlightPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load country boundaries on mount
  useEffect(() => {
    const loadBoundaries = async () => {
      try {
        await countryBoundariesService.loadBoundaries();
        setBoundariesLoaded(true);
      } catch (error) {
        console.error('Failed to load boundaries:', error);
        onError?.('Failed to load country boundaries');
      }
    };

    loadBoundaries();
  }, [onError]);

  // Respond to external selectedCountry changes
  useEffect(() => {
    if (selectedCountry && globeRef.current && boundariesLoaded) {
      // Update internal state
      setSelectedCountry(selectedCountry);
      
      // Find the country feature and highlight it
      const countryFeature = countryBoundariesService.getCountryByCode(selectedCountry.value);
      
      if (countryFeature) {
        let center: [number, number];
        
        // For polygon data, calculate the centroid
        center = d3.geoCentroid(countryFeature);
        
        // Focus on the selected country
        globeRef.current.pointOfView({ 
          lat: center[1], 
          lng: center[0], 
          altitude: 2.5 
        });
        
        // Highlight the selected country
        const allCountries = countryBoundariesService.getAllCountries();
        highlightSelectedCountry(globeRef.current, allCountries, selectedCountry.value);
        
        // Draw a highlighted point at the centroid
        setHighlightPoint({ lat: center[1], lng: center[0] });
      }
    } else if (!selectedCountry && globeRef.current && boundariesLoaded) {
      // Reset when no country is selected
      setSelectedCountry(null);
      setHighlightPoint(null);
      
      // Reset globe view
      globeRef.current.pointOfView({ lat: 5, lng: 0, altitude: 2.5 });
      
      // Reset all countries to default appearance
      const allCountries = countryBoundariesService.getAllCountries();
      resetCountryHighlighting(globeRef.current, allCountries);
    }
  }, [selectedCountry, boundariesLoaded]);

  // Helper function to check if countries have polygon geometry
  const hasPolygonGeometry = (countries: CountryFeature[]): boolean => {
    return countries.some((country: CountryFeature) => 
      country.geometry.type === 'Polygon' || country.geometry.type === 'MultiPolygon'
    );
  };

  // Helper function to create country object from feature
  const createCountryFromFeature = (feature: CountryFeature): Country => ({
    value: feature.properties.iso_a2 || feature.properties.iso_a3 || feature.properties.dhs_code || '',
    label: feature.properties.name,
    flag: feature.properties.iso_a2?.toLowerCase()
  });

  // Helper function to setup polygon visualization (always used)
  const setupPolygonVisualization = (globe: any, countries: CountryFeature[]) => {
    globe
      .polygonsData(countries)
      .polygonCapColor(() => POLYGON_STYLES.default.capColor)
      .polygonSideColor(() => POLYGON_STYLES.default.sideColor)
      .polygonStrokeColor(() => POLYGON_STYLES.default.strokeColor)
      .polygonAltitude(POLYGON_STYLES.default.altitude)
      .onPolygonHover((polygon: any) => {
        document.body.style.cursor = polygon ? 'pointer' : 'default';
      })
      .onPolygonClick((polygon: any) => {
        if (polygon) {
          const country = createCountryFromFeature(polygon);
          handleCountrySelect(country);
        }
      });
  };

  // Helper function to setup point visualization
  /*
  const setupPointVisualization = (globe: any, countries: CountryFeature[]) => {
    const pointData = countries.map((country: CountryFeature) => {
      if (country.geometry.type === 'Point') {
        return {
          ...country,
          lat: country.geometry.coordinates[1],
          lng: country.geometry.coordinates[0],
          color: POINT_STYLES.default.color,
          size: POINT_STYLES.default.size
        };
      }
      return country;
    });

    globe
      .pointsData(pointData)
      .pointRadius('size')
      .pointColor('color')
      .pointAltitude(POINT_STYLES.default.altitude)
      .onPointHover((point: any) => {
        document.body.style.cursor = point ? 'pointer' : 'default';
      })
      .onPointClick((point: any) => {
        if (point) {
          const country = createCountryFromFeature(point);
          handleCountrySelect(country);
        }
      });
  };
  */
  // Polygon-only: Do not use point visualization

  // Helper function to highlight selected country (always polygons)
  const highlightSelectedCountry = (globe: any, countries: CountryFeature[], selectedCountryCode: string) => {
    const highlightedCountries = countries.map((feature: CountryFeature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        highlighted: feature.properties.iso_a2 === selectedCountryCode || 
                    feature.properties.iso_a3 === selectedCountryCode ||
                    feature.properties.dhs_code === selectedCountryCode
      }
    }));
    globe
      .polygonsData(highlightedCountries)
      .polygonCapColor((d: any) => 
        d.properties.highlighted ? POLYGON_STYLES.highlighted.capColor : POLYGON_STYLES.default.capColor
      )
      .polygonSideColor((d: any) => 
        d.properties.highlighted ? POLYGON_STYLES.highlighted.sideColor : POLYGON_STYLES.default.sideColor
      )
      .polygonStrokeColor((d: any) => 
        d.properties.highlighted ? POLYGON_STYLES.highlighted.strokeColor : POLYGON_STYLES.default.strokeColor
      );
  };

  // Helper function to reset country highlighting (always polygons)
  const resetCountryHighlighting = (globe: any, countries: CountryFeature[]) => {
    globe
      .polygonsData(countries)
      .polygonCapColor(() => POLYGON_STYLES.default.capColor)
      .polygonSideColor(() => POLYGON_STYLES.default.sideColor)
      .polygonStrokeColor(() => POLYGON_STYLES.default.strokeColor);
  };

  // Initialize globe (always polygons)
  useEffect(() => {
    if (!containerRef.current || !boundariesLoaded) return;
    setIsLoading(true);
    const allCountries = countryBoundariesService.getAllCountries();
    const globe = new Globe(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .backgroundColor(backgroundColor)
      .width(width || containerRef.current.clientWidth)
      .height(height || containerRef.current.clientHeight)
      .enablePointerInteraction(true);
    // Always use polygon visualization
    setupPolygonVisualization(globe, allCountries);
    // Set fixed camera position to prevent zooming
    globe.pointOfView({ lat: 5, lng: 0, altitude: 2.5 });
    // Disable zoom controls directly
    if (globe.controls()) {
      globe.controls().enableZoom = false;
    }
    // Touch support
    if (containerRef.current) {
      containerRef.current.addEventListener('touchstart', (e) => {
        e.preventDefault();
      }, { passive: false });
      containerRef.current.addEventListener('wheel', (e) => {
        e.preventDefault();
      }, { passive: false });
      containerRef.current.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      }, { passive: false });
      containerRef.current.addEventListener('gesturechange', (e) => {
        e.preventDefault();
      }, { passive: false });
      containerRef.current.addEventListener('gestureend', (e) => {
        e.preventDefault();
      }, { passive: false });
    }
    globeRef.current = globe;
    // Resize
    const handleResize = () => {
      if (containerRef.current && globeRef.current) {
        globeRef.current
          .width(width || containerRef.current.clientWidth)
          .height(height || containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    // Use a timeout to ensure the globe has time to render
    const initTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // Cleanup
    return () => {
      clearTimeout(initTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) globeRef.current = null;
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', () => {});
      }
    };
  }, [backgroundColor, width, height, enableRotation, rotationSpeed, boundariesLoaded]);

  // Handle rotation separately
  useEffect(() => {
    if (!globeRef.current || !enableRotation) return;

    let lastTime = 0;
    let currentRotation = 0;

    const animate = (time: number) => {
      if (isRotating) {
        animationRef.current = requestAnimationFrame(animate);
        const deltaTime = time - lastTime;
        lastTime = time;
        if (globeRef.current) {
          currentRotation += rotationSpeed * (deltaTime / 16.67);
          globeRef.current.pointOfView({ lat: 5, lng: currentRotation % 360 });
        }
      }
    };

    if (isRotating) {
      requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRotating, enableRotation, rotationSpeed]);

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsRotating(false);
    
    // Find the country feature
    const countryFeature = countryBoundariesService.getCountryByCode(country.value);
    
    if (countryFeature && globeRef.current) {
      let center: [number, number];
      
      // if (countryFeature.geometry.type === 'Point') {
      //   // For point data, use the coordinates directly
      //   center = [countryFeature.geometry.coordinates[0], countryFeature.geometry.coordinates[1]];
      // } else {
        // For polygon data, calculate the centroid
        center = d3.geoCentroid(countryFeature);
      // }
      
      // Focus on the selected country
      globeRef.current.pointOfView({ 
        lat: center[1], 
        lng: center[0], 
        altitude: 2.5 
      });
      
      // Highlight the selected country
      const allCountries = countryBoundariesService.getAllCountries();
      highlightSelectedCountry(globeRef.current, allCountries, country.value);
      // Draw a highlighted point at the centroid
      setHighlightPoint({ lat: center[1], lng: center[0] });
    }
    
    onCountrySelect?.(country);
  };

  // Reset to default view
  const handleResetView = () => {
    setSelectedCountry(null);
    setIsRotating(true);
    
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 5, lng: 0, altitude: 2.5 });
      
      // Reset all countries to default appearance
      const allCountries = countryBoundariesService.getAllCountries();
      resetCountryHighlighting(globeRef.current, allCountries);
    }
    setHighlightPoint(null);
  };

  return (
    <div className="relative w-full h-full">
      {/* Globe Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />

      {highlightPoint && globeRef.current && (
        globeRef.current.pointsData([
          {
            lat: highlightPoint.lat,
            lng: highlightPoint.lng,
            color: HIGHLIGHT_POINT_STYLE.color,
            size: HIGHLIGHT_POINT_STYLE.size
          }
        ])
        .pointColor('color')
        .pointRadius('size')
        .pointAltitude(HIGHLIGHT_POINT_STYLE.altitude)
      )}


      {/* Loading Overlay */}
      <AnimatePresence>
        {(isLoading || !boundariesLoaded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90"
          >
            <div className="text-center">
              <LoadingSpinner />
              <p className="text-gray-600 mt-4">
                {!boundariesLoaded ? 'Loading country boundaries...' : 'Loading globe...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country Selection Dialog */}
      {showCountryDialog && !isMobile && (
        <CountrySelectionDialog
          isOpen={true}
          onClose={() => {}} // No close functionality since it's permanent
          onCountrySelect={handleCountrySelect}
          onCountryClear={handleResetView}
          selectedCountry={selectedCountryState}
        />
      )}
    </div>
  );
};

export default GlobeVisualization; 