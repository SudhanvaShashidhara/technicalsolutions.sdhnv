import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RECAPTCHA_API_KEY, GCP_PROJECT_ID } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token, siteKey, action } = await request.json();

		if (!token || !siteKey) {
			return json({ success: false, error: 'Token and Site Key are required' }, { status: 400 });
		}

		if (!RECAPTCHA_API_KEY) {
			return json(
				{ success: false, error: 'Server reCAPTCHA API Key is not configured' },
				{ status: 500 }
			);
		}

		const projectId = GCP_PROJECT_ID || 'tai-sdhnv';
		const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${RECAPTCHA_API_KEY}`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				event: {
					token,
					siteKey,
					expectedAction: action || 'submit'
				}
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`reCAPTCHA Enterprise assessment API error: ${response.status}`, errorText);
			return json(
				{ success: false, error: `Failed to verify token with Google: ${response.statusText}` },
				{ status: 502 }
			);
		}

		const data = await response.json();
		return json({
			success: true,
			score: data.riskAnalysis?.score,
			valid: data.tokenProperties?.valid,
			invalidReason: data.tokenProperties?.invalidReason,
			reasons: data.riskAnalysis?.reasons
		});
	} catch (err) {
		console.error('Verify reCAPTCHA exception:', err);
		return json(
			{ success: false, error: err instanceof Error ? err.message : 'Internal server error' },
			{ status: 500 }
		);
	}
};
