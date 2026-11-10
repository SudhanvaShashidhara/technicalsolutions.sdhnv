import { writable } from 'svelte/store';
import { browser } from '$app/env';

export type Theme = 'light' | 'dark';

function create_theme() {
	const initial: Theme =
		browser && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	const { subscribe, set } = writable<Theme>(initial);

	function apply(next: Theme) {
		if (browser) {
			document.documentElement.classList.toggle('dark', next === 'dark');
			document.documentElement.style.colorScheme = next;
			try {
				localStorage.setItem('theme', next);
			} catch {
				// Ignore storage errors in restricted browsing modes
			}
		}
		set(next);
	}

	return {
		subscribe,
		set: apply,
		toggle: () => {
			if (!browser) return;
			apply(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
		}
	};
}

export const theme = create_theme();
