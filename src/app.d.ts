// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

interface ReCaptchaEnterprise {
	render: (
		container: string,
		params: {
			sitekey: string;
			callback?: (token: string) => void;
			'expired-callback'?: () => void;
			'error-callback'?: () => void;
		}
	) => number;
	reset: (widgetId?: number) => void;
	ready: (callback: () => void) => void;
	execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare interface Window {
	gtag: (x: string, y: string, z: unknown) => void;
	dataLayer: Array;
	enhanced_conversion_data: { email?: FormDataEntryValue | null; tel?: FormDataEntryValue | null };
	grecaptcha?: { enterprise: ReCaptchaEnterprise };
	onRecaptchaV2Load?: () => void;
}
