import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	TYPEFORM_TOKEN: {
		description: 'Optional Typeform personal access token used by /api/typeform-handler',
		schema: (value) => value ?? ''
	},
	FIREBASE_SERVICE_ACCOUNT_JSON: {
		description: 'Optional Firebase Admin service account JSON string for Firestore persistence',
		schema: (value) => value ?? ''
	},
	FIREBASE_PROJECT_ID: {
		description:
			'Optional Firebase project ID (used with FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY)',
		schema: (value) => value ?? ''
	},
	FIREBASE_CLIENT_EMAIL: {
		description: 'Optional Firebase service account client email',
		schema: (value) => value ?? ''
	},
	FIREBASE_PRIVATE_KEY: {
		description: 'Optional Firebase service account private key (PEM format)',
		schema: (value) => value ?? ''
	},
	FIREBASE_COLLECTION: {
		description: 'Firestore collection name for recorded form submissions',
		schema: (value) => (value && /^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : 'form_submissions')
	}
});
