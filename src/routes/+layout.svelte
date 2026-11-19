<script lang="ts">
	import type { Snippet } from 'svelte';
	import '@fontsource-variable/inter';
	import '@fontsource-variable/roboto-mono';
	import '../app.css';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col bg-canvas text-ink dark:bg-canvas-dark dark:text-ink-dark">
	<a href="#main-content" class="skip-link">Skip to main content</a>
	<Navbar />
	<main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
		{@render children()}
	</main>
	<Footer />
</div>
