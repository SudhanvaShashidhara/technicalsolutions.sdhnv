# CLAUDE.md

This file provides guidance to AI coding assistants working in this repository.

## Project

SvelteKit 2 + Svelte 5 app (TypeScript, strict mode) deployed to Vercel via `@sveltejs/adapter-vercel` (runtime `nodejs22.x`). Hosts interactive reference implementations for Google Ads measurement — lead scoring, enhanced conversions, Search Ads 360 Floodlight tagging, cross-origin iframe embeds, and SHA-256 normalization/hashing tools. Styled with Tailwind CSS in a Google Material / Google Developers design language with persisted dark mode.

## Commands

- `npm run check` — `svelte-kit sync` + `svelte-check` (TypeScript validation). **Run this before considering any change done.**
- `npm run lint` — `prettier --check .` then `eslint .`
- `npm run format` — `prettier --write .`
- `npm run test:unit` — Vitest unit and API handler tests (`vitest run`)
- `npm run test:integration` — Playwright end-to-end tests (`tests/`)
- `npm run test` — Runs Playwright integration tests followed by Vitest unit tests
- `npm run dev` / `npm run build` / `npm run preview` — standard Vite/SvelteKit commands

## Setup

- Requires Node `>=22` (`.npmrc` sets `engine-strict=true`; Vercel runtime is `nodejs22.x`).
- Copy `.env.example` to `.env` if testing `/api/typeform-handler` (`TYPEFORM_TOKEN`). All other pages and endpoints run without environment variables.

## Git workflow

Never commit directly to `main`. Create a feature branch and open a PR.

## Code style

Prettier enforces: **tabs**, single quotes, no trailing commas, print width 100, `prettier-plugin-svelte`. Match these in new code.

## Architecture & Gotchas

- **Shared UI & navigation**:
  - Navigation links and service scoring options live in `src/lib/nav.ts` (consumed by `Navbar.svelte`, `Footer.svelte`, `+page.svelte`, and demo page tabs).
  - Demo pages use `src/lib/components/DemoPageShell.svelte` (header, tabs, live payload inspector, reference snippet) and `src/lib/components/ServiceLeadForm.svelte`.
  - Preserve form/element IDs and selectors expected by GTM (`GTM-5JFB33F`), including `#automatic_form`, `#css_selector_form`, `#javascript_form`, `#lead_scoring_form_multiple_checkbox`, `#form_success`, `.ec_email`, `.ec_tel`, and `data-lead-value`.
- **Tagging & hashing utilities**:
  - Dispatch `gtag` and `dataLayer` events via `callGtag()` and `pushDataLayer()` in `src/lib/gtag.ts` so blocked or delayed tag scripts never throw `TypeError`.
  - Normalize emails/phones and compute SHA-256 digests via `src/lib/ec-hash.ts` (uses Web Crypto API; strips `.` from local part **only** on `gmail.com` / `googlemail.com`).
  - Window globals (`gtag`, `dataLayer`, `enhanced_conversion_data`, `floodlight_data`) are typed in `src/app.d.ts` — extend that file rather than casting to `any`.
- **Server hooks (`src/hooks.server.ts`)**:
  - Sets open CORS headers (including `204` `OPTIONS` preflight responses) and lowercases the `gclid` query param via `302` redirect on `/ogt/landing-page` — keep both behaviors intact.
- **Browser-only scripts**:
  - When injecting third-party `<script>` tags (e.g. Typeform, Calendly), perform both injection and teardown inside `onMount(() => { ...; return () => cleanup(); })` — never access `document` inside `onDestroy`, which runs during SSR.
