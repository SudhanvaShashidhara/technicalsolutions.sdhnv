# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SvelteKit 2 + Svelte 4 app (TypeScript, strict mode) deployed to Vercel via `adapter-vercel` (runtime `nodejs22.x`). Marketing / lead-generation pages with heavy Google integrations (reCAPTCHA Enterprise, GTM, GA4 Ads enhanced conversions) and a Firebase Admin / `@vercel/postgres` backend. Styling is Tailwind CSS.

## Commands

- `npm run check` — svelte-kit sync + svelte-check (TypeScript validation). **Run this before considering any change done.**
- `npm run lint` — `prettier --check .` then `eslint .`
- `npm run format` — `prettier --write .`
- `npm run test` — Playwright integration tests (`tests/`) then Vitest unit tests (`src/**/*.{test,spec}.{js,ts}`)
- `npm run dev` / `npm run build` / `npm run preview` — standard Vite/SvelteKit.

## Setup

- A populated `.env` is required to run the app — Gemini, reCAPTCHA (`PUBLIC_RECAPTCHA_V3_SITE_KEY`, `PUBLIC_RECAPTCHA_V2_SITE_KEY`, `RECAPTCHA_API_KEY`), Firebase service-account (`GSA_*`), `TYPEFORM_TOKEN`, `ABSTRACT_API_KEY`. `.env` is gitignored; `.env.example` is committed.
- `.npmrc` sets `engine-strict=true`; use Node 22.x (matches the Vercel adapter runtime).

## Git workflow

Never commit directly to `main`. Create a feature branch and open a PR.

## Code style

Prettier enforces: **tabs**, single quotes, no trailing commas, print width 100, `prettier-plugin-svelte`. Match these in new code.

## Gotchas

- **reCAPTCHA is mixed**: v3 invisible (CSS Selector form) and v2 checkbox (Automatic form), verified server-side via the **Enterprise** API in `src/routes/api/verify-recaptcha/+server.ts`. Don't assume a single version.
- `src/hooks.server.ts` sets fully-open CORS headers (for cross-origin form posts) and lowercases the `gclid` URL param — keep both when editing it.
- Load external scripts via the `loadScript()` helper in `src/lib/recaptcha.ts`; it dedupes `<script>` tags. Don't inject script tags manually.
- `gtag`, `dataLayer`, and `enhanced_conversion_data` on `window` are typed in `src/app.d.ts` — extend that file rather than casting to `any`.

Routes use SvelteKit file-based routing under `src/routes/`; explore there for page/endpoint structure.
