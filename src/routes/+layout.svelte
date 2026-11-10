<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col bg-googlegreyG50 dark:bg-googlegreyG900">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
