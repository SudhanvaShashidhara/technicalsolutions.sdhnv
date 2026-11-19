# CLAUDE.md

This file provides guidance to AI coding assistants working in this repository.

## Project

SvelteKit 3 + Svelte 5 app (TypeScript 6, strict mode, Vite 8) deployed to Vercel via `@sveltejs/adapter-vercel` v7. Hosts interactive reference implementations for Google Ads measurement — lead scoring, enhanced conversions, Search Ads 360 Floodlight tagging, cross-origin iframe embeds, and SHA-256 normalization/hashing tools. Styled with Tailwind CSS v4 (`@tailwindcss/vite`) in an **Editorial High-Contrast Minimal** aesthetic (WCAG 2.2 AA/AAA contrast, light & dark mode), with security headers (`vercel.json` + `src/hooks.server.ts`) and server-side Firebase Firestore form submission persistence.

## Commands

- `npm run check` — `svelte-kit sync` + `svelte-check` (TypeScript validation). **Run this before considering any change done.**
- `npm run lint` — `prettier --check .` then `eslint .` (ESLint 10 flat config in `eslint.config.js`)
- `npm run format` — `prettier --write .`
- `npm run test:unit` — Vitest 5 unit, security, and API handler tests (`vitest run`)
- `npm run test:integration` — Playwright end-to-end + `@axe-core/playwright` WCAG 2.1/2.2 AA audits (`tests/`)
- `npm run test` — Runs Playwright integration tests followed by Vitest unit tests
- `npm run dev` / `npm run build` / `npm run preview` — standard Vite/SvelteKit commands

## Setup

- Requires Node `>=24` (`.npmrc` sets `engine-strict=true`; `@sveltejs/adapter-vercel` auto-selects the build Node runtime on Vercel).
- Copy `.env.example` to `.env`:
  - `FIREBASE_SERVICE_ACCOUNT_JSON` (or `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) enables Firestore recording of all form submissions (`FIREBASE_COLLECTION`, default `form_submissions`). Without credentials, endpoints degrade gracefully without breaking forms.
  - `TYPEFORM_TOKEN` (optional) enables `/api/typeform-handler`.

## Git workflow

Never commit directly to `main`. Create a feature branch and open a PR.

## Code style

Prettier enforces: **tabs**, single quotes, no trailing commas, print width 100, `prettier-plugin-svelte`. Match these in new code.

## Architecture & Gotchas

- **SvelteKit 3 conventions**:
  - SvelteKit and `@sveltejs/adapter-vercel` are configured directly inside `vite.config.ts` (no `svelte.config.js`).
  - Use Node subpath imports (`#lib/*` with explicit `.ts` / `.svelte` extensions) instead of legacy `$lib/*`, `$app/state` (`page`) instead of `$app/stores`, `$app/env` instead of `$app/environment`, and `src/env.ts` + `$app/env/private` instead of `$env/*`.
  - Static demo routes are prerendered to Vercel's CDN edge via `export const prerender = true` in `src/routes/+layout.ts`, while `/ogt/landing-page` (`src/routes/ogt/landing-page/+page.server.ts`) and `/api/*` remain dynamic on the server.
  - Fonts (`@fontsource-variable/inter` and `@fontsource-variable/roboto-mono`) are self-hosted via `src/routes/+layout.svelte`.
- **Accessibility & UI**:
  - Editorial high-contrast tokens and primitives live in `src/app.css` (`ed-card`, `ed-input`, `ed-btn-primary`, `skip-link`). Maintain WCAG 2.2 AA compliance (verified by `@axe-core/playwright` in `tests/test.ts` across light and dark modes).
  - Demo pages use `src/lib/components/DemoPageShell.svelte` (compact header, sibling tabs, keyboard-accessible tabbed inspector) and `src/lib/components/ServiceLeadForm.svelte` (auto-records every submission via `POST /api/submissions`).
  - Preserve form/element IDs and selectors expected by GTM (`GTM-5JFB33F`), including `#automatic_form`, `#css_selector_form`, `#javascript_form`, `#lead_scoring_form_multiple_checkbox`, `#form_success`, `.ec_email`, `.ec_tel`, and `data-lead-value`.
- **Web Security & Firebase Firestore**:
  - `vercel.json` (for edge-prerendered static pages) and `src/hooks.server.ts` (for dynamic SSR/API routes) enforce CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and COOP/CORP. Keep CORS scoped strictly to `/api/*` with `Cache-Control: no-store`.
  - `src/lib/server/security.ts` provides payload byte limits (`413`), prototype-pollution stripping, input sanitization, same-origin checks (`403`), and sliding-window rate limiting (`429`).
  - `src/lib/server/firebase.ts` persists sanitized form submissions + normalized SHA-256 hashes (hex, Base64, Base64URL) server-side via Firebase Admin SDK. `firestore.rules` locks down all direct client reads/writes.
- **Tagging & hashing utilities**:
  - Dispatch `gtag` and `dataLayer` events via `callGtag()` and `pushDataLayer()` in `src/lib/gtag.ts`.
  - Normalize emails/phones and compute SHA-256 digests (`sha256Hex`, `sha256Base64`, `sha256Base64Url`) via `src/lib/ec-hash.ts`.
  - Window globals (`gtag`, `dataLayer`, `enhanced_conversion_data`, `floodlight_data`) are typed in `src/app.d.ts`.
- **Browser-only scripts**:
  - Perform third-party `<script>` injection and cleanup inside `onMount(() => { ...; return () => cleanup(); })` and always validate `event.origin` on `postMessage` listeners.
