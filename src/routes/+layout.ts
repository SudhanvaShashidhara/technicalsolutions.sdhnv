// Prerender all static demo pages at build time so Vercel serves them directly
// from its global CDN edge with zero serverless cold-start latency.
// Dynamic routes (/ogt/landing-page and /api/*) opt out individually.
export const prerender = true;
