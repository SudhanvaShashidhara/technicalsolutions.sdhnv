# Technical Solutions

Interactive measurement sandbox for **Google Ads** — lead qualification scoring, enhanced
conversions, Search Ads 360 Floodlight tagging, cross-origin iframe embeds, and SHA-256 PII
verification.

Built with **SvelteKit 3 + Svelte 5** (TypeScript 6, Vite 8, Tailwind CSS v4) in an **Editorial
High-Contrast Minimal** aesthetic (WCAG 2.2 AA verified in light & dark mode), hardened with edge
security headers, and wired with **Firebase Firestore** server-side submission recording on
**Vercel**.

Live: https://technicalsolutions.sdhnv.com

## Highlights

- **Minimal UI + WCAG 2.2 AA Accessibility** — crisp monochrome + cobalt design system
  (`src/app.css`), self-hosted `Inter Variable` & `Roboto Mono Variable` fonts, skip-to-content
  navigation, keyboard-accessible menus & tabbed payload inspector (`Payload` / `Code` / `Notes`),
  and automated `@axe-core/playwright` light/dark audits.
- **Web Security Hardening** — strict CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, and COOP/CORP on both edge-prerendered static routes
  (`vercel.json`) and dynamic SSR/API routes (`src/hooks.server.ts`); payload byte limits (`413`),
  prototype-pollution stripping, input sanitization, same-origin checks, `postMessage` origin
  validation, and API rate limiting (`429`).
- **Firebase Firestore Submission Recording** — every demo form (`POST /api/submissions`), contact
  verifier submission (`POST /api/contact-form`), and verified Typeform/Calendly iframe event is
  recorded server-side via the Firebase Admin SDK (`src/lib/server/firebase.ts`) with full fields
  plus normalized SHA-256 hex, Base64, and Base64URL digests. Client Firestore access is denied by
  default (`firestore.rules`).

## Getting started

Requires **Node `>=24`** (`.npmrc` sets `engine-strict=true`).

```bash
npm install
cp .env.example .env
npm run dev
```

### Enabling Firebase Firestore on Vercel

1. In Firebase Console, create a Firestore database and deploy `firestore.rules` (default-deny for
   client SDK access).
2. Generate a Service Account private key (**Project Settings → Service Accounts → Generate new
   private key**).
3. In Vercel (**Project Settings → Environment Variables**), add either:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` (the entire JSON file contents on one line), **or**
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
4. Optionally set `FIREBASE_COLLECTION` (defaults to `form_submissions`).

Without these env vars, forms continue to work normally and return `storage: "unconfigured"`.

## Scripts

| Command                    | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `npm run dev`              | Start Vite dev server                                         |
| `npm run build`            | Build production bundle + edge-prerender static routes        |
| `npm run preview`          | Preview production build                                      |
| `npm run check`            | `svelte-kit sync` + `svelte-check` (TypeScript 6)             |
| `npm run lint`             | `prettier --check .` + `eslint .` (ESLint 10)                 |
| `npm run format`           | Format codebase with Prettier                                 |
| `npm run test:unit`        | Run Vitest 5 unit, security, and API tests (`vitest run`)     |
| `npm run test:integration` | Run Playwright E2E + `@axe-core/playwright` WCAG 2.2 AA tests |
| `npm run test`             | Run Playwright integration tests then Vitest unit tests       |

## Deployment

Pushes to `main` deploy to production on Vercel; pull requests receive preview deployments.
