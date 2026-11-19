import { TYPEFORM_TOKEN } from '$app/env/private';
import {
	checkRateLimit,
	getClientIdentifier,
	parseJsonBody,
	sanitizeText
} from '#lib/server/security.ts';
import type { RequestHandler } from './$types';

const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

export const POST: RequestHandler = async ({ request, fetch }) => {
	const rate = checkRateLimit(`typeform:${getClientIdentifier(request)}`, {
		limit: 30,
		windowMs: 60_000
	});
	if (!rate.allowed) {
		return Response.json(
			{ error: 'Too many requests. Please try again shortly.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
		);
	}

	if (!TYPEFORM_TOKEN) {
		return Response.json({ error: 'Typeform integration is not configured.' }, { status: 503 });
	}

	const parsed = await parseJsonBody(request, 8_192);
	if (!parsed.ok) {
		return Response.json({ error: parsed.error }, { status: parsed.status });
	}
	const body = parsed.data;

	const formId = sanitizeText(body.formId, 64);
	const responseId = sanitizeText(body.response_id, 64);

	if (!SAFE_ID_PATTERN.test(formId) || !SAFE_ID_PATTERN.test(responseId)) {
		return Response.json(
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
				Authorization: `Bearer ${TYPEFORM_TOKEN}`
			}
		});

		if (!upstream.ok) {
			return Response.json(
				{ error: `Upstream Typeform API returned HTTP ${upstream.status}.` },
				{ status: upstream.status >= 500 ? 502 : upstream.status }
			);
		}

		const jsonData: unknown = await upstream.json();
		return Response.json(jsonData);
	} catch (err) {
		console.error('Error in /api/typeform-handler:', err);
		return Response.json({ error: 'Failed to fetch Typeform response.' }, { status: 502 });
	}
};
