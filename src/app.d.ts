// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface EnhancedConversionData {
		email?: string;
		tel?: string;
		phone_number?: string;
		sha256_email_address?: string;
		sha256_phone_number?: string;
	}

	interface FloodlightData {
		u1?: string;
		u2?: string;
		cost?: number;
		ord?: string;
		qty?: number;
	}

	interface Window {
		gtag?: (...args: unknown[]) => void;
		dataLayer?: Array<Record<string, unknown> | IArguments | unknown[]>;
		enhanced_conversion_data?: EnhancedConversionData;
		floodlight_data?: FloodlightData;
	}
}

export {};
