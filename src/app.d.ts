// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}

declare interface Window {
	gtag: (x: string, y: string, z: unknown) => void;
	dataLayer: Array;
	enhanced_conversion_data: {email?: FormDataEntryValue | null, tel?: FormDataEntryValue | null};
}
