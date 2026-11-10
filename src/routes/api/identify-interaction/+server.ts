import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let data: Record<string, unknown>;
	try {
		data = (await request.json()) as Record<string, unknown>;
	} catch {
		return Response.json({ error: 'Invalid JSON request body.' }, { status: 400 });
	}

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
			applicationType: typeof applicationType === 'string' ? applicationType : null
		});
	} catch (err) {
		console.error('Error in /api/identify-interaction:', err);
		return Response.json(
			{ error: 'An error occurred while processing the request.' },
			{ status: 500 }
		);
	}
};
