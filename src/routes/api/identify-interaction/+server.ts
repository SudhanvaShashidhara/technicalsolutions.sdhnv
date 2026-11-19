import {
	checkRateLimit,
	getClientIdentifier,
	parseJsonBody,
	sanitizeText
} from '#lib/server/security.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const rate = checkRateLimit(`identify:${getClientIdentifier(request)}`, {
		limit: 60,
		windowMs: 60_000
	});
	if (!rate.allowed) {
		return Response.json(
			{ error: 'Too many requests. Please try again shortly.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
		);
	}

	const parsed = await parseJsonBody(request, 65_536);
	if (!parsed.ok) {
		return Response.json({ error: parsed.error }, { status: parsed.status });
	}
	const data = parsed.data;

	try {
		const eventLog = data.eventLog;
		const domStructure = data.domStructure;
		const applicationType = data.applicationType ?? data.appLicationType;

		if (!Array.isArray(eventLog)) {
			return Response.json(
				{ error: 'Missing or invalid required field: eventLog.' },
				{ status: 400 }
			);
		}

		return Response.json({
			success: true,
			receivedEvents: eventLog.length,
			hasDomStructure: typeof domStructure === 'string' && domStructure.length > 0,
			applicationType:
				typeof applicationType === 'string' ? sanitizeText(applicationType, 64) || null : null
		});
	} catch (err) {
		console.error('Error in /api/identify-interaction:', err);
		return Response.json(
			{ error: 'An error occurred while processing the request.' },
			{ status: 500 }
		);
	}
};
