export const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://embed.typeform.com https://assets.calendly.com",
	"style-src 'self' 'unsafe-inline' https://assets.calendly.com https://embed.typeform.com",
	"font-src 'self' data:",
	"img-src 'self' data: https:",
	"frame-src 'self' https://www.googletagmanager.com https://*.typeform.com https://calendly.com https://*.doubleclick.net",
	"connect-src 'self' https://*.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.googleadservices.com https://*.doubleclick.net https://*.google.com https://*.typeform.com https://calendly.com",
	'upgrade-insecure-requests'
].join('; ');

export const SECURITY_HEADERS: Record<string, string> = {
	'Content-Security-Policy': CONTENT_SECURITY_POLICY,
	'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
	'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
	'Cross-Origin-Resource-Policy': 'same-origin'
};

export const API_CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Accept'
};

const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export type ParsedJsonResult =
	{ ok: true; data: Record<string, unknown> } | { ok: false; status: 400 | 413; error: string };

/**
 * Reads and parses a JSON object body while enforcing a strict byte-length limit
 * and rejecting non-object payloads.
 */
export async function parseJsonBody(
	request: Request,
	maxBytes = 16_384
): Promise<ParsedJsonResult> {
	const contentLength = request.headers.get('content-length');
	if (contentLength && Number(contentLength) > maxBytes) {
		return { ok: false, status: 413, error: 'Request payload is too large.' };
	}

	let text: string;
	try {
		text = await request.text();
	} catch {
		return { ok: false, status: 400, error: 'Unable to read request body.' };
	}

	const byteLength = new TextEncoder().encode(text).byteLength;
	if (byteLength > maxBytes) {
		return { ok: false, status: 413, error: 'Request payload is too large.' };
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return { ok: false, status: 400, error: 'Invalid JSON request body.' };
	}

	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return { ok: false, status: 400, error: 'JSON request body must be an object.' };
	}

	return { ok: true, data: stripForbiddenKeys(parsed as Record<string, unknown>) };
}

function stripForbiddenKeys(obj: Record<string, unknown>): Record<string, unknown> {
	const clean: Record<string, unknown> = Object.create(null) as Record<string, unknown>;
	for (const [key, value] of Object.entries(obj)) {
		if (FORBIDDEN_KEYS.has(key)) continue;
		clean[key] = value;
	}
	return { ...clean };
}

/**
 * Strips non-printable control characters (preserving tabs/newlines) and enforces max length.
 */
export function sanitizeText(value: unknown, maxLength = 500): string {
	if (typeof value !== 'string') return '';
	let cleaned = '';
	for (let i = 0; i < value.length; i++) {
		const code = value.charCodeAt(i);
		const isControl =
			(code >= 0 && code <= 8) ||
			code === 11 ||
			code === 12 ||
			(code >= 14 && code <= 31) ||
			code === 127;
		if (!isControl) {
			cleaned += value[i];
		}
	}
	return cleaned.trim().slice(0, maxLength);
}

/**
 * Recursively sanitizes an untrusted JSON value into a bounded, Firestore-safe structure.
 */
export function sanitizeValue(value: unknown, depth = 0): unknown {
	if (depth > 4) return null;
	if (value === null || value === undefined) return null;
	if (typeof value === 'string') return sanitizeText(value, 1000);
	if (typeof value === 'number') return Number.isFinite(value) ? value : null;
	if (typeof value === 'boolean') return value;

	if (Array.isArray(value)) {
		return value.slice(0, 50).map((item) => sanitizeValue(item, depth + 1));
	}

	if (typeof value === 'object') {
		const out: Record<string, unknown> = {};
		let count = 0;
		for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
			if (FORBIDDEN_KEYS.has(key)) continue;
			const safeKey = sanitizeText(key, 64);
			if (!safeKey) continue;
			out[safeKey] = sanitizeValue(entry, depth + 1);
			count += 1;
			if (count >= 30) break;
		}
		return out;
	}

	return null;
}

/**
 * Verifies browser requests to internal write endpoints come from the same origin.
 */
export function isSameOriginRequest(request: Request, url: URL): boolean {
	const secFetchSite = request.headers.get('sec-fetch-site');
	if (secFetchSite && secFetchSite !== 'same-origin' && secFetchSite !== 'none') {
		return false;
	}

	const origin = request.headers.get('origin');
	if (origin) {
		try {
			return new URL(origin).origin === url.origin;
		} catch {
			return false;
		}
	}

	return true;
}

interface RateBucket {
	count: number;
	resetAt: number;
}

const rateBuckets = new Map<string, RateBucket>();

export function getClientIdentifier(request: Request): string {
	const forwarded = request.headers.get('x-forwarded-for');
	if (forwarded) {
		return forwarded.split(',')[0].trim().slice(0, 64) || 'unknown';
	}
	const realIp = request.headers.get('x-real-ip');
	if (realIp) return realIp.trim().slice(0, 64);
	return 'local';
}

export function checkRateLimit(
	key: string,
	options: { limit: number; windowMs: number } = { limit: 60, windowMs: 60_000 }
): { allowed: boolean; retryAfterSec: number } {
	const now = Date.now();

	// Keep memory bounded during traffic bursts
	if (rateBuckets.size > 2000) {
		for (const [k, bucket] of rateBuckets) {
			if (bucket.resetAt <= now) rateBuckets.delete(k);
		}
	}

	const existing = rateBuckets.get(key);
	if (!existing || existing.resetAt <= now) {
		rateBuckets.set(key, { count: 1, resetAt: now + options.windowMs });
		return { allowed: true, retryAfterSec: 0 };
	}

	if (existing.count >= options.limit) {
		return {
			allowed: false,
			retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
		};
	}

	existing.count += 1;
	return { allowed: true, retryAfterSec: 0 };
}

export function resetRateLimitsForTest(): void {
	rateBuckets.clear();
}
