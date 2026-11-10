import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export const POST: RequestHandler = async ({ request, fetch }) => {
	if (!env.TYPEFORM_TOKEN) {
		return json({ error: 'Typeform integration is not configured.' }, { status: 503 });
	}

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return json({ error: 'Invalid JSON request body.' }, { status: 400 });
	}

	const formId = typeof body.formId === 'string' ? body.formId.trim() : '';
	const responseId = typeof body.response_id === 'string' ? body.response_id.trim() : '';

	if (!SAFE_ID_PATTERN.test(formId) || !SAFE_ID_PATTERN.test(responseId)) {
		return json(
			{
				error: 'Invalid formId or response_id. Only alphanumeric, underscore, and hyphen allowed.'
			},
			{ status: 400 }
		);
	}

	try {
		const upstreamUrl = `https://api.typeform.com/forms/${encodeURIComponent(formId)}/responses?included_response_ids=${encodeURIComponent(responseId)}`;
		const upstream = await fetch(upstreamUrl, {
			headers: {
				Authorization: `Bearer ${env.TYPEFORM_TOKEN}`
			}
		});

		if (!upstream.ok) {
			return json(
				{ error: `Upstream Typeform API returned HTTP ${upstream.status}.` },
				{ status: upstream.status >= 500 ? 502 : upstream.status }
			);
		}

		const jsonData: unknown = await upstream.json();
		return json(jsonData);
	} catch (err) {
		console.error('Error in /api/typeform-handler:', err);
		return json({ error: 'Failed to fetch Typeform response.' }, { status: 502 });
	}
};
