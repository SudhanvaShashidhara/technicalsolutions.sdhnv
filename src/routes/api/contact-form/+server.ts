import {
	normalizeEmail,
	normalizePhone,
	sha256Base64,
	sha256Base64Url,
	sha256Hex
} from '#lib/ec-hash.ts';
import { recordFormSubmission } from '#lib/server/firebase.ts';
import {
	checkRateLimit,
	getClientIdentifier,
	parseJsonBody,
	sanitizeText
} from '#lib/server/security.ts';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const rate = checkRateLimit(`contact:${getClientIdentifier(request)}`, {
		limit: 60,
		windowMs: 60_000
	});
	if (!rate.allowed) {
		return Response.json(
			{ error: 'Too many requests. Please try again shortly.' },
			{ status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
		);
	}

	const parsed = await parseJsonBody(request, 16_384);
	if (!parsed.ok) {
		return Response.json({ error: parsed.error }, { status: parsed.status });
	}
	const data = parsed.data;

	const firstName = sanitizeText(data.firstName, 120);
	const lastName = sanitizeText(data.lastName, 120);
	const rawEmail = sanitizeText(data.email, 254);
	const rawPhone = sanitizeText(data.phone, 40);
	const country = sanitizeText(data.country, 80);
	const city = sanitizeText(data.city, 120);
	const postalCode = sanitizeText(data.postalCode, 32);

	const normalized_email = normalizeEmail(rawEmail);
	if (!normalized_email) {
		return Response.json({ error: 'Please provide a valid email address.' }, { status: 400 });
	}

	const [email_hash, email_hash_base64, email_hash2] = await Promise.all([
		sha256Base64Url(normalized_email),
		sha256Base64(normalized_email),
		sha256Hex(normalized_email)
	]);

	let normalised_phone: string | null = null;
	let phone_hash: string | null = null;
	let phone_hash_base64: string | null = null;
	let phone_hash2: string | null = null;

	if (rawPhone) {
		normalised_phone = normalizePhone(rawPhone);
		if (!normalised_phone) {
			return Response.json(
				{ error: 'Invalid phone number. Include country code (e.g. +1 555 123 4567).' },
				{ status: 400 }
			);
		}
		[phone_hash, phone_hash_base64, phone_hash2] = await Promise.all([
			sha256Base64Url(normalised_phone),
			sha256Base64(normalised_phone),
			sha256Hex(normalised_phone)
		]);
	}

	const submission = await recordFormSubmission({
		route: '/contact',
		formId: 'contact_form',
		source: 'contact',
		fields: {
			firstName,
			lastName,
			email: rawEmail,
			phone: rawPhone,
			country,
			city,
			postalCode
		},
		userAgent: request.headers.get('user-agent')
	});

	return Response.json({
		success: true,
		normalized_email,
		email_hash,
		email_hash_base64,
		email_hash2,
		normalised_phone,
		phone_hash,
		phone_hash_base64,
		phone_hash2,
		submission: {
			saved: submission.saved,
			storage: submission.storage,
			id: submission.id
		}
	});
};
