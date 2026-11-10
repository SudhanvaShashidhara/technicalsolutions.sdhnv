import { browser } from '$app/environment';

/**
 * Safely pushes an event/payload object onto `window.dataLayer`.
 */
export function pushDataLayer(payload: Record<string, unknown>): void {
	if (!browser) return;
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push(payload);
}

/**
 * Safely invokes `window.gtag(...)` if loaded, or queues arguments on `window.dataLayer`
 * using Google's standard `gtag` queue convention so form handlers never throw when GTM/gtag
 * is blocked or still loading.
 */
export function callGtag(...args: unknown[]): void {
	if (!browser) return;
	if (typeof window.gtag === 'function') {
		window.gtag(...args);
		return;
	}
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push(args);
}
