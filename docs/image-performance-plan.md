# Image loading optimization workplan

Prepared: 17 September 2026. Status: proposed implementation plan, based on source inspection, local image metadata, and an in-memory compression experiment. Production request timings, cache headers, and visual quality have not yet been measured. Effort estimate: 5–7 engineering days, followed by monitoring.

**Objective**

Make images appear promptly on About, Thematic Areas, Services, and the rest of the site, especially on mobile connections. Preserve the existing design, useful image detail, chart readability, and accessibility. Deliver a repeatable image pipeline so future additions retain these improvements.

**What the repository shows**

| Finding | Evidence | Implication |
| --- | --- | --- |
| Three photographs remain unusually large despite their WebP format. | `src/assets/optimized/Political Economy.webp`: 4032×1816, 1.88 MiB; `Health and Environment.webp`: 2268×1971, 1.66 MiB; `Public Health.webp`: 4032×1816, 1.48 MiB. | Resizing and quality tuning are the first priority. Changing format alone is insufficient. |
| Services has only a partial responsive loading implementation. | `OptimizedImage.tsx` supplies one URL per source; its `sizes` prop has no width-based candidate list. `priority` changes loading but does not set fetch priority. | Small screens still receive the same local image as large screens. |
| The shared component delays discovery and guesses file paths. | It mounts the picture only after a 50px IntersectionObserver threshold, then also uses native lazy loading. It constructs a WebP URL by replacing the extension. | Scrolling can expose placeholders before requests finish. Guessed URLs may not exist, especially after Vite hashing; an HTTP failure on a selected source does not automatically select the fallback image. |
| Other image paths bypass the shared component. | About uses a fixed 800×600 Unsplash request; `ThematicBlock` uses plain images; `DataBriefDetail` uses plain chart images. | Loading policy, responsive sizing, and space reservation need consistent handling. Some existing CSS already reserves space, so actual layout shift must be measured. |
| Page banners load unparameterized remote photographs. | `PageLayout.tsx` uses CSS backgrounds; Services and Thematic Areas pass bare Unsplash URLs. | Response size is uncontrolled by this code. Decorative banners can compete with more important content. |
| Existing scripts are incomplete and unsafe to reuse unchanged. | The generic optimizer skips smaller files, does not supply resize dimensions, scans its own output, flattens names, and logs errors without failing. The service script replaces its three input files. Neither runs in `prebuild`. | Build a deterministic pipeline with separate input/output directories before mass conversion. |
| There are additional image roles across the site. | 25 charts total about 4.69 MiB; the shared 800×727 JPEG logo is about 54 KiB. One chart lives in `public/databriefs`. | Include charts, shared branding, and public assets, with separate quality policies. |
| Caching in Vite currently applies to development. | `vite.config.ts` sets `server.headers`; deployment uses `gh-pages`. | Verify the actual production host and its response headers; this setting does not establish production cache policy. |
| Several static metadata URLs refer to source files. | `index.html`, `SEOHead.tsx`, and `public/manifest.json` contain `/src/assets/Company-logo.jpg` references. | Check the built favicon, social previews, and manifest icons and supply stable production URLs where needed. |

The full local raster inventory is 32 files totaling approximately 10.07 MiB. This is repository inventory, not the amount downloaded by a visitor on one page. Importing image URLs into JavaScript also does not by itself mean all those images are requested.

An in-memory trial resized the three largest photographs to 800px-wide WebP at quality 80: their combined size fell from 5,263,478 bytes to 360,174 bytes, about 93% smaller. This establishes a promising opportunity, not a measured page-speed gain or an approved quality setting. Larger displays, device pixel ratio, and crop requirements need additional variants.

**Recommended implementation approach**

Use the existing React/Vite static deployment and installed Sharp dependency. Generate images during the build and import their generated URLs through a typed manifest. Vite can hash imported assets for versioning; files in `public` retain their names. See [Vite static asset handling](https://vite.dev/guide/assets.html).

For the small, fixed set of remote photographs, acquire and preserve the current images as local source assets, retaining attribution and source information. If an image must remain remote, give it explicit width, quality, crop, and format parameters supported by its provider, with responsive candidates. Avoid a new image service or hosting migration unless production measurements justify it.

**Delivery sequence**

| Phase | Work and deliverable | Dependency | Estimated effort |
| --- | --- | --- | --- |
| 1. Establish the baseline | Route/image inventory, production network captures, screenshots, measurements, and agreed budgets. | None | 0.5 day |
| 2. Build the asset pipeline | Preserved sources, generated variants, typed manifest, and reproducible build integration. | Baseline image roles and dimensions | 1–1.5 days |
| 3. Repair the shared renderer | Reliable responsive image component and explicit loading policies. | Manifest contract agreed; can overlap with phase 2 | 0.5–1 day |
| 4. Migrate page usage | About, Services, Thematic Areas, shared banners, logo, and data-brief images. | Phases 2–3 | 1 day |
| 5. Verify delivery and caching | Production-host findings, valid asset URLs, measured cache behavior. | Generated assets and migrated pages | 0.5 day |
| 6. Validate and prevent regressions | Before/after report, browser checks, repeatable image budget checks. | Phases 4–5 | 1–1.5 days |
| 7. Release and observe | Deployment checks, rollback reference, and follow-up measurements. | Acceptance gates passed | 0.5 day plus observation |

The frontend developer owns implementation and measurements. A content/design reviewer checks crop and visual quality; the maintainer handles release and any hosting configuration. One person can perform multiple roles.

**Phase 1 — Establish a reproducible baseline**

1. Inventory every rendered image and background: route, source URL, dimensions, file/transfer size, rendered size, crop, loading policy, and whether it appears initially at each breakpoint. Distinguish active components from unused code; `ServiceCard.tsx` currently has no consumers.
2. Cover `/about`, `/services`, `/thematic-areas`, `/`, `/data`, and representative `/data-brief/:briefId` routes, including the public-directory chart and a detailed chart with small text. Smoke-check `/contact`, `/publications`, and `/data-explorer` for shared branding and layout effects.
3. Use a production build and the deployed site. The existing Lighthouse command targets the development server and only `/`; replace this measurement workflow with pinned tooling, explicit URLs, and recorded settings.
4. Run five cold-load samples per primary route and profile. Suggested mobile profile: 390×844, DPR 2, 1.6 Mbps download, 150ms RTT, 4× CPU slowdown; desktop: 1440×900, recorded network/CPU settings. Keep browser, tool version, hardware, and throttle method constant. Include a desktop DPR 2 visual/candidate check.
5. Save medians and ranges for LCP, CLS, image request count/bytes, selected `currentSrc`, and image request start/completion times. Define initial image bytes as requests initiated before scrolling during a fixed five-second observation window; separately measure a complete scroll through the page.
6. Capture warm revisits and internal navigation separately. Inspect request waterfalls for duplicate downloads, remote connection cost, failed requests, and time spent waiting for JavaScript. Do not treat ordinary page-load LCP as a reliable measurement of every SPA navigation.
7. Identify the actual largest contentful element per viewport. It may be text or a card rather than the banner; split its delay into discovery, download, and rendering. [Google's LCP optimization guidance](https://web.dev/articles/optimize-lcp) explains this distinction.

Deliverable: a route-by-route baseline table and prioritized list of actual bottlenecks. Confirm the provisional budgets below before implementation.

**Phase 2 — Generate appropriately sized assets**

1. Preserve current local photographs in a dedicated source directory. No separate high-quality masters were found in `src/assets` or `public`; obtain masters if available and otherwise preserve the existing files before re-encoding.
2. Consolidate the two scripts into one pipeline with explicit roles: photograph, decorative banner, logo/icon, and chart. Keep generated output outside the input tree; use unique namespaced paths and atomic writes. Fail on missing inputs, invalid images, or encoding errors. Use the installed, lockfile-controlled Sharp dependency rather than installing dependencies from inside a script.
3. Start with a candidate width set such as 320, 480, 640, 800, 960, 1280, and 1600px. Generate only sizes justified by actual layouts; never upscale. Add a larger banner candidate only where viewport/DPR measurements show it is useful.
4. For photographs, compare WebP and AVIF at representative sizes. Include AVIF when it produces a useful saving at acceptable quality, plus WebP and a correctly sized JPEG fallback where required by supported browsers. Review crops at mobile and desktop dimensions.
5. Preserve sharp text and axes in charts. Compare optimized PNG with lossless WebP before adopting lossy compression; use full-resolution detail assets when needed. Generate chart thumbnails only for UI locations that actually display thumbnails.
6. Generate appropriately sized logo variants without changing its artwork. Provide correctly sized public manifest icons and a stable social-preview image; verify referenced dimensions and URLs.
7. Generate a typed manifest containing real imported URLs, candidate widths, intrinsic dimensions, formats, and file sizes. Keep alt text, credits, image roles, and crop/focal-point settings in the image registry. Do not infer alternate formats from filename extensions.
8. Run generation in `prebuild` alongside existing sitemap generation and provide an explicit development command. Cache work by source content and transformation settings. A second run with unchanged inputs must produce no content changes. Exclude source masters from the deployed asset graph and copied public directory.

Deliverable: reproducible assets and manifest, with a report showing size by role and variant. No source images overwritten.

**Phase 3 — Repair the shared image component**

1. Replace string-only input with manifest data and render explicit `<picture>` sources, width-based `srcSet`, and accurate `sizes` on each relevant source/fallback. `sizes` must describe the layout slot, including container limits and gutters. [Responsive image guidance](https://web.dev/learn/design/responsive-images) covers candidate selection and reserving space.
2. Separate loading and priority: visible images load eagerly; only a confirmed critical image receives `fetchPriority="high"`; distant content uses native `loading="lazy"`. Remove the additional observer gate unless a measured case needs it. Browsers may fetch nearby offscreen images in advance, which is expected. See [browser-level lazy loading](https://web.dev/articles/browser-level-image-lazy-loading).
3. Reserve space with intrinsic dimensions and the intended aspect ratio or fixed-height container at each breakpoint. Keep `object-fit` and focal points appropriate to photographs; preserve chart content with `contain`.
4. Remove unnecessary load-event opacity delays for critical images. Use inexpensive placeholders for deferred content, with reduced-motion support where animated placeholders remain.
5. Handle cached images, source changes during navigation, and failed requests. Reset loading/error state when the asset changes and use a real fallback without recursive retry loops. Unsupported-format fallback and network-error recovery require different handling.
6. Add a preload only if the waterfall proves late discovery of a critical image. Match its selected format/candidates/sizing and avoid fetching multiple variants. A React-rendered preload still waits for JavaScript; if that delay dominates, evaluate route-specific static HTML/prerendering as a separately scoped follow-up. Never preload every route's hero in the shared HTML shell.

Deliverable: one reliable image API used consistently across active image components, with targeted checks for candidate selection, source changes, and failure recovery.

**Phase 4 — Migrate the site in priority order**

| Surface | Planned change | Verification |
| --- | --- | --- |
| About | Replace the fixed remote photograph with manifest variants; optimize its logo usage. Set loading policy based on visibility at each breakpoint. | Photo remains correctly cropped; mobile text-first layout does not force an unnecessary high-priority request. |
| Services | Use responsive variants for all four service photographs. Reassess `priority={index === 0}` against actual initial visibility. | Large Public Health source no longer reaches mobile unchanged; scrolling reveals images promptly. |
| Thematic Areas | Migrate all six cards, including remote photos; reserve image space explicitly on mobile. | Smaller candidates load in desktop's narrow card image columns; text and images do not jump as assets arrive. |
| Shared PageLayout | Replace CSS photograph backgrounds with positioned responsive pictures while preserving opacity, crop, and overlays. Treat decorative images as `alt=""`; keep normal priority unless evidence requires otherwise. | Services, Thematic Areas, Data Insights, and data-brief states retain their appearance and improve transfer size. |
| Shared logo and metadata | Optimize Navbar/About logo sizes; correct manifest/social-image production paths. | Branding remains crisp and icons/social images resolve with image content types. |
| Data briefs | Include both imported and public-directory charts; retain readable detail and download behavior. Preserve an existing public URL if it has external consumers. | Small labels remain legible; no cropped axes; navigation updates the correct chart. |
| Other routes | Audit shared images and any active image backgrounds. | No new errors on Home, Contact, Publications, or Data Explorer. The current Home globe is generated graphics, so its rendering requires separate profiling if slow. |

Deliverable: all active raster-image paths covered, with existing design and functionality preserved.

**Phase 5 — Validate production delivery and caching**

1. Verify the live domain's hosting/CDN arrangement and actual response headers for HTML, hashed assets, public images, and retained external images.
2. Where supported, use long-lived immutable caching for content-hashed assets and short-lived/revalidated HTML. Stable public filenames need an explicit versioning or revalidation policy. If the current host controls cache headers, document the effective policy and measure it; only introduce a configurable delivery layer if the remaining benefit warrants it.
3. Remove or correct the development-only one-year blanket cache setting to avoid stale development results. This is separate from production caching.
4. Check that changed assets receive new URLs, repeat visits use the cache as expected, and new deployments show current images. Verify deep links through the existing GitHub Pages redirect flow.
5. If remote images remain, compare their connection cost and cache behavior; use a preconnect only for a frequently used critical origin. Verify each chosen response's dimensions, format, and content type.

Deliverable: header/request evidence from production plus a repeat-visit comparison. Deployment migration is not a prerequisite for the image work.

**Phase 6 — Quality gates and regression prevention**

The following are proposed project budgets, to be calibrated against phase 1 and visual review. They are not claims about current performance or guaranteed savings.

| Measure | Proposed target |
| --- | --- |
| Real-user LCP | At most 2.5 seconds at the 75th percentile, separately for mobile and desktop when sufficient field data exists. This is the [recommended LCP threshold](https://web.dev/articles/optimize-lcp). |
| Lab LCP | Work toward a median of at most 2.5 seconds under the recorded profile; at minimum show improvement on affected routes and explicitly track any remaining host/JavaScript limitation. |
| Layout stability | Total CLS at most 0.1, with no new shifts attributable to images. [CLS guidance](https://web.dev/articles/cls) defines the overall threshold. |
| Mobile photo candidate | Aim for at most 200 KiB for the selected ordinary content-photo variant; desktop variants at most 300 KiB. Document justified exceptions for visual quality. |
| Initial mobile image transfer | Aim for at most 500 KiB per primary content route using the defined observation window. Use separate documented budgets for detailed charts. |
| Reduction from baseline | Aim for at least 60% fewer image bytes on routes currently using oversized photographs, comparing the same complete-scroll scenario. Record actual results; do not apply the 93% experiment to every page. |
| Correctness | No broken images, invalid variant URLs, redundant alternate-format downloads, or unintended changes in crop/content. |
| Responsive behavior | `currentSrc` matches a sensible candidate for rendered slot and DPR; no unnecessary original-sized mobile downloads. |

Verification work:

1. Repeat the baseline runs with identical settings and attach side-by-side results and waterfall captures. Include cold loads, warm visits, internal navigation, direct deep links, and fast scrolling on a constrained connection.
2. Visually inspect mobile, tablet, and desktop; high-DPR screens; Chrome, Firefox, and Safari where available. Include chart labels, logos, focal points, errors, and reduced-motion behavior.
3. Add focused automated checks for manifest URL validity, asset budgets, source preservation, repeat generation, and a browser smoke test of each affected template. Test a failed selected source and a source change explicitly because the shared component handles both.
4. Add portable scripts for image generation, verification, and route performance reports; pin any new audit/test dependencies. There is currently no configured `npm test` or checked-in CI workflow. Introduce CI image checks with the pipeline, then enforce calibrated byte budgets. Use timing reports to flag regressions while allowing for lab noise.
5. Run lint, the production build, and `git diff --check`. Run application and Vite-config TypeScript checks directly; the existing root `tsc` invocation does not traverse its project references. Record pre-existing failures separately, as documented in README.

Suggested existing validation commands during implementation:

```sh
npm run lint
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.node.json
npm run build
git diff --check
```

Deliverable: a before/after report, visual review, known exceptions, and repeatable checks. Image tests should protect loading behavior and budgets rather than merely mirror component markup.

**Phase 7 — Release, monitor, and maintain**

1. Keep changes reviewable as three implementation groups: pipeline/assets, shared renderer/page migration, and measurement/CI/documentation. Preview the complete production build before release.
2. Record the previous known-good deployment and retain source assets. Deploy through the existing publishing process, then immediately check the primary routes, direct links, image content types, caching, and metadata assets.
3. Roll back to that deployment if critical images break, charts become unreadable, or repeatable measurements show a material regression. Retain asset availability required by cached older pages during the transition where the host supports it.
4. Review production synthetic results after release and again after one week. Review CrUX/PageSpeed field data over the following 28 days if traffic is sufficient; mark missing field coverage as unknown. If necessary, scope first-party measurement separately rather than treating lab scores as real-user results.
5. Document how to add an image: preserve the source, choose its role/crop/alt text, generate variants, inspect the result, and pass verification. Run budgets on each asset change and repeat a representative mobile audit monthly.

Completion means all active image paths are covered, the production improvement is demonstrated with comparable evidence, quality checks pass, and future images go through the same pipeline. Any remaining load-time issue caused by JavaScript or hosting should have a measured, separately scoped follow-up.
