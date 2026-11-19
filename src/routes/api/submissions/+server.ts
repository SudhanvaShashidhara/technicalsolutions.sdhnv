import { recordFormSubmission } from '#lib/server/firebase.ts';
import {
	checkRateLimit,
	getClientIdentifier,
	isSameOriginRequest,
	parseJsonBody,
	sanitizeText
} from '#lib/server/security.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, url }) => {
	if (!isSameOriginRequest(request, url)) {
		return Response.json(
			{ error: 'Cross-origin form submissions are not allowed.' },
			{ status: 403 }
		);
	}

	const rate = checkRateLimit(`submissions:${getClientIdentifier(request)}`, {
		limit: 60,
		windowMs: 60_000
	});
	if (!rate.allowed) {
		return Response.json(
			{ error: 'Too many submissions. Please wait a moment and try again.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
		);
	}

	const parsed = await parseJsonBody(request, 16_384);
	if (!parsed.ok) {
		return Response.json({ error: parsed.error }, { status: parsed.status });
	}

	const body = parsed.data;
	const route = sanitizeText(body.route, 128);
	if (!route.startsWith('/')) {
		return Response.json(
			{ error: 'A valid route path starting with "/" is required.' },
			{ status: 400 }
		);
	}

	const rawFields = body.fields;
	if (!rawFields || typeof rawFields !== 'object' || Array.isArray(rawFields)) {
		return Response.json({ error: 'Missing or invalid fields object.' }, { status: 400 });
	}

	const source =
		body.source === 'iframe' || body.source === 'contact' || body.source === 'form'
			? body.source
			: 'form';

	const score = typeof body.score === 'number' && Number.isFinite(body.score) ? body.score : null;
	const formId = typeof body.formId === 'string' ? sanitizeText(body.formId, 80) : null;
	const tagPayload =
		body.tagPayload && typeof body.tagPayload === 'object' && !Array.isArray(body.tagPayload)
			? (body.tagPayload as Record<string, unknown>)
			: null;

	const result = await recordFormSubmission({
		route,
		formId,
		source,
		fields: rawFields as Record<string, unknown>,
		score,
		tagPayload,
		userAgent: request.headers.get('user-agent')
	});

	return Response.json({
		success: true,
		saved: result.saved,
		storage: result.storage,
		id: result.id,
		normalized: result.normalized,
		hashes: result.hashes
	});
};
