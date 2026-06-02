# Technical Solutions

Marketing / lead-generation demo site hosting **reference implementations for Google Ads
measurement** — lead scoring, enhanced conversions, and SA360 tagging. Each page is a live,
copy-ready example you can verify end to end.

Built with **SvelteKit 2 / Svelte** (TypeScript, strict mode), styled with **Tailwind CSS** in a
Google Material look with a persisted **dark mode**, and deployed to **Vercel**
(`adapter-vercel`, runtime `nodejs22.x`).

Live: https://technicalsolutions.sdhnv.com

## Features

- **Google Material styling + dark mode** — class-based dark mode (`darkMode: 'class'`) with a
  no-flash inline theme script in `src/app.html`, a persisted theme store (`src/lib/theme.ts`),
  and a navbar toggle. Respects the OS preference on first visit.
- **Lead scoring** — pass qualification values into Google Ads via the Google Tag and the GTM
  dataLayer (`/lead-scoring/*`).
- **Enhanced conversions** — automatic, CSS-selector, JavaScript, code, and pre-hashed
  implementations (`/adsenhancedconversions/*`). Each form simply shows a confirmation message on
  submit.
- **SA360** — Search Ads 360 tagging via Google Tag, dataLayer, and Floodlight formats
  (`/sa360/*`).
- Contact form, Typeform / Calendly iframe embeds, and supporting API routes (`/api/*`).

## Tech stack

- SvelteKit 2 / Svelte, TypeScript (strict)
- Tailwind CSS (+ `@tailwindcss/forms`), `darkMode: 'class'`, Inter font
- `@vercel/postgres`, `firebase-admin`, `@google/genai`
- Deployed on Vercel via `@sveltejs/adapter-vercel` (runtime `nodejs22.x`)

## Getting started

Requires **Node 22.x** (matches the Vercel runtime; `.npmrc` sets `engine-strict=true`).

```bash
npm install
npm run dev          # start the dev server (add `-- --open` to open a tab)
```

A populated `.env` is required for the backend routes. Server-side integrations read their secrets
from (among others):

- `GEMINI_API_KEY` — Google Gemini (`@google/genai`)
- `TYPEFORM_TOKEN` — Typeform handler
- `GSA_*` — Firebase Admin service account (`GSA_TYPE`, `GSA_PROJECT_ID`, `GSA_PRIVATE_KEY`,
  `GSA_CLIENT_EMAIL`, …)

`.env` is gitignored.

> **Note:** reCAPTCHA has been removed from this project. The enhanced-conversions forms no longer
> load reCAPTCHA or verify tokens — they just show a confirmation message on submit.

## Scripts

| Command           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `npm run dev`     | Vite dev server                                            |
| `npm run build`   | Production build                                           |
| `npm run preview` | Preview the production build                               |
| `npm run check`   | `svelte-kit sync` + `svelte-check` (TypeScript)            |
| `npm run lint`    | `prettier --check` then `eslint`                           |
| `npm run format`  | `prettier --write`                                         |
| `npm run test`    | Playwright (`tests/`) then Vitest (`src/**/*.{test,spec}`) |

## Project structure

File-based routing under `src/routes/`:

- `lead-scoring/` — Google Tag + GTM lead-scoring pages
- `adsenhancedconversions/` — enhanced-conversion method pages
- `sa360/` — Search Ads 360 tagging pages
- `iframe/` — Typeform / Calendly embeds
- `api/` — server endpoints (contact form, Typeform handler, …)

Shared UI lives in `src/lib/components/` (Navbar, Footer, ThemeToggle).

## Deployment

Pushes to `main` deploy to production on Vercel; pull requests get preview deployments.
