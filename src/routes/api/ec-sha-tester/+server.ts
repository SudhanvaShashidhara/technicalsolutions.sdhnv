import {
	normalizeEmail,
	normalizePhone,
	sha256Base64,
	sha256Base64Url,
	sha256Hex
} from '#lib/ec-hash.ts';
import { checkRateLimit, getClientIdentifier, sanitizeText } from '#lib/server/security.ts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url }) => {
	const rate = checkRateLimit(`ec-sha:${getClientIdentifier(request)}`, {
		limit: 120,
		windowMs: 60_000
	});
	if (!rate.allowed) {
		return Response.json(
			{ error: 'Too many requests. Please try again shortly.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
		);
	}

	const emailParam = sanitizeText(url.searchParams.get('email'), 254);
	const phoneParam = sanitizeText(url.searchParams.get('phone'), 40);

	if (!emailParam && !phoneParam) {
		return Response.json({ error: 'Provide an email or phone query parameter.' }, { status: 400 });
	}

	const payload: Record<string, string> = {};

	if (phoneParam) {
		const normalised_phone = normalizePhone(phoneParam);
		if (!normalised_phone) {
			return Response.json(
				{ error: 'Invalid phone number. Expected digits in E.164 format (e.g. +15551234567).' },
				{ status: 400 }
			);
		}
		payload.normalised_phone = normalised_phone;
		payload.phone_hash = await sha256Base64Url(normalised_phone);
		payload.phone_hash_base64 = await sha256Base64(normalised_phone);
		payload.phone_hash2 = await sha256Hex(normalised_phone);
	}

	if (emailParam) {
		const normalized_email = normalizeEmail(emailParam);
		if (!normalized_email) {
			return Response.json({ error: 'Invalid email address.' }, { status: 400 });
		}
		payload.email = emailParam;
		payload.normalized_email = normalized_email;
		payload.email_hash = await sha256Base64Url(normalized_email);
		payload.email_hash_base64 = await sha256Base64(normalized_email);
		payload.email_hash2 = await sha256Hex(normalized_email);
	}

	return Response.json(payload);
};
