import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function create_theme() {
	const initial: Theme =
		browser && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	const { subscribe, set } = writable<Theme>(initial);

	function apply(next: Theme) {
		if (browser) {
			document.documentElement.classList.toggle('dark', next === 'dark');
			document.documentElement.style.colorScheme = next;
			localStorage.setItem('theme', next);
		}
		set(next);
	}

	return {
		subscribe,
		set: apply,
		toggle: () => apply(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
	};
}

export const theme = create_theme();
