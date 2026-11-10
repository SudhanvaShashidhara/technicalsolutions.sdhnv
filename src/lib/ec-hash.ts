const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/**
 * Normalizes an email address per Google Ads Enhanced Conversions specification:
 * - Trims leading/trailing whitespace and lowercases
 * - Removes dots (`.`) from the local part ONLY for gmail.com / googlemail.com
 * Returns null if the address does not have a valid `local@domain` shape.
 */
export function normalizeEmail(raw: string | null | undefined): string | null {
	if (!raw) return null;
	const trimmed = raw.trim().toLowerCase();
	const parts = trimmed.split('@');
	if (parts.length !== 2 || !parts[0] || !parts[1] || !parts[1].includes('.')) {
		return null;
	}
	const [local, domain] = parts;
	const normalizedLocal = GMAIL_DOMAINS.has(domain) ? local.replace(/\./g, '') : local;
	if (!normalizedLocal) return null;
	return `${normalizedLocal}@${domain}`;
}

/**
 * Normalizes a phone number to E.164 format (`+<country><subscriber>`) per Google Ads spec:
 * - Strips spaces, hyphens, parentheses, and dots
 * - Prepends `+` if missing
 * Returns null if no digits are present.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
	if (!raw) return null;
	const cleaned = raw.trim().replace(/[\s().-]/g, '');
	if (!cleaned) return null;
	const withPlus = cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
	if (!/^\+\d{6,15}$/.test(withPlus)) {
		return null;
	}
	return withPlus;
}

async function digestSha256(value: string): Promise<Uint8Array> {
	const encoded = new TextEncoder().encode(value);
	const buffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);
	return new Uint8Array(buffer);
}

/**
 * Computes lowercase hexadecimal SHA-256 hash (required by Google Ads Enhanced Conversions).
 */
export async function sha256Hex(value: string): Promise<string> {
	const bytes = await digestSha256(value);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Computes base64url-encoded SHA-256 hash (without `=` padding).
 */
export async function sha256Base64Url(value: string): Promise<string> {
	const bytes = await digestSha256(value);
	let binary = '';
	for (const b of bytes) {
		binary += String.fromCharCode(b);
	}
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
