import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
// Camera top/bottom extent at zoom 1; SVG scale is read from the live camera.
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
  // U increases eastward after the mesh's -PI/2 rotation. Keep the texture
  // unmirrored: reversing U puts the surface and overlay on opposite meridians.
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
  const outlineRef = useRef<SVGCircleElement>(null);
  const clipCircleRef = useRef<SVGCircleElement>(null);
  const countryPathsRef = useRef(new Map<string, SVGPathElement>());
  const viewportRef = useRef(new THREE.Vector2());
  const cameraDirectionRef = useRef(new THREE.Vector3());
  const projectedCenterRef = useRef(new THREE.Vector3());
  const projectedEdgeRef = useRef(new THREE.Vector3());
  const cameraRightRef = useRef(new THREE.Vector3());
  const clipId = useId();
  const sceneRef = useRef<SceneState | null>(null);
  const onCountrySelectRef = useRef(onCountrySelect);
  const onErrorRef = useRef(onError);
  const pointerOriginRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIso3, setHoveredIso3] = useState<string | null>(null);
  const projection = useMemo(() => d3.geoOrthographic().clipAngle(90).precision(0.2), []);
  const path = useMemo(() => d3.geoPath(projection).pointRadius(4), [projection]);

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

    const cameraDirection = cameraDirectionRef.current
      .copy(state.camera.position)
      .sub(state.controls.target)
      .normalize();
    const longitude = THREE.MathUtils.radToDeg(Math.atan2(cameraDirection.x, cameraDirection.z));
    const latitude = THREE.MathUtils.radToDeg(Math.asin(cameraDirection.y));
    const viewport = state.renderer.getSize(viewportRef.current);

    // Project the sphere itself through Three's live camera instead of
    // duplicating its zoom/aspect maths. This gives the SVG the exact same
    // centre and silhouette radius at every viewport size and zoom level.
    const projectedCenter = projectedCenterRef.current.set(0, 0, 0).project(state.camera);
    const cameraRight = cameraRightRef.current
      .setFromMatrixColumn(state.camera.matrixWorld, 0)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS);
    const projectedEdge = projectedEdgeRef.current.copy(cameraRight).project(state.camera);
    const centerX = (projectedCenter.x + 1) * viewport.x / 2;
    const centerY = (1 - projectedCenter.y) * viewport.y / 2;
    const radius = Math.abs(projectedEdge.x - projectedCenter.x) * viewport.x / 2;

    projection
      .translate([centerX, centerY])
      .scale(radius)
      .rotate([-longitude, -latitude]);

    // Update both render layers in the same frame. React owns country styles
    // and events; the camera owns path geometry so it cannot lag during motion.
    for (const circle of [outlineRef.current, clipCircleRef.current]) {
      circle?.setAttribute('cx', String(centerX));
      circle?.setAttribute('cy', String(centerY));
      circle?.setAttribute('r', String(radius));
    }
    for (const feature of features) {
      const element = countryPathsRef.current.get(feature.properties.ISO_A3 ?? '');
      if (element) element.setAttribute('d', path(feature as any) ?? '');
    }
  }, [features, path, projection]);

  const renderScene = useCallback(() => {
    const state = sceneRef.current;
    if (!state) return;
    state.renderer.render(state.scene, state.camera);
    updateView();
  }, [updateView]);

  const stopAnimation = useCallback(() => {
    const state = sceneRef.current;
    if (state && state.requestId !== null) {
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
        current.camera.lookAt(current.controls.target);
        if (elapsed === 1) current.focus = null;
      } else {
        current.controls.autoRotate = !current.paused && !current.reducedMotion;
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

    // Flush drag damping before focus takes ownership of the camera. Otherwise
    // OrbitControls adds its residual rotation to the requested destination.
    const from = state.camera.position.clone();
    state.controls.autoRotate = false;
    state.controls.enableDamping = false;
    state.controls.update();
    state.controls.enableDamping = !state.reducedMotion;
    state.camera.position.copy(from);
    state.camera.lookAt(state.controls.target);

    if (!iso3Code) {
      state.focus = animate && !state.reducedMotion
        ? { from: state.camera.position.clone(), to: new THREE.Vector3(0, 0, CAMERA_DISTANCE), startedAt: performance.now() }
        : null;
      if (!state.focus) state.camera.position.set(0, 0, CAMERA_DISTANCE);
      state.camera.lookAt(state.controls.target);
      state.camera.zoom = 1;
      state.camera.updateProjectionMatrix();
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
    state.camera.lookAt(state.controls.target);
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

  const applyViewport = useCallback((width: number, height: number) => {
    const state = sceneRef.current;
    if (!state || width <= 0 || height <= 0) return;

    const aspect = width / height;
    state.camera.left = -ORTHOGRAPHIC_FRAME * aspect;
    state.camera.right = ORTHOGRAPHIC_FRAME * aspect;
    state.camera.top = ORTHOGRAPHIC_FRAME;
    state.camera.bottom = -ORTHOGRAPHIC_FRAME;
    state.camera.updateProjectionMatrix();
    // Keep the WebGL CSS viewport equal to the SVG viewport. Three still
    // renders at the configured device-pixel ratio in its drawing buffer.
    state.renderer.setSize(width, height);
  }, []);

  useLayoutEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    applyViewport(size.width, size.height);
    renderScene();
  }, [applyViewport, renderScene, size]);

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
      renderer.setClearColor(0xfbfaf7, 1);
      // Drawing-buffer pixels include DPR; the displayed canvas must use the
      // same CSS viewport as the SVG, including on high-density displays.
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      host.replaceChildren(renderer.domElement);

      const texture = createAtlasTexture(features);
      const geometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
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
      controls.autoRotate = !mediaQuery.matches;
      controls.enableDamping = !mediaQuery.matches;
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

      const initialRect = host.getBoundingClientRect();
      applyViewport(initialRect.width, initialRect.height);
      setSize({ width: Math.max(initialRect.width, 1), height: Math.max(initialRect.height, 1) });

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
        controls.autoRotate = !state.paused && !state.reducedMotion;
        controls.enableDamping = !state.reducedMotion;
        if (state.reducedMotion) {
          stopAnimation();
          if (state.focus) {
            camera.position.copy(state.focus.to);
            camera.lookAt(controls.target);
            state.focus = null;
          }
          renderScene();
        } else startAnimation();
      };
      const onControlsChange = () => {
        // An active animation frame renders both layers after controls.update;
        // avoid regenerating every country path twice for the same camera.
        if (state.requestId === null) renderScene();
        if (!state.reducedMotion) startAnimation();
      };
      const onControlsStart = () => {
        state.focus = null;
        controls.autoRotate = !state.paused && !state.reducedMotion;
      };
      controls.addEventListener('change', onControlsChange);
      controls.addEventListener('start', onControlsStart);
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
        controls.removeEventListener('start', onControlsStart);
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
  }, [applyViewport, features, renderScene, startAnimation, stopAnimation]);

  const chooseCountry = (iso3Code: string) => {
    if (draggedRef.current) return;
    const country = countryByIso3Code.get(iso3Code);
    if (country) onCountrySelectRef.current({ value: country.value, label: country.label });
  };

  const toggleRotation = () => {
    const state = sceneRef.current;
    if (!state) return;
    state.paused = !state.paused;
    state.controls.autoRotate = !state.paused && !state.reducedMotion;
    setIsPaused(state.paused);
    if (state.paused) stopAnimation();
    else startAnimation();
    renderScene();
  };

  return (
    <div ref={containerRef} className={`relative min-h-[330px] w-full overflow-hidden bg-[#fbfaf7] ${className}`}>
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
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <circle ref={clipCircleRef} />
            </clipPath>
          </defs>
          <circle ref={outlineRef} fill="none" stroke="rgba(231, 248, 243, 0.34)" strokeWidth="1.5" pointerEvents="none" />
          <g clipPath={`url(#${clipId})`}>
          {features.map((feature) => {
            const iso3Code = feature.properties.ISO_A3;
            if (!iso3Code || !countryByIso3Code.has(iso3Code)) return null;
            const isSelected = iso3Code === selectedCode;
            const isHovered = iso3Code === hoveredIso3;
            return (
              <path
                key={iso3Code}
                ref={(element) => {
                  if (element) countryPathsRef.current.set(iso3Code, element);
                  else countryPathsRef.current.delete(iso3Code);
                }}
                data-country-code={iso3Code}
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
          </g>
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
        <div className="absolute inset-0 flex items-center justify-center bg-[#fbfaf7]/90 text-sm font-medium text-slate-700">
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
