import React, { useRef, useEffect, useState } from 'react';
import * as GlobeGL from 'globe.gl';
import * as topojson from 'topojson-client';

// Import data with type assertions
import topologyData from '../data/topology.js';
import shortcodesData from '../data/shortcodes.js';

const GlobePage: React.FC = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    console.log('Initializing globe...');
    console.log('Topology data:', topologyData);
    
    // Convert TopoJSON to GeoJSON using topojson-client
    const geoJSONData = topojson.feature(topologyData, topologyData.objects.wb_countries);
    console.log('Converted GeoJSON data:', geoJSONData);
    console.log('Number of countries:', geoJSONData.features?.length || 0);
    console.log('Sample country:', geoJSONData.features?.[0]);

    // Initialize globe
    const globe = new GlobeGL.default(globeRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .polygonsData(geoJSONData.features)
      .polygonCapColor((polygon: any) => {
        const countryCode = polygon.properties?.ISO_A3;
        if (countryCode === selectedCountry) {
          return '#ef4444'; // Red for selected
        } else if (countryCode === hoveredCountry) {
          return '#f59e0b'; // Orange for hovered
        }
        return '#3b82f6'; // Blue for normal
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
      .polygonCapCurvatureResolution(3)
      .width(800)
      .height(600);

    // Store globe instance
    globeInstanceRef.current = globe;

    // Set up event handlers
    globe.onPolygonClick((polygon: any) => {
      console.log('Polygon clicked:', polygon);
      const countryCode = polygon.properties?.ISO_A3;
      if (countryCode) {
        console.log('Setting selected country:', countryCode);
        setSelectedCountry(countryCode);
      }
    });

    globe.onPolygonHover((polygon: any) => {
      console.log('Polygon hover:', polygon);
      const countryCode = polygon?.properties?.ISO_A3;
      setHoveredCountry(countryCode || null);
      document.body.style.cursor = polygon ? 'pointer' : 'default';
    });

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    console.log('Globe initialized successfully');

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
      console.log('Updating globe colors - Selected:', selectedCountry, 'Hovered:', hoveredCountry);
      globeInstanceRef.current
        .polygonCapColor((polygon: any) => {
          const countryCode = polygon.properties?.ISO_A3;
          if (countryCode === selectedCountry) {
            return '#ef4444'; // Red for selected
          } else if (countryCode === hoveredCountry) {
            return '#f59e0b'; // Orange for hovered
          }
          return '#3b82f6'; // Blue for normal
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
  }, [selectedCountry, hoveredCountry]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Interactive World Globe</h1>
          <p className="text-gray-300 mb-4">
            Explore countries by clicking on them. Hover to see country codes.
          </p>
          {selectedCountry && (
            <div className="bg-blue-900 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">Selected Country: {selectedCountry}</h2>
            </div>
          )}
          {hoveredCountry && !selectedCountry && (
            <div className="bg-orange-900 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">Hovering: {hoveredCountry}</h2>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <div 
            ref={globeRef} 
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            style={{ width: '800px', height: '600px' }}
          />
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Available Countries</h3>
            <p className="text-gray-300 text-sm">
              Total: {shortcodesData.length} countries
            </p>
            <p className="text-gray-300 text-sm">
              Displayed: {topologyData.objects.wb_countries.geometries.length} countries
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Controls</h3>
            <p className="text-gray-300 text-sm">
              • Click to select a country<br/>
              • Hover to highlight<br/>
              • Globe rotates automatically<br/>
              • Drag to rotate manually
            </p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Data Source</h3>
            <p className="text-gray-300 text-sm">
              Using topology data with actual country boundaries for accurate representation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobePage;
