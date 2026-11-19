export interface ArchiveSubmissionPayload {
	route: string;
	formId?: string | null;
	source?: 'form' | 'contact' | 'iframe';
	fields: Record<string, unknown>;
	score?: number | null;
	tagPayload?: Record<string, unknown> | null;
}

export interface ArchiveSubmissionResponse {
	saved: boolean;
	storage: 'firestore' | 'unconfigured' | 'error';
	id: string | null;
}

/**
 * Extracts all values from a FormData instance, preserving multi-value checkbox arrays.
 */
export function serializeFormData(formData: FormData): Record<string, string | string[]> {
	const out: Record<string, string | string[]> = {};
	for (const [key, rawValue] of formData.entries()) {
		const value = typeof rawValue === 'string' ? rawValue.trim() : '';
		const existing = out[key];
		if (existing === undefined) {
			out[key] = value;
		} else if (Array.isArray(existing)) {
			existing.push(value);
		} else {
			out[key] = [existing, value];
		}
	}
	return out;
}

/**
 * Sends a form submission to POST /api/submissions so Firebase Firestore records it
 * server-side without ever interrupting Google Tag / GTM client execution.
 */
export async function recordClientSubmission(
	payload: ArchiveSubmissionPayload
): Promise<ArchiveSubmissionResponse> {
	try {
		const res = await fetch('/api/submissions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
		if (!res.ok) {
			return { saved: false, storage: 'error', id: null };
		}
		const data = (await res.json()) as Partial<ArchiveSubmissionResponse>;
		return {
			saved: Boolean(data.saved),
			storage:
				data.storage === 'firestore' || data.storage === 'unconfigured' ? data.storage : 'error',
			id: typeof data.id === 'string' ? data.id : null
		};
	} catch {
		return { saved: false, storage: 'error', id: null };
	}
}
