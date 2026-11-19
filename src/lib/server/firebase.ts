import {
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_COLLECTION,
	FIREBASE_PRIVATE_KEY,
	FIREBASE_PROJECT_ID,
	FIREBASE_SERVICE_ACCOUNT_JSON
} from '$app/env/private';
import {
	normalizeEmail,
	normalizePhone,
	sha256Base64,
	sha256Base64Url,
	sha256Hex
} from '#lib/ec-hash.ts';
import { sanitizeText, sanitizeValue } from '#lib/server/security.ts';
import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { FieldValue, getFirestore, type Firestore } from 'firebase-admin/firestore';

export interface FormSubmissionInput {
	route: string;
	formId?: string | null;
	source?: 'form' | 'contact' | 'iframe';
	fields: Record<string, unknown>;
	score?: number | null;
	tagPayload?: Record<string, unknown> | null;
	userAgent?: string | null;
}

export interface SubmissionHashes {
	email_sha256_hex: string | null;
	email_sha256_base64: string | null;
	email_sha256_base64url: string | null;
	phone_sha256_hex: string | null;
	phone_sha256_base64: string | null;
	phone_sha256_base64url: string | null;
}

export interface SubmissionRecordResult {
	saved: boolean;
	storage: 'firestore' | 'unconfigured' | 'error';
	id: string | null;
	normalized: {
		email: string | null;
		phone: string | null;
	};
	hashes: SubmissionHashes;
}

let cachedDb: Firestore | null = null;
let warnedUnconfigured = false;

function resolveServiceAccount(): ServiceAccount | null {
	if (FIREBASE_SERVICE_ACCOUNT_JSON.trim()) {
		try {
			const parsed = JSON.parse(FIREBASE_SERVICE_ACCOUNT_JSON) as Record<string, unknown>;
			const projectId =
				typeof parsed.project_id === 'string'
					? parsed.project_id
					: typeof parsed.projectId === 'string'
						? parsed.projectId
						: '';
			const clientEmail =
				typeof parsed.client_email === 'string'
					? parsed.client_email
					: typeof parsed.clientEmail === 'string'
						? parsed.clientEmail
						: '';
			const rawKey =
				typeof parsed.private_key === 'string'
					? parsed.private_key
					: typeof parsed.privateKey === 'string'
						? parsed.privateKey
						: '';
			const privateKey = rawKey.replace(/\\n/g, '\n');

			if (projectId && clientEmail && privateKey) {
				return { projectId, clientEmail, privateKey };
			}
		} catch (err) {
			console.error('[firebase] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err);
			return null;
		}
	}

	if (FIREBASE_PROJECT_ID.trim() && FIREBASE_CLIENT_EMAIL.trim() && FIREBASE_PRIVATE_KEY.trim()) {
		return {
			projectId: FIREBASE_PROJECT_ID.trim(),
			clientEmail: FIREBASE_CLIENT_EMAIL.trim(),
			privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
		};
	}

	return null;
}

export function isFirebaseConfigured(): boolean {
	return resolveServiceAccount() !== null;
}

function getFirestoreDb(): Firestore | null {
	if (cachedDb) return cachedDb;

	const serviceAccount = resolveServiceAccount();
	if (!serviceAccount) {
		if (!warnedUnconfigured) {
			warnedUnconfigured = true;
			console.warn(
				'[firebase] Firestore credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) to persist form submissions.'
			);
		}
		return null;
	}

	const app =
		getApps().length > 0
			? getApps()[0]
			: initializeApp({
					credential: cert(serviceAccount),
					projectId: serviceAccount.projectId
				});

	cachedDb = getFirestore(app);
	return cachedDb;
}

function extractFirstString(fields: Record<string, unknown>, keys: string[]): string {
	for (const key of keys) {
		const value = fields[key];
		if (typeof value === 'string' && value.trim()) {
			return value.trim();
		}
	}
	return '';
}

export async function recordFormSubmission(
	input: FormSubmissionInput
): Promise<SubmissionRecordResult> {
	const cleanFields = (sanitizeValue(input.fields) as Record<string, unknown> | null) ?? {};
	const rawEmail = extractFirstString(cleanFields, ['email', 'email_address']);
	const rawPhone = extractFirstString(cleanFields, ['phone', 'tel', 'phone_number']);

	const normalizedEmail = rawEmail ? normalizeEmail(rawEmail) : null;
	const normalizedPhone = rawPhone ? normalizePhone(rawPhone) : null;

	const [
		email_sha256_hex,
		email_sha256_base64,
		email_sha256_base64url,
		phone_sha256_hex,
		phone_sha256_base64,
		phone_sha256_base64url
	] = await Promise.all([
		normalizedEmail ? sha256Hex(normalizedEmail) : Promise.resolve(null),
		normalizedEmail ? sha256Base64(normalizedEmail) : Promise.resolve(null),
		normalizedEmail ? sha256Base64Url(normalizedEmail) : Promise.resolve(null),
		normalizedPhone ? sha256Hex(normalizedPhone) : Promise.resolve(null),
		normalizedPhone ? sha256Base64(normalizedPhone) : Promise.resolve(null),
		normalizedPhone ? sha256Base64Url(normalizedPhone) : Promise.resolve(null)
	]);

	const normalized = { email: normalizedEmail, phone: normalizedPhone };
	const hashes: SubmissionHashes = {
		email_sha256_hex,
		email_sha256_base64,
		email_sha256_base64url,
		phone_sha256_hex,
		phone_sha256_base64,
		phone_sha256_base64url
	};

	const db = getFirestoreDb();
	if (!db) {
		return {
			saved: false,
			storage: 'unconfigured',
			id: null,
			normalized,
			hashes
		};
	}

	const documentData = {
		route: sanitizeText(input.route, 128) || '/',
		formId: input.formId ? sanitizeText(input.formId, 80) : null,
		source: input.source ?? 'form',
		score: typeof input.score === 'number' && Number.isFinite(input.score) ? input.score : null,
		fields: cleanFields,
		normalized,
		hashes,
		tagPayload: input.tagPayload ? sanitizeValue(input.tagPayload) : null,
		userAgent: input.userAgent ? sanitizeText(input.userAgent, 200) : null,
		submittedAtIso: new Date().toISOString(),
		submittedAt: FieldValue.serverTimestamp()
	};

	try {
		const docRef = await db.collection(FIREBASE_COLLECTION || 'form_submissions').add(documentData);
		return {
			saved: true,
			storage: 'firestore',
			id: docRef.id,
			normalized,
			hashes
		};
	} catch (err) {
		console.error('[firebase] Failed to persist form submission to Firestore:', err);
		return {
			saved: false,
			storage: 'error',
			id: null,
			normalized,
			hashes
		};
	}
}
