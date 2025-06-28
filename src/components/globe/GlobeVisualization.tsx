import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'globe.gl';
import * as THREE from 'three';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Indicator {
  IndicatorId: string;
  Label: string;
  Definition: string;
  color?: string;
  position?: [number, number]; // [latitude, longitude]
  size?: number;
}

interface GlobePoint extends Indicator {
  [key: string]: any;
}

interface GlobeVisualizationProps {
  onError?: (error: string) => void;
  onIndicatorSelect: (indicatorId: string) => void;
  onCountrySelect?: (country: any) => void;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ onError, onIndicatorSelect }) => {
  const globeRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [hoveredIndicator, setHoveredIndicator] = useState<Indicator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Vibrant color palette
  const colors = [
    '#00A0DC', // Bright Blue
    '#7AC36A', // Fresh Green
    '#F15A60', // Coral Red
    '#9B5DE5', // Purple
    '#F5A623', // Orange
    '#2CCCE4', // Turquoise
    '#FF66B2', // Pink
    '#5C6BC0', // Indigo
    '#42B883', // Vue Green
    '#FF7043'  // Deep Orange
  ];

  const generateRandomPosition = (): [number, number] => {
    // Ensure valid latitude (-90 to 90) and longitude (-180 to 180)
    const lat = Math.min(Math.max((Math.random() - 0.5) * 180, -85), 85); // Limit latitude range slightly
    const lng = Math.min(Math.max((Math.random() - 0.5) * 360, -180), 180);
    return [lat, lng];
  };

  const fetchIndicators = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://api.dhsprogram.com/rest/dhs/indicators', {
        params: {
          returnFields: 'IndicatorId,Label,Definition,MeasurementType,DataType',
          f: 'json'
        }
      });

      // Process and limit indicators for visualization
      const processedIndicators = response.data.Data
        .slice(0, 12) // Show 12 indicators for better distribution
        .map((indicator: Indicator, index: number) => {
          const position = generateRandomPosition();
          return {
            ...indicator,
            color: colors[index % colors.length],
            position,
            size: 1 // Fixed size to prevent scaling issues
          };
        })
        .filter((indicator: Indicator) => {
          // Validate position data
          return indicator.position && 
                 !isNaN(indicator.position[0]) && 
                 !isNaN(indicator.position[1]);
        });

      setIndicators(processedIndicators);
    } catch (error) {
      console.error('Error fetching indicators:', error);
      onError?.('Failed to load indicators. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize globe with safe defaults
    const globe = new Globe(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('#f8fafc')
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight)
      .pointRadius(1) // Fixed radius instead of dynamic
      .pointColor('color')
      .pointAltitude(0) // Set to 0 to prevent altitude-related issues
      .pointsMerge(false) // Disable points merging to prevent geometry issues
      .pointResolution(32) // Add point resolution for smoother geometries
      .pointLabel((d: any) => '')
      .onPointHover((point: any | null) => {
        setHoveredIndicator(point as Indicator | null);
        if (point) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      })
      .onPointClick((point: any) => {
        if (point?.IndicatorId) {
          onIndicatorSelect(point.IndicatorId);
        }
      });

    // Enable touch support
    if (containerRef.current) {
      containerRef.current.addEventListener('touchstart', (e) => {
        e.preventDefault();
      }, { passive: false });
    }

    globeRef.current = globe;

    // Handle window resize
    const handleResize = () => {
      if (containerRef.current && globeRef.current) {
        globeRef.current
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Start rotation animation with slower speed
    const rotationSpeed = 0.05;
    let lastTime = 0;
    let currentRotation = 0;

    const animate = (time: number) => {
      const frame = requestAnimationFrame(animate);
      const deltaTime = time - lastTime;
      lastTime = time;
      
      if (globeRef.current) {
        currentRotation += rotationSpeed * (deltaTime / 16.67);
        globeRef.current.pointOfView({ lat: 5, lng: currentRotation % 360 });
      }
    };
    
    requestAnimationFrame(animate);

    // Fetch indicators
    fetchIndicators();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', () => {});
      }
    };
  }, [fetchIndicators, onIndicatorSelect]);

  // Update points when indicators change
  useEffect(() => {
    if (globeRef.current && indicators.length > 0) {
      globeRef.current.pointsData(indicators);
    }
  }, [indicators]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #f1f5f9 100%)' }}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading health indicators...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredIndicator && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute p-4 bg-white rounded-lg shadow-lg max-w-md"
            style={{
              left: '50%',
              bottom: '2rem',
              transform: 'translateX(-50%)',
              zIndex: 1000
            }}
          >
            <h3 className="font-semibold text-lg mb-2">{hoveredIndicator.Label}</h3>
            <p className="text-gray-600 text-sm">{hoveredIndicator.Definition}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobeVisualization; 