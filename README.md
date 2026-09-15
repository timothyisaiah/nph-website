# NPH Solutions Website

The website for NPH Solutions Ltd, a Uganda-based public health research company working to turn health data into evidence for community and policy action.

[Website](https://nph-solutions.com) · [Repository](https://github.com/timothyisaiah/nph-website)

[Quick start](#quick-start) · [Architecture](#architecture-and-dependencies) · [Commands](#commands) · [Validation](#validation) · [Contributing](#contributing) · [Deployment](#deployment)

This is a React and TypeScript single-page application. It combines company information, research publications, data briefs, an interactive country globe, and a DHS data explorer. Vite produces static files for GitHub Pages; there is no application server, database, or authentication service in this repository.

## Quick start

The local toolchain verified during the September 2026 updates was **Node.js 24.18.1 and npm 11.6.1**. The repository does not currently pin a Node version or declare an `engines` range. Use that toolchain to reproduce the documented development environment.

```sh
git clone https://github.com/timothyisaiah/nph-website.git
cd nph-website
npm ci
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Vite chooses another port if that one is occupied. Use npm and the committed `package-lock.json` for reproducible dependency installation.

No environment file is required to start the site. Internet access is needed for dependency installation and live DHS/World Bank requests. The globe uses bundled geographic data; its rendering does not depend on those APIs. A browser with WebGL support is required for the interactive globe.

To check the production output locally:

```sh
npm run build
npm run preview
```

The preview serves the existing `dist/` directory, usually at `http://localhost:4173`. Rebuild after making changes. See [Validation](#validation) for the distinction between a successful build and full TypeScript checking.

## Features and routes

| Route | Purpose |
| --- | --- |
| `/` | Interactive world globe, 18 health indicators, country details and trends, demographic cards, growth/BMI tools, and feeding tips. |
| `/about` | Company background, vision, and mission. |
| `/services` | Public health research, monitoring and evaluation, data systems and analytics, and health promotion services. |
| `/thematic-areas` | Research themes spanning health equity, environment, globalization, health systems, political economy, and epidemiology. |
| `/data` | Data briefs library and entry point to data visualization. |
| `/data-brief/:briefId` | Individual brief with chart, narrative, attribution, and Word download. |
| `/data-explorer` | DHS country/indicator comparisons with table, bar, and line views. |
| `/publications` | Research publications. |
| `/contact` | Contact information and an EmailJS-backed enquiry form. |

Routes are defined in [src/routes.tsx](src/routes.tsx). The brief catalogue currently contains 26 entries in [src/data/dataBriefs.ts](src/data/dataBriefs.ts); that file is the source of truth for the count and content.

### Current globe implementation

[AtlasGlobe.tsx](src/components/globe/AtlasGlobe.tsx) renders one Three.js sphere with an orthographic camera. D3 draws a map texture from the bundled topology and projects SVG country outlines over the sphere. The previous `globe.gl` renderer has been replaced.

- The textured surface and country overlays share camera orientation, viewport, and zoom. Geometry updates happen in the same render frame.
- Mouse clicks and touch taps select mapped countries. Pointer release is hit-tested because `OrbitControls` captures the pointer on the SVG. Drags, right-clicks, and pinch gestures do not select countries.
- Wheel and pinch zoom are bounded between `0.88` and `1.55`. Pause/resume, country focus, and reset are available.
- Desktop uses a globe canvas up to 672px wide, aligned toward the indicator arc, with controls centered underneath. Smaller screens use the responsive globe and indicator lists.
- The renderer respects reduced-motion preferences and suspends animation when hidden or offscreen. It disposes its controls and GPU resources on unmount.
- Country search remains available if WebGL initialization fails. Globe colors show selection and hover; indicator-value color themes are not implemented.

[Home.tsx](src/pages/Home.tsx) owns country selection for the globe, search, and details drawer. The initial view has no selected country; choosing an indicator without a country selects Uganda. Country identities come from [countryOptions.ts](src/data/countryOptions.ts), which joins static DHS metadata with ISO3 mappings and overrides.

The [globe replacement plan](docs/globe-replacement-plan.md) records design history and proposed follow-up work. Some sections describe the earlier renderer or unimplemented plans; consult the current source for implemented behavior.

## Architecture and dependencies

| Area | Implementation |
| --- | --- |
| Application | React 18, TypeScript, React Router 6 |
| Build | Vite 5, npm lockfile, static `dist/` output |
| Styling and motion | Tailwind CSS 3, page CSS, Framer Motion |
| Globe | Three.js, `OrbitControls`, `d3-geo`, `topojson-client` |
| Charts and selection | Recharts, `react-select` |
| Data access | Axios requests from the browser to DHS and World Bank |
| Contact form | `@emailjs/browser` |
| Metadata | `react-helmet-async`, `SEOHead`, generated sitemap |
| Publishing | `gh-pages`, custom domain, SPA redirect files |

Exact resolved dependency versions are recorded in [package-lock.json](package-lock.json). The globe, homepage trend chart, and carousel use lazy imports. The explorer also imports chart components; avoid assuming that every heavy dependency is deferred until a particular interaction.

```text
nph-website/
  public/                       Static files copied into dist/
    databriefs/                 Downloadable Word files and public charts
    CNAME                      GitHub Pages custom domain
    404.html                   Deep-link redirect for GitHub Pages
    robots.txt
    sitemap.xml                Generated during prebuild
  scripts/                     Sitemap, image, and country-data utilities
  src/
    assets/                    Imported images and optimized assets
    components/
      common/                  Shared layout, images, loading/error UI
      data/                    DataCanvas explorer and TrendChart
      globe/                   AtlasGlobe and country selectors
      layout/                  MainLayout, Navbar, Footer
      seo/                     SEOHead metadata component
    config/emailjs.ts          Browser contact-form configuration
    context/                   Shared indicator context
    data/                      Briefs, indicators, country identities, topology
    pages/                     Route-level views
    utils/whoLMS.ts            Growth calculation utilities
    routes.tsx                 Route definitions
    main.tsx                   React entry point
  docs/globe-replacement-plan.md
  .tmp/                        Local globe check script and review captures
  index.html                   HTML entry and SPA URL restoration
  package.json
  package-lock.json
  vite.config.ts
```

## Configuration and data behavior

### External services

| Service | Where it is used | Setup and behavior |
| --- | --- | --- |
| DHS | Homepage indicator drawer and `DataCanvas` explorer | Browser requests to `api.dhsprogram.com/rest/dhs/`. No API key is configured. Country, survey, year, and indicator coverage depend on the upstream response. |
| World Bank | Homepage demographic cards | Browser requests to `api.worldbank.org/v2/`. Missing or failed responses can be replaced by hardcoded fallback values. |
| EmailJS | Contact form | Requires the service ID, template ID, and public key configured in `src/config/emailjs.ts`. Submitting the form sends an actual email request. |

The homepage guards against stale demographic responses and cancels superseded DHS indicator requests. The explorer has its own data-fetching logic; it does not share the homepage's static country catalogue or request lifecycle.

DHS country identifiers are **not interchangeable with ISO2, ISO3, or World Bank codes**. When extending country coverage, check both the globe mapping and the separate World Bank/currency lookups in `Home.tsx`. Some entries have no matching selectable polygon, and some World Bank mappings still fall back to passing through the DHS code.

Fallback demographic values are part of the current implementation, including generic defaults. Preserve their source labels and years when changing the UI; they must not be presented as fresh API results. A responsive globe or a successful build does not establish the accuracy or availability of upstream data.

### Contact form

Configuration is currently stored in source, with no `import.meta.env` integration or `.env.example`. For a fork or development email test:

1. Configure your own EmailJS service, template, and browser public key in [src/config/emailjs.ts](src/config/emailjs.ts).
2. Match the template fields: `from_name`, `from_email`, `subject`, `message`, and optional `to_email`.
3. Review the recipient configured in [Contact.tsx](src/pages/Contact.tsx) and the EmailJS template before submitting a test message.

Keep service-account secrets and private API keys out of client code, committed files, and public issue reports. Use your own test destination when working on a fork.

## Commands

| Command | Behavior |
| --- | --- |
| `npm ci` | Install the dependency versions recorded in the lockfile. |
| `npm run dev` | Start Vite with hot module replacement. |
| `npm run lint` | Run the configured ESLint checks with zero warnings allowed. |
| `npm run build` | Regenerate the sitemap, run the root `tsc` command, and build `dist/` with Vite. |
| `npm run preview` | Serve the existing production build locally. |
| `npm run generate-sitemap` | Regenerate `public/sitemap.xml` from the static route list and brief catalogue. |
| `npm run optimize-images` | Generate optimized image assets using Sharp; review the resulting files. |
| `npm run build:analyze` | Build, then invoke `vite-bundle-analyzer` through `npx`. |
| `npm run lighthouse` | Invoke Lighthouse against `http://localhost:5173`; start the dev server on that port first. |
| `npm run deploy` | Build and publish `dist/` to the `gh-pages` branch. Requires repository push access. |

The analyzer and Lighthouse are not pinned dependencies; their scripts use `npx`, which may download tooling. The `prebuild` and `predeploy` hooks run automatically. Building updates sitemap dates, so inspect that generated diff before committing.

## Validation

For a normal change, run:

```sh
npm run lint
npm run build
git diff --check
```

### TypeScript checking

The root [tsconfig.json](tsconfig.json) contains project references and an empty `files` list. The current build invokes plain `tsc`, which does not build/check those referenced projects. Vite can therefore produce a successful bundle while application type errors remain.

Run the installed compiler directly to check each project:

```sh
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.app.json
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.node.json
```

During the September 2026 README audit, the application check reported existing errors involving geographic-data declarations, SVG control types, lazy `react-select` types, a router option, and growth-table indexing. The Vite configuration check passed. Report existing failures separately from errors introduced by a contribution. Enforcing these checks in the npm build and CI remains follow-up work.

### Browser checks

There is no configured `npm test` command or checked-in GitHub Actions workflow. [.tmp/check-globe.mjs](.tmp/check-globe.mjs) contains local browser checks for globe alignment, zoom, selection, and gestures, but currently uses a machine-specific Playwright import and a fixed local port. It is a development aid, not a portable test suite.

For UI changes, include browser/version, viewport, input method, and relevant screenshots in the pull request. Check the affected behavior:

- **Globe:** mouse click and touch tap; click after drag; no selection from right-click or pinch; coastline alignment during rotation, focus, resize, and zoom; pause/resume and reset.
- **Responsive layout:** narrow mobile, tablet, and desktop widths; country search, indicator arc/list, and drawer access.
- **Data:** rapid country changes, latest/trend views, loading and no-data states, and visible fallback attribution.
- **Routing/content:** direct navigation and refresh, brief chart/Word downloads, and correct titles/canonical URLs.
- **Accessibility:** keyboard navigation, visible focus, readable labels, and reduced-motion behavior.
- **Contact:** validation and submission states using a development email destination.

## Adding or updating content

### Data briefs

1. Add the chart to `public/databriefs/`, or import an asset through [src/assets/images.ts](src/assets/images.ts).
2. Put the downloadable Word file in `public/databriefs/`.
3. Add an entry matching `DataBrief` in [src/data/dataBriefs.ts](src/data/dataBriefs.ts):

   ```ts
   {
     id: 'example-brief-2026',
     title: 'Example data brief',
     date: 'Sep 15, 2026',
     author: 'Author Name',
     category: 'Public Health',
     excerpt: 'A short summary for the listing and page metadata.',
     fullContent: `First paragraph.\n\nSecond paragraph.`,
     chartImage: '/databriefs/example-chart.png',
     docxFile: 'Example data brief.docx'
   }
   ```

4. Build and verify the listing, `/data-brief/example-brief-2026`, chart, download, and sitemap entry.

Use a unique, stable ID. `docxFile` is a filename relative to `public/databriefs/`, while `chartImage` is a URL or imported asset URL. Preserve authorship, source references, and dates. The sitemap generator currently parses the TypeScript source using a regular expression; retain the existing single-quoted `id`/`date` format and verify its reported brief count.

### Indicators, pages, and images

- Define homepage indicators in [src/data/indicators.ts](src/data/indicators.ts), including the DHS ID, definition, and measurement type. The homepage arc offsets currently match the 18-entry list; review its layout when changing that list.
- Add pages under `src/pages/` and routes in `src/routes.tsx`. Update the sitemap generator's static route list when adding a public route.
- Use [SEOHead](src/components/seo/SEOHead.tsx) for titles, canonical URLs, social metadata, and structured data. Route metadata is generated in the browser; there is no prerendering or server-side rendering pipeline.
- Use optimized assets and the shared image components where appropriate. Check public URLs against the built output, especially social-preview images; some existing metadata still refers to `/src/assets/` paths.

## Contributing

For a bug report, include the route, reproduction steps, expected and actual behavior, browser/device, and relevant console or network errors. For globe issues, also name the country, input method, and zoom state. Remove personal data and credentials from screenshots or logs.

For code or content changes:

1. Open an issue describing substantial changes, then work on a focused branch or fork.
2. Follow the surrounding TypeScript, component, and styling conventions. Keep country identity handling explicit and preserve data-source attribution.
3. Add dependencies only when needed and include the corresponding lockfile change.
4. Run the validation commands and browser checks relevant to the change.
5. Submit a pull request with the problem, resulting behavior, validation results, screenshots for UI changes, and any known limitations. Update documentation when setup, commands, architecture, or user behavior changes.

Keep generated build output and local machine paths out of new implementation code. Public issues and pull requests should not contain private vulnerability details or credentials; contact the project maintainers privately for those reports. A dedicated security policy and portable CI/test setup have not yet been added.

## Deployment

The configured destination is GitHub Pages at `nph-solutions.com`. After reviewing the production preview, maintainers with publishing access can run:

```sh
npm run deploy
```

`predeploy` runs the build (including sitemap generation), then `gh-pages -d dist` publishes the output to the `gh-pages` branch. GitHub Pages repository settings and DNS must separately be configured for that branch and custom domain; this command does not configure either.

Deployment details to preserve:

- [public/CNAME](public/CNAME) declares the custom domain; Vite's `base` and the router's `basename` are currently `/`.
- [public/404.html](public/404.html) redirects a deep link through the site root, and [index.html](index.html) restores the requested URL before React Router starts. A local Vite preview does not exercise GitHub Pages' exact 404 behavior.
- Verify a brief's direct URL and refresh behavior after publishing, along with the sitemap, static assets, and Word downloads.
- For a fork or subdirectory deployment, review the Vite base, router basename, redirect logic, root-relative asset links, CNAME, and hardcoded site origin in SEO/sitemap files before publishing.
- `vite.config.ts` currently sets a one-year cache header for the development server only. If local content appears stale, disable the browser cache or hard-refresh. Production cache policy is controlled by the hosting service.

## License and attribution

Copyright NPH Solutions Ltd. The existing repository notice identifies the code as proprietary to NPH Solutions unless explicitly stated otherwise. Data brief content belongs to its respective authors. No standalone open-source license file is currently included; this README does not change the licensing terms.

Retain authorship and source attribution for research content, geographic data, images, and third-party dependencies. The public-health API integrations are identified above; review the applicable provider terms when redistributing data or adding new sources.
