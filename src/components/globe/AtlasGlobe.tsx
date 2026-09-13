import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as d3 from 'd3-geo';
import * as topojson from 'topojson-client';
import topologyData from '../../data/topology.js';
import { countryByDhsCode, countryByIso3Code, type CountryOption } from '../../data/countryOptions';

interface AtlasGlobeProps {
  onCountrySelect: (country: CountryOption) => void;
  onCountryClear: () => void;
  selectedCountry: CountryOption | null;
  onError?: (message: string) => void;
  className?: string;
}

type GlobeFeature = {
  type: 'Feature';
  geometry: unknown;
  properties: { ISO_A3?: string };
};

type SceneState = {
  camera: THREE.OrthographicCamera;
  controls: OrbitControls;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  requestId: number | null;
  visible: boolean;
  pageVisible: boolean;
  reducedMotion: boolean;
  paused: boolean;
  focus: { from: THREE.Vector3; to: THREE.Vector3; startedAt: number } | null;
};

const CAMERA_DISTANCE = 3;
const GLOBE_RADIUS = 1;
// This is the camera's top/bottom extent at zoom 1. Keeping the SVG
// projection derived from it makes both render layers share the same screen
// radius at every responsive size.
const ORTHOGRAPHIC_FRAME = 1.28;
const FOCUS_DURATION = 850;
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

const longitudeLatitudeToCamera = ([longitude, latitude]: [number, number]) => {
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const horizontal = Math.cos(latitudeRadians);

  return new THREE.Vector3(
    horizontal * Math.sin(longitudeRadians),
    Math.sin(latitudeRadians),
    horizontal * Math.cos(longitudeRadians),
  ).multiplyScalar(CAMERA_DISTANCE);
};

const createAtlasTexture = (features: GlobeFeature[]) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas rendering is unavailable.');

  const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  background.addColorStop(0, '#103752');
  background.addColorStop(0.55, '#1b5a73');
  background.addColorStop(1, '#0a304a');
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'rgba(203, 231, 230, 0.13)';
  context.lineWidth = 1;
  for (let longitude = 0; longitude <= canvas.width; longitude += canvas.width / 12) {
    context.beginPath();
    context.moveTo(longitude, 0);
    context.lineTo(longitude, canvas.height);
    context.stroke();
  }
  for (let latitude = 0; latitude <= canvas.height; latitude += canvas.height / 6) {
    context.beginPath();
    context.moveTo(0, latitude);
    context.lineTo(canvas.width, latitude);
    context.stroke();
  }

  const projection = d3.geoEquirectangular()
    .translate([canvas.width / 2, canvas.height / 2])
    .scale(canvas.width / (2 * Math.PI));
  const path = d3.geoPath(projection, context);

  features.forEach((feature) => {
    context.beginPath();
    path(feature as any);
    context.fillStyle = '#83afb3';
    context.fill();
    context.strokeStyle = 'rgba(239, 251, 247, 0.68)';
    context.lineWidth = 0.75;
    context.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
};

const AtlasGlobe: React.FC<AtlasGlobeProps> = ({
  onCountrySelect,
  onCountryClear,
  selectedCountry,
  onError,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<SVGSVGElement>(null);
  const sceneRef = useRef<SceneState | null>(null);
  const onCountrySelectRef = useRef(onCountrySelect);
  const onErrorRef = useRef(onError);
  const pointerOriginRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);
  const lastViewUpdateRef = useRef(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIso3, setHoveredIso3] = useState<string | null>(null);
  const [view, setView] = useState({ longitude: 0, latitude: 0, zoom: 1 });

  useEffect(() => {
    onCountrySelectRef.current = onCountrySelect;
    onErrorRef.current = onError;
  }, [onCountrySelect, onError]);

  const features = useMemo(() => {
    const geoJson = topojson.feature(topologyData as any, (topologyData as any).objects.wb_countries) as any;
    return (geoJson.features as GlobeFeature[]).filter((feature) =>
      Boolean(feature.properties?.ISO_A3),
    );
  }, []);

  const selectedCode = selectedCountry
    ? countryByDhsCode.get(selectedCountry.value)?.iso3Code ?? null
    : null;

  const updateView = useCallback(() => {
    const state = sceneRef.current;
    if (!state) return;

    const now = performance.now();
    if (now - lastViewUpdateRef.current < 50) return;
    lastViewUpdateRef.current = now;

    const position = state.camera.position;
    const longitude = THREE.MathUtils.radToDeg(Math.atan2(position.x, position.z));
    const latitude = THREE.MathUtils.radToDeg(Math.asin(position.y / position.length()));
    setView({ longitude, latitude, zoom: state.camera.zoom });
  }, []);

  const renderScene = useCallback(() => {
    const state = sceneRef.current;
    if (!state) return;
    state.renderer.render(state.scene, state.camera);
    updateView();
  }, [updateView]);

  const stopAnimation = useCallback(() => {
    const state = sceneRef.current;
    if (state?.requestId !== null) {
      cancelAnimationFrame(state.requestId);
      state.requestId = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    const state = sceneRef.current;
    if (!state || state.requestId !== null) return;

    const tick = (now: number) => {
      const current = sceneRef.current;
      if (!current) return;

      const shouldAnimate = current.visible
        && current.pageVisible
        && !current.reducedMotion
        && (!current.paused || current.focus !== null);

      if (!shouldAnimate) {
        current.requestId = null;
        renderScene();
        return;
      }

      if (current.focus) {
        const elapsed = Math.min((now - current.focus.startedAt) / FOCUS_DURATION, 1);
        const nextPosition = current.focus.from.clone().lerp(current.focus.to, easeOutCubic(elapsed));
        current.camera.position.copy(nextPosition.normalize().multiplyScalar(CAMERA_DISTANCE));
        current.controls.update();
        if (elapsed === 1) current.focus = null;
      } else {
        current.controls.update();
      }

      renderScene();
      current.requestId = requestAnimationFrame(tick);
    };

    state.requestId = requestAnimationFrame(tick);
  }, [renderScene]);

  const focusCountry = useCallback((iso3Code: string | null, animate = true) => {
    const state = sceneRef.current;
    if (!state) return;

    if (!iso3Code) {
      state.focus = animate && !state.reducedMotion
        ? { from: state.camera.position.clone(), to: new THREE.Vector3(0, 0, CAMERA_DISTANCE), startedAt: performance.now() }
        : null;
      if (!state.focus) state.camera.position.set(0, 0, CAMERA_DISTANCE);
      state.paused = false;
      setIsPaused(false);
      renderScene();
      startAnimation();
      return;
    }

    const country = features.find((feature) => feature.properties.ISO_A3 === iso3Code);
    if (!country) return;
    const centroid = d3.geoCentroid(country as any) as [number, number];
    const destination = longitudeLatitudeToCamera(centroid);
    state.focus = animate && !state.reducedMotion
      ? { from: state.camera.position.clone(), to: destination, startedAt: performance.now() }
      : null;
    if (!state.focus) state.camera.position.copy(destination);
    state.paused = true;
    setIsPaused(true);
    renderScene();
    startAnimation();
  }, [features, renderScene, startAnimation]);

  useEffect(() => {
    if (!isReady) return;
    focusCountry(selectedCode);
  }, [focusCountry, isReady, selectedCode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width: Math.max(width, 1), height: Math.max(height, 1) });
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const state = sceneRef.current;
    if (!state || size.width === 0 || size.height === 0) return;
    const aspect = size.width / size.height;
    state.camera.left = -ORTHOGRAPHIC_FRAME * aspect;
    state.camera.right = ORTHOGRAPHIC_FRAME * aspect;
    state.camera.top = ORTHOGRAPHIC_FRAME;
    state.camera.bottom = -ORTHOGRAPHIC_FRAME;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(size.width, size.height, false);
    renderScene();
  }, [renderScene, size]);

  useEffect(() => {
    const host = canvasHostRef.current;
    const overlay = overlayRef.current;
    if (!host || !overlay) return;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 100);
      camera.position.set(0, 0, CAMERA_DISTANCE);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(0x000000, 0);
      host.replaceChildren(renderer.domElement);

      const texture = createAtlasTexture(features);
      const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
      const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 10, specular: new THREE.Color('#bfdfe0') });
      const globe = new THREE.Mesh(geometry, material);
      // Three's sphere UV origin differs from geographic longitude. This aligns
      // the generated equirectangular texture with the D3 overlay's 0° meridian.
      globe.rotation.y = -Math.PI / 2;
      scene.add(globe);
      scene.add(new THREE.AmbientLight('#dceff2', 1.5));
      const keyLight = new THREE.DirectionalLight('#fff2d7', 2.1);
      keyLight.position.set(-3, 2, 4);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight('#67c5c7', 0.75);
      fillLight.position.set(3, -1, 2);
      scene.add(fillLight);

      const controls = new OrbitControls(camera, overlay);
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.minZoom = 0.88;
      controls.maxZoom = 1.55;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.42;

      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const state: SceneState = {
        camera,
        controls,
        renderer,
        scene,
        requestId: null,
        visible: true,
        pageVisible: !document.hidden,
        reducedMotion: mediaQuery.matches,
        paused: false,
        focus: null,
      };
      sceneRef.current = state;

      const observer = new IntersectionObserver(([entry]) => {
        state.visible = entry.isIntersecting;
        if (state.visible) startAnimation();
        else stopAnimation();
      }, { threshold: 0.05 });
      observer.observe(host);

      const onVisibilityChange = () => {
        state.pageVisible = !document.hidden;
        if (state.pageVisible) startAnimation();
        else stopAnimation();
      };
      const onMotionPreferenceChange = () => {
        state.reducedMotion = mediaQuery.matches;
        if (state.reducedMotion) stopAnimation();
        else startAnimation();
      };
      const onControlsChange = () => {
        // The regular view update is intentionally throttled while the globe
        // rotates. Zoom must be synchronized immediately, however, because it
        // changes the rendered sphere's screen radius.
        setView((currentView) => (
          Math.abs(currentView.zoom - state.camera.zoom) < 0.0001
            ? currentView
            : { ...currentView, zoom: state.camera.zoom }
        ));
        renderScene();
        if (!state.reducedMotion) startAnimation();
      };
      controls.addEventListener('change', onControlsChange);
      document.addEventListener('visibilitychange', onVisibilityChange);
      mediaQuery.addEventListener('change', onMotionPreferenceChange);

      setIsReady(true);
      renderScene();
      startAnimation();

      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        mediaQuery.removeEventListener('change', onMotionPreferenceChange);
        controls.removeEventListener('change', onControlsChange);
        stopAnimation();
        controls.dispose();
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        host.replaceChildren();
        sceneRef.current = null;
      };
    } catch (initializationError) {
      const message = 'The interactive globe could not start. Country search and data panels remain available.';
      setError(message);
      onErrorRef.current?.(message);
      console.error(initializationError);
      return undefined;
    }
  }, [features, renderScene, startAnimation, stopAnimation]);

  const globePixelRadius = (size.height * GLOBE_RADIUS * view.zoom) / (2 * ORTHOGRAPHIC_FRAME);
  const projection = useMemo(() => d3.geoOrthographic()
    .translate([size.width / 2, size.height / 2])
    .scale(globePixelRadius)
    .rotate([-view.longitude, -view.latitude])
    .clipAngle(90), [globePixelRadius, size.height, size.width, view.latitude, view.longitude]);
  const path = useMemo(() => d3.geoPath(projection).pointRadius(4), [projection]);

  const chooseCountry = (iso3Code: string) => {
    if (draggedRef.current) return;
    const country = countryByIso3Code.get(iso3Code);
    if (country) onCountrySelectRef.current({ value: country.value, label: country.label });
  };

  const toggleRotation = () => {
    const state = sceneRef.current;
    if (!state) return;
    state.paused = !state.paused;
    setIsPaused(state.paused);
    if (state.paused) stopAnimation();
    else startAnimation();
    renderScene();
  };

  return (
    <div ref={containerRef} className={`relative min-h-[330px] w-full overflow-hidden rounded-2xl bg-[#0b344c] shadow-xl ${className}`}>
      <div ref={canvasHostRef} className="absolute inset-0" aria-hidden="true" />
      <svg
          ref={overlayRef}
          className="absolute inset-0 h-full w-full touch-none"
          viewBox={`0 0 ${Math.max(size.width, 1)} ${Math.max(size.height, 1)}`}
          role="img"
          aria-label="Interactive globe. Choose a country from the search box or select it on the globe."
          onPointerDown={(event) => {
            pointerOriginRef.current = { x: event.clientX, y: event.clientY };
            draggedRef.current = false;
          }}
          onPointerMove={(event) => {
            const origin = pointerOriginRef.current;
            if (origin && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 6) {
              draggedRef.current = true;
            }
          }}
          onPointerUp={() => {
            window.setTimeout(() => { draggedRef.current = false; }, 0);
          }}
        >
          <circle cx={size.width / 2} cy={size.height / 2} r={globePixelRadius} fill="none" stroke="rgba(231, 248, 243, 0.34)" strokeWidth="1.5" pointerEvents="none" />
          {features.map((feature) => {
            const iso3Code = feature.properties.ISO_A3;
            if (!iso3Code || !countryByIso3Code.has(iso3Code)) return null;
            const d = path(feature as any);
            if (!d) return null;
            const isSelected = iso3Code === selectedCode;
            const isHovered = iso3Code === hoveredIso3;
            return (
              <path
                key={iso3Code}
                d={d}
                fill={isSelected ? 'rgba(239, 68, 68, 0.58)' : isHovered ? 'rgba(245, 158, 11, 0.5)' : 'transparent'}
                stroke={isSelected ? '#fff7ed' : isHovered ? '#fbbf24' : 'rgba(224, 244, 240, 0.2)'}
                strokeWidth={isSelected ? 2.4 : isHovered ? 1.7 : 0.55}
                className="cursor-pointer transition-colors"
                onMouseEnter={() => setHoveredIso3(iso3Code)}
                onMouseLeave={() => setHoveredIso3(null)}
                onClick={() => chooseCountry(iso3Code)}
              />
            );
          })}
        </svg>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={toggleRotation}
          className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
          aria-pressed={isPaused}
        >
          {isPaused ? 'Resume rotation' : 'Pause rotation'}
        </button>
        {selectedCountry && (
          <button
            type="button"
            onClick={onCountryClear}
            className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Reset view
          </button>
        )}
      </div>
      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0b344c]/80 text-sm font-medium text-white">
          Preparing the globe…
        </div>
      )}
      {error && (
        <div className="absolute inset-x-5 bottom-14 rounded-lg bg-white/95 p-3 text-sm text-slate-700 shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default AtlasGlobe;
