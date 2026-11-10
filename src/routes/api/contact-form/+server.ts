import { json } from '@sveltejs/kit';
import { normalizeEmail, normalizePhone, sha256Base64Url, sha256Hex } from '$lib/ec-hash';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let data: Record<string, unknown>;
	try {
		data = (await request.json()) as Record<string, unknown>;
	} catch {
		return json({ error: 'Invalid JSON request body.' }, { status: 400 });
	}

	const rawEmail = typeof data.email === 'string' ? data.email : '';
	const rawPhone = typeof data.phone === 'string' ? data.phone : '';

	const normalized_email = normalizeEmail(rawEmail);
	if (!normalized_email) {
		return json({ error: 'Please provide a valid email address.' }, { status: 400 });
	}

	const email_hash = await sha256Base64Url(normalized_email);
	const email_hash2 = await sha256Hex(normalized_email);

	let normalised_phone: string | null = null;
	let phone_hash: string | null = null;
	let phone_hash2: string | null = null;

	if (rawPhone.trim()) {
		normalised_phone = normalizePhone(rawPhone);
		if (!normalised_phone) {
			return json(
				{ error: 'Invalid phone number. Include country code (e.g. +1 555 123 4567).' },
				{ status: 400 }
			);
		}
		phone_hash = await sha256Base64Url(normalised_phone);
		phone_hash2 = await sha256Hex(normalised_phone);
	}

	return json({
		success: true,
		normalized_email,
		email_hash,
		email_hash2,
		normalised_phone,
		phone_hash,
		phone_hash2
	});
};
