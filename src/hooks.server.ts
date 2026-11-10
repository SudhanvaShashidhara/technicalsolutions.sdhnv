import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const corsHeaders: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
	'Access-Control-Allow-Headers': '*'
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders
		});
	}

	if (event.url.pathname.includes('ogt/landing-page') && event.url.searchParams.has('gclid')) {
		const currentGclid = event.url.searchParams.get('gclid') ?? '';
		const lowerGclid = currentGclid.toLowerCase();
		if (currentGclid !== lowerGclid) {
			const searchParams = new URLSearchParams(event.url.search);
			searchParams.set('gclid', lowerGclid);
			redirect(302, `${event.url.pathname}?${searchParams.toString()}`);
		}
	}

	const response = await resolve(event);
	for (const [header, value] of Object.entries(corsHeaders)) {
		response.headers.set(header, value);
	}

	return response;
};
