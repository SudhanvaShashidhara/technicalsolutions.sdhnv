import { env } from '$env/dynamic/public';

// Fallback to Google's official public test key if keys are not defined
const DEFAULT_TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

export const v3SiteKey = env.PUBLIC_RECAPTCHA_V3_SITE_KEY || DEFAULT_TEST_KEY;
export const v2SiteKey = env.PUBLIC_RECAPTCHA_V2_SITE_KEY || DEFAULT_TEST_KEY;

/**
 * Dynamically loads an external script in the browser, returning a promise.
 * Prevents multiple script tags for the same source from being created.
 */
export function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof document === 'undefined') {
			resolve();
			return;
		}

		// If script is already in the document, resolve immediately
		const existingScript = document.querySelector(`script[src="${src}"]`);
		if (existingScript) {
			resolve();
			return;
		}

		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error(`Failed to load external script: ${src}`));
		document.head.appendChild(script);
	});
}
