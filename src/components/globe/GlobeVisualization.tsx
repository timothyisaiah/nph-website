import React, { useEffect, useRef, useState, useCallback } from 'react';
import { indicators as localIndicators } from '../../data/indicators';
import type { Indicator } from '../../data/indicators';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from 'globe.gl';
import classNames from 'classnames';

interface GlobeVisualizationProps {
  onError?: (error: string) => void;
  onIndicatorSelect?: (indicatorId: string) => void;
}

const colors = [
  '#00A0DC', '#7AC36A', '#F15A60', '#9B5DE5', '#F5A623',
  '#2CCCE4', '#FF66B2', '#5C6BC0', '#42B883', '#FF7043',
  '#FFD600', '#8D6E63', '#00B8D4', '#C51162', '#43A047',
  '#FF3D00', '#6D4C41', '#1DE9B6', '#D500F9', '#FFAB00'
];

const generateRandomPosition = (): [number, number] => {
  const lat = Math.min(Math.max((Math.random() - 0.5) * 180, -85), 85);
  const lng = Math.min(Math.max((Math.random() - 0.5) * 360, -180), 180);
  return [lat, lng];
};

// Helper to get tagline (first sentence of definition)
const getTagline = (definition: string) => {
  const match = definition.match(/^(.*?\.|\!|\?)(\s|$)/);
  return match ? match[1] : definition;
};



const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ onError, onIndicatorSelect }) => {
  const globeRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicators, setIndicators] = useState<(Indicator & { color: string; lat: number; lng: number; size: number; })[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hoveredIndicator, setHoveredIndicator] = useState<Indicator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Prepare indicators with color and position
  useEffect(() => {
    const processed = localIndicators.map((indicator, idx) => {
      const [lat, lng] = generateRandomPosition();
      return {
        ...indicator,
        color: colors[idx % colors.length],
        lat,
        lng,
        size: 1
      };
    });
    setIndicators(processed);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const globe = new Globe(containerRef.current)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('#ffffff')
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight)
      .enablePointerInteraction(true)
      .pointRadius(1)
      .pointColor('color')
      .pointAltitude(0)
      .pointsMerge(false)
      .pointResolution(32)
      .pointLabel((d: any) => '')
      .onPointHover((point: any | null) => {
        setHoveredIndicator(point as Indicator | null);
        document.body.style.cursor = point ? 'pointer' : 'default';
      })
      .onPointClick((point: any) => {
        if (point && point.id) {
          const idx = indicators.findIndex(ind => ind.id === point.id);
          setSelectedIdx(idx);
          onIndicatorSelect?.(point.id);
        }
      });

    // Set fixed camera position to prevent zooming
    globe.pointOfView({ lat: 5, lng: 0, altitude: 2.5 });

    // Disable zoom controls directly
    if (globe.controls()) {
      globe.controls().enableZoom = false;
      // globe.controls().enablePan = false;
      // globe.controls().enableRotate = false;
    }

    // Touch support
    if (containerRef.current) {
      containerRef.current.addEventListener('touchstart', (e) => {
        e.preventDefault();
      }, { passive: false });
      
      // Prevent wheel events (zoom)
      containerRef.current.addEventListener('wheel', (e) => {
        e.preventDefault();
      }, { passive: false });
      
      // Prevent pinch zoom on touch devices
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
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Rotation
    const rotationSpeed = 0.05;
    let lastTime = 0;
    let currentRotation = 0;
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      const deltaTime = time - lastTime;
      lastTime = time;
      if (globeRef.current) {
        currentRotation += rotationSpeed * (deltaTime / 16.67);
        globeRef.current.pointOfView({ lat: 5, lng: currentRotation % 360 });
      }
    };
    requestAnimationFrame(animate);

    // Set points
    if (indicators.length > 0) {
      globe.pointsData(indicators);
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) globeRef.current = null;
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', () => {});
      }
    };
    // eslint-disable-next-line
  }, [indicators, onIndicatorSelect]);

  // Highlight selected indicator
  useEffect(() => {
    if (globeRef.current && selectedIdx !== null && indicators[selectedIdx]) {
      globeRef.current.pointsData(indicators.map((ind, idx) =>
        idx === selectedIdx ? { ...ind, color: '#FFD600', size: 1.5 } : { ...ind, size: 1 }
      ));
    }
  }, [selectedIdx, indicators]);

  // Navigation handlers
  const handleNext = () => {
    if (selectedIdx === null) setSelectedIdx(0);
    else setSelectedIdx((selectedIdx + 1) % indicators.length);
  };
  const handlePrev = () => {
    if (selectedIdx === null) setSelectedIdx(indicators.length - 1);
    else setSelectedIdx((selectedIdx - 1 + indicators.length) % indicators.length);
  };
  const handleClose = () => setSelectedIdx(null);

  return (
    <div className="relative w-full h-full">
      {/* Globe Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ background: 'transparent' }}
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
            <h3 className="font-semibold text-lg mb-2">{hoveredIndicator.label}</h3>
            <p className="text-gray-600 text-sm">{hoveredIndicator.definition}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobeVisualization; 