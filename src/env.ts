import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	TYPEFORM_TOKEN: {
		description: 'Optional Typeform personal access token used by /api/typeform-handler',
		schema: (value) => value ?? ''
	}
});
