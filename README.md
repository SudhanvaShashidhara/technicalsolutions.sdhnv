# Technical Solutions

Interactive reference sandbox for **Google Ads measurement** — lead qualification scoring, enhanced
conversions, Search Ads 360 Floodlight tagging, cross-origin iframe embeds, and SHA-256 PII
normalization. Every page pairs a working demo with a **Live Tag Payload** inspector and copy-ready
implementation snippet.

Built with **SvelteKit 2 + Svelte 5** (TypeScript, strict mode), styled with **Tailwind CSS** in a
clean Google Material / Google Developers aesthetic with persisted **dark mode**, and deployed to
**Vercel** (`@sveltejs/adapter-vercel`, runtime `nodejs22.x`).

Live: https://technicalsolutions.sdhnv.com

## Features

- **Google Developers / Material UI + Dark Mode** — unified design primitives (`src/app.css`),
  persisted theme store (`src/lib/theme.ts`) with a no-flash inline script in `src/app.html`,
  sibling implementation tabs, and live JSON payload inspection on every demo page.
- **Lead Scoring (`/lead-scoring/*`)** — pass qualification scores via HTML `data-lead-value`
  attributes, programmatic JavaScript lookup maps, GTM `dataLayer`, combined multi-field scores, and
  multi-select checkboxes.
- **Enhanced Conversions (`/adsenhancedconversions/*`)** — Automatic detection, CSS Selector
  (`.ec_email` / `.ec_tel`), `window.enhanced_conversion_data`, GTM `dataLayer`, and browser-side
  SHA-256 pre-hashing (`src/lib/ec-hash.ts`).
- **Search Ads 360 (`/sa360/*`)** — Floodlight Sales/Counter implementations across Google Tag
  (`gtag.js`), GTM `dataLayer`, canonical Floodlight parameter objects, and `window.floodlight_data`
  JavaScript variables.
- **Tools & Embeds** — Server-verified Contact & SHA-256 Hash Verifier (`/contact`), Typeform &
  Calendly cross-origin iframe `postMessage` demos (`/iframe/*`), and an OGT `gclid` case-mutation
  `302` redirect test (`/ogt/landing-page`).

## Getting started

Requires **Node `>=22`** (matches the Vercel `nodejs22.x` runtime; `.npmrc` sets
`engine-strict=true`).

```bash
npm install
cp .env.example .env   # optional: set TYPEFORM_TOKEN for /api/typeform-handler
npm run dev            # start Vite dev server
```

## Scripts

| Command                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| `npm run dev`              | Start Vite dev server                                   |
| `npm run build`            | Build production bundle                                 |
| `npm run preview`          | Preview production build                                |
| `npm run check`            | `svelte-kit sync` + `svelte-check` (TypeScript)         |
| `npm run lint`             | `prettier --check .` + `eslint .`                       |
| `npm run format`           | Format codebase with Prettier                           |
| `npm run test:unit`        | Run Vitest unit & API endpoint tests (`vitest run`)     |
| `npm run test:integration` | Run Playwright end-to-end tests (`tests/`)              |
| `npm run test`             | Run Playwright integration tests then Vitest unit tests |

## Project structure

- `src/lib/nav.ts` — centralized route metadata and shared scoring options
- `src/lib/ec-hash.ts` — Google Ads Enhanced Conversions email/phone normalization & SHA-256 hashing
- `src/lib/gtag.ts` — safe `callGtag` and `pushDataLayer` wrappers
- `src/lib/components/` — `Navbar`, `Footer`, `ThemeToggle`, `DemoPageShell`, `ServiceLeadForm`
- `src/routes/` — file-based pages and `/api/*` server endpoints

## Deployment

Pushes to `main` deploy to production on Vercel; pull requests receive preview deployments.
