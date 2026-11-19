import { building } from '$app/env';
import { API_CORS_HEADERS, SECURITY_HEADERS } from '#lib/server/security.ts';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit/hooks';

export const corsHeaders = API_CORS_HEADERS;

export const handle: Handle = async ({ event, resolve }) => {
	const isApiRoute = event.url.pathname.startsWith('/api/');

	if (isApiRoute && event.request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: {
				...SECURITY_HEADERS,
				...API_CORS_HEADERS,
				'Cache-Control': 'no-store'
			}
		});
	}

	if (
		!building &&
		event.url.pathname.includes('ogt/landing-page') &&
		event.url.searchParams.has('gclid')
	) {
		const currentGclid = event.url.searchParams.get('gclid') ?? '';
		const lowerGclid = currentGclid.toLowerCase();
		if (currentGclid !== lowerGclid) {
			const searchParams = new URLSearchParams(event.url.search);
			searchParams.set('gclid', lowerGclid);
			redirect(302, `${event.url.pathname}?${searchParams.toString()}`);
		}
	}

	const response = await resolve(event);

	for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
		response.headers.set(header, value);
	}

	if (isApiRoute) {
		response.headers.set('Cache-Control', 'no-store');
		for (const [header, value] of Object.entries(API_CORS_HEADERS)) {
			response.headers.set(header, value);
		}
	}

	return response;
};
