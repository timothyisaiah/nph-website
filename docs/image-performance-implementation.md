# Image performance implementation report

Implemented: 17 September 2026.

## Coverage

All active raster-image surfaces now use the shared responsive renderer: About, Services, Thematic Areas, page banners, Navbar/About branding, Data Insights thumbnails, and data-brief detail charts. The unused `ServiceCard` was migrated as a regression safeguard. Home has no raster content image beyond shared branding; its globe remains generated graphics.

The source library contains 37 preserved inputs: 11 photographs, 25 charts, and one logo. Five formerly remote Unsplash photographs are now local; their source identifiers, acquisition settings, and retained attribution are documented in `src/assets/image-sources/README.md`. The existing public MDD chart URL remains available for external consumers, while the application uses generated responsive candidates.

## Delivery changes

- Photographs: width candidates from 320px through a justified maximum of 1280px or 1600px, without upscaling; AVIF, WebP, and responsive JPEG fallback.
- Charts: lossless WebP candidates from 320px through source width plus an optimized full-resolution PNG fallback; charts render with `object-fit: contain`.
- Branding: responsive application variants plus stable 192px and 512px manifest icons and a 1200×630 social preview under `/images/brand/`.
- Loading: no IntersectionObserver gate or guessed file extension. Visible content can load eagerly without automatically receiving high fetch priority; deferred content uses native lazy loading. Decorative banners are low-priority pictures with empty alt text.
- Correctness: intrinsic dimensions reserve space, the component resets after asset changes, and a failed selected AVIF/WebP candidate retries the real fallback before showing a bounded error state.
- Caching: generated application assets are imported through Vite and therefore content-hashed. The development-only blanket one-year cache header was removed.

## Asset results

The three largest original local photographs totalled 5,263,478 bytes. Their generated 800px WebP candidates total 253,474 bytes, a 95.2% reduction for that candidate set. Actual route transfer depends on viewport, DPR, format support, and which content is scrolled into view.

Representative generated sizes:

| Asset | 640px AVIF | 640px WebP | 1280px AVIF | 1280px WebP |
| --- | ---: | ---: | ---: | ---: |
| Public Health | 25.7 KiB | 30.7 KiB | 110.8 KiB | 127.1 KiB |
| Monitoring & Evaluation | 21.5 KiB | 28.2 KiB | 48.5 KiB | 68.8 KiB |
| Health and Environment | 71.8 KiB | 71.1 KiB | 273.5 KiB | 288.6 KiB |
| Political Economy | 51.1 KiB | 56.3 KiB | 172.6 KiB | 190.1 KiB |
| About | 9.1 KiB | 15.4 KiB | 19.2 KiB | 38.7 KiB |

Every ordinary photo candidate passes the configured 200 KiB mobile/300 KiB desktop budgets. The generated report with every variant and exact byte size is `src/assets/generated/image-report.json`.

## Production cache observation

The live domain currently routes through Cloudflare and GitHub Pages. On 17 September 2026, the deployed HTML and manifest returned `Cache-Control: max-age=600`; a content-hashed JavaScript asset and the hashed logo returned `Cache-Control: max-age=14400`. The prior Unsplash photo returned `Cache-Control: public, max-age=31536000`, but required the additional remote origin. This implementation removes that connection for content photos and guarantees URL changes through Vite hashing. The hosting stack does not currently expose an immutable one-year policy for hashed first-party assets; changing Cloudflare/GitHub Pages policy remains a deployment configuration follow-up rather than an application-code change.

## Verification

Passed:

- `npm run images:verify`
- `npm run lint`
- `npm run build`
- `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.node.json`
- `git diff --check`
- second image-generation run changed zero generated files
- asset-level visual inspection of the most aggressively compressed photo, two detailed photos, and a chart with small labels

The direct application project check (`tsc --noEmit -p tsconfig.app.json`) still reports unrelated pre-existing errors in the globe/select/router/WHO LMS code. The repository's normal `npm run build` passes because it uses the root project configuration.

Automated route screenshots, `currentSrc` capture, throttled LCP/CLS samples, and failure-injection browser checks could not run because the in-app browser connection was unavailable in this session. No claim is made for measured LCP, CLS, or route transfer. Those production/browser measurements should be captured after deployment using the exact profiles in the workplan.
