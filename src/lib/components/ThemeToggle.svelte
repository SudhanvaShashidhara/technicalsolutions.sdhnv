<script lang="ts">
	import { theme } from '../theme';
</script>

<button
	type="button"
	on:click={theme.toggle}
	class="inline-flex h-9 w-9 items-center justify-center rounded-full text-googlegreyG800 transition-colors hover:bg-googleblueG50 dark:text-gray-300 dark:hover:bg-white/10"
	aria-label="Toggle dark mode"
	title="Toggle dark mode"
>
	{#if $theme === 'dark'}
		<!-- Sun -->
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
			<circle cx="12" cy="12" r="4" />
			<path
				stroke-linecap="round"
				d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
			/>
		</svg>
	{:else}
		<!-- Moon -->
		<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
			/>
		</svg>
	{/if}
</button>
