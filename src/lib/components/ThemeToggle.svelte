<script lang="ts">
	import { theme } from '#lib/theme.ts';
</script>

<button
	type="button"
	onclick={theme.toggle}
	aria-pressed={$theme === 'dark'}
	class="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink dark:text-muted-dark dark:hover:bg-subtle-dark dark:hover:text-ink-dark"
	aria-label={$theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
	title={$theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
>
	<svg
		class="hidden h-5 w-5 dark:block"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="4" />
		<path
			stroke-linecap="round"
			d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
		/>
	</svg>
	<svg
		class="block h-5 w-5 dark:hidden"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.75"
		aria-hidden="true"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
		/>
	</svg>
</button>
