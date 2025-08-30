# Performance Optimization Guide

## Current Performance Issues

Based on the Core Web Vitals analysis, your website has poor performance in:
- **Largest Contentful Paint (LCP)**: 6.48s (Poor)
- **Interaction to Next Paint (INP)**: 2,704ms (Poor)
- **Cumulative Layout Shift (CLS)**: 0.00 (Good)

## Implemented Optimizations

### 1. Code Splitting and Lazy Loading ✅
- **Lazy-loaded heavy components**: GlobeVisualization, FeedingTipsCarousel, Charts
- **Dynamic imports**: Axios, Recharts components
- **Bundle splitting**: Separated globe, charts, UI, and utils into different chunks

### 2. Globe Visualization Optimization ✅
- **Created OptimizedGlobeVisualization**: Reduced initial complexity
- **Dynamic library loading**: Globe.gl library loads only when needed
- **Reduced polygon resolution**: Lowered `polygonCapCurvatureResolution` from 3 to 2
- **Optimized auto-rotation**: Reduced speed from 0.5 to 0.3
- **Static fallback**: Added StaticGlobeFallback for immediate visual feedback

### 3. Build Optimizations ✅
- **Vite configuration**: Added code splitting, compression, and minification
- **Terser optimization**: Removed console logs and debugger statements
- **Chunk size limits**: Set warning limit to 1000KB

## Additional Optimizations Needed

### 4. Image Optimization (Critical)
```bash
# Install image optimization tools
npm install --save-dev vite-plugin-imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant
```

**Update vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimize } from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimize({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] },
      webp: { quality: 80 }
    })
  ],
  // ... existing config
})
```

### 5. CSS Optimization
**Create optimized CSS file:**
```css
/* Critical CSS - inline in HTML */
.critical-styles {
  /* Only essential styles for above-the-fold content */
}

/* Non-critical CSS - loaded asynchronously */
```

### 6. Font Optimization
**Add to index.html:**
```html
<link rel="preload" href="/fonts/your-font.woff2" as="font" type="font/woff2" crossorigin>
```

### 7. Service Worker for Caching
**Create public/sw.js:**
```javascript
const CACHE_NAME = 'nph-website-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

### 8. Critical Rendering Path Optimization

**Update index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NPH Solutions</title>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/src/assets/Company-logo.jpg" as="image">
  <link rel="dns-prefetch" href="//unpkg.com">
  <link rel="dns-prefetch" href="//api.dhsprogram.com">
  
  <!-- Inline critical CSS -->
  <style>
    /* Critical styles for above-the-fold content */
    .hero-section { /* ... */ }
    .loading-spinner { /* ... */ }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 9. API Optimization
**Implement request caching:**
```typescript
// Create src/services/apiCache.ts
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cachedApiCall = async (url: string, options?: any) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url, options);
  const data = await response.json();
  
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```

### 10. Component Optimization
**Implement React.memo for expensive components:**
```typescript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.data.id === nextProps.data.id;
});
```

## Performance Monitoring

### 1. Lighthouse CI
**Add to package.json:**
```json
{
  "scripts": {
    "lighthouse:ci": "lhci autorun"
  },
  "devDependencies": {
    "@lhci/cli": "^0.12.0"
  }
}
```

### 2. Web Vitals Monitoring
**Install and configure:**
```bash
npm install web-vitals
```

**Add to main.tsx:**
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Expected Performance Improvements

After implementing these optimizations:

- **LCP**: Should improve from 6.48s to < 2.5s (Good)
- **INP**: Should improve from 2,704ms to < 200ms (Good)
- **CLS**: Should remain < 0.1 (Good)
- **Bundle size**: Should reduce by 40-60%
- **First Contentful Paint**: Should improve by 50-70%

## Implementation Priority

1. **High Priority** (Immediate impact):
   - Image optimization
   - Critical CSS inlining
   - Font preloading

2. **Medium Priority** (Significant impact):
   - Service worker caching
   - API request caching
   - Component memoization

3. **Low Priority** (Incremental improvements):
   - Advanced caching strategies
   - Performance monitoring setup

## Testing Performance

```bash
# Build and analyze bundle
npm run build:analyze

# Run Lighthouse audit
npm run lighthouse

# Start development server and test
npm run dev
# Then run: npm run lighthouse
```

## Monitoring Tools

- **Lighthouse**: Built-in Chrome DevTools
- **WebPageTest**: Detailed performance analysis
- **GTmetrix**: Real-world performance testing
- **PageSpeed Insights**: Google's performance tool

## Next Steps

1. Implement image optimization
2. Add critical CSS inlining
3. Set up performance monitoring
4. Deploy and measure improvements
5. Iterate based on real-world data
