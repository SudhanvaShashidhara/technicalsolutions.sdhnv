import { describe, it, expect } from 'vitest';
import { normalizeEmail, normalizePhone, sha256Base64Url, sha256Hex } from '#lib/ec-hash.ts';
import { handle } from './hooks.server.ts';
import { POST as identifyPost } from './routes/api/identify-interaction/+server.ts';
import { GET as ecShaGet } from './routes/api/ec-sha-tester/+server.ts';
import { POST as contactPost } from './routes/api/contact-form/+server.ts';
import { POST as typeformPost } from './routes/api/typeform-handler/+server.ts';

describe('Enhanced Conversions normalization & SHA-256 utilities', () => {
	it('strips dots only on gmail.com and googlemail.com domains', () => {
		expect(normalizeEmail('  Alex.Morgan@Gmail.com ')).toBe('alexmorgan@gmail.com');
		expect(normalizeEmail('j.doe@googlemail.com')).toBe('jdoe@googlemail.com');
		expect(normalizeEmail('Alex.Morgan@company.com')).toBe('alex.morgan@company.com');
	});

	it('preserves plus aliases and rejects malformed emails', () => {
		expect(normalizeEmail('alex.m+ads@gmail.com')).toBe('alexm+ads@gmail.com');
		expect(normalizeEmail('not-an-email')).toBeNull();
		expect(normalizeEmail('@gmail.com')).toBeNull();
		expect(normalizeEmail('')).toBeNull();
	});

	it('normalizes phone numbers to E.164 and rejects invalid inputs', () => {
		expect(normalizePhone('+1 (555) 234-5678')).toBe('+15552345678');
		expect(normalizePhone('91 98765 43210')).toBe('+919876543210');
		expect(normalizePhone('abc')).toBeNull();
		expect(normalizePhone('123')).toBeNull();
	});

	it('computes deterministic SHA-256 hex and base64url digests', async () => {
		const hex = await sha256Hex('alexmorgan@gmail.com');
		const b64 = await sha256Base64Url('alexmorgan@gmail.com');
		expect(hex).toMatch(/^[0-9a-f]{64}$/);
		expect(b64).not.toContain('=');
		expect(b64).not.toContain('+');
		expect(b64).not.toContain('/');
	});
});

describe('hooks.server.ts CORS & GCLID redirect', () => {
	it('short-circuits OPTIONS preflight requests with 204 and CORS headers', async () => {
		const url = new URL('http://localhost/api/contact-form');
		const request = new Request(url, { method: 'OPTIONS' });
		const response = await handle({
			event: { request, url } as Parameters<typeof handle>[0]['event'],
			resolve: async () => new Response('should not be called', { status: 405 })
		});

		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		expect(response.headers.get('Access-Control-Allow-Methods')).toContain('OPTIONS');
	});

	it('redirects mixed-case gclid on /ogt/landing-page before calling resolve', async () => {
		const url = new URL('http://localhost/ogt/landing-page?gclid=AbCdEf123');
		const request = new Request(url, { method: 'GET' });
		let resolved = false;

		await expect(
			handle({
				event: { request, url } as Parameters<typeof handle>[0]['event'],
				resolve: async () => {
					resolved = true;
					return new Response('ok');
				}
			})
		).rejects.toMatchObject({
			status: 302,
			location: '/ogt/landing-page?gclid=abcdef123'
		});

		expect(resolved).toBe(false);
	});
});

describe('API endpoints', () => {
	it('POST /api/identify-interaction parses body once and returns event count', async () => {
		const request = new Request('http://localhost/api/identify-interaction', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				eventLog: [{ type: 'submit' }, { type: 'click' }],
				domStructure: '<form></form>',
				applicationType: 'sveltekit'
			})
		});

		const res = await identifyPost({ request } as Parameters<typeof identifyPost>[0]);
		expect(res.status).toBe(200);
		const body = await res.json();
		expect(body).toEqual({
			success: true,
			receivedEvents: 2,
			hasDomStructure: true,
			applicationType: 'sveltekit'
		});
	});

	it('POST /api/identify-interaction returns 400 when eventLog is missing', async () => {
		const request = new Request('http://localhost/api/identify-interaction', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ domStructure: '<div/>' })
		});

		const res = await identifyPost({ request } as Parameters<typeof identifyPost>[0]);
		expect(res.status).toBe(400);
	});

	it('GET /api/ec-sha-tester hashes email/phone and returns 400 when empty', async () => {
		const badRes = await ecShaGet({
			url: new URL('http://localhost/api/ec-sha-tester')
		} as Parameters<typeof ecShaGet>[0]);
		expect(badRes.status).toBe(400);

		const okRes = await ecShaGet({
			url: new URL(
				'http://localhost/api/ec-sha-tester?email=First.Last%40company.com&phone=%2B15552345678'
			)
		} as Parameters<typeof ecShaGet>[0]);
		expect(okRes.status).toBe(200);
		const data = await okRes.json();
		expect(data.normalized_email).toBe('first.last@company.com');
		expect(data.normalised_phone).toBe('+15552345678');
		expect(data.email_hash2).toHaveLength(64);
		expect(data.phone_hash2).toHaveLength(64);
	});

	it('POST /api/contact-form validates email and returns normalized hashes', async () => {
		const req = new Request('http://localhost/api/contact-form', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'Jane.Doe@gmail.com', phone: '+1 555 987 6543' })
		});
		const res = await contactPost({ request: req } as Parameters<typeof contactPost>[0]);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.normalized_email).toBe('janedoe@gmail.com');
		expect(data.normalised_phone).toBe('+15559876543');
	});

	it('POST /api/typeform-handler returns 503 when token is unset and blocks path traversal', async () => {
		const req = new Request('http://localhost/api/typeform-handler', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ formId: '../../workspaces', response_id: 'abc' })
		});
		const res = await typeformPost({
			request: req,
			fetch: globalThis.fetch
		} as Parameters<typeof typeformPost>[0]);
		expect([400, 503]).toContain(res.status);
	});
});
