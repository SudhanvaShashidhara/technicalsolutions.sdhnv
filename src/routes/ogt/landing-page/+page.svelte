<script lang="ts">
	import { page } from '$app/state';
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '#lib/nav.ts';

	let currentGclid = $derived(page.url.searchParams.get('gclid'));

	const codeSnippet = `// src/hooks.server.ts
if (!building && event.url.pathname.includes('ogt/landing-page') && event.url.searchParams.has('gclid')) {
  const currentGclid = event.url.searchParams.get('gclid') ?? '';
  const lowerGclid = currentGclid.toLowerCase();
  if (currentGclid !== lowerGclid) {
    const searchParams = new URLSearchParams(event.url.search);
    searchParams.set('gclid', lowerGclid);
    redirect(302, \`\${event.url.pathname}?\${searchParams.toString()}\`);
  }
}`;

	let livePayload = $derived<Record<string, unknown>>(
		currentGclid
			? {
					pathname: page.url.pathname,
					active_gclid: currentGclid,
					is_lowercase: currentGclid === currentGclid.toLowerCase()
				}
			: {
					pathname: page.url.pathname,
					active_gclid: null,
					note: 'Select a mixed-case link to trigger the 302 redirect.'
				}
	);

	const sampleValues = ['TeSt_GcLiD_987XYZ', 'CjwKCAjw_MixedCase_123AbC', 'EAIaIQobChMI_DEMO_456'];
</script>

<DemoPageShell
	title="OGT | Landing Page GCLID Redirect Test"
	heading="GCLID Redirect Test"
	category="Tools & Embeds"
	badge="SSR"
	description="Reproduces a 302 redirect lowercasing gclid parameters for Google Tag diagnostics."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'gclid tokens are case-sensitive; lowercasing them breaks auto-tagging attribution.',
		'Links use data-sveltekit-reload to trigger a full server 302 response.'
	]}
>
	<div class="ed-card space-y-5 p-5 sm:p-6">
		<div>
			<h2 class="text-sm font-semibold text-ink dark:text-ink-dark">Current parameter</h2>
			<div
				class="mt-2.5 rounded-lg border border-line bg-subtle p-4 dark:border-line-dark dark:bg-canvas-dark"
			>
				{#if currentGclid}
					<p class="font-mono text-sm font-medium break-all text-cobalt dark:text-cobalt-dark">
						gclid={currentGclid}
					</p>
				{:else}
					<p class="text-xs text-muted dark:text-muted-dark">
						No <code class="font-mono">gclid</code> query parameter present.
					</p>
				{/if}
			</div>
		</div>

		<div>
			<h3 class="text-xs font-semibold uppercase tracking-wider text-muted dark:text-muted-dark">
				Trigger 302 lowercase redirect
			</h3>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each sampleValues as sample (sample)}
					<a
						data-sveltekit-reload
						href="/ogt/landing-page?gclid={sample}"
						class="ed-btn-secondary !px-3.5 !py-1.5 font-mono !text-xs"
					>
						?gclid={sample}
					</a>
				{/each}
			</div>
		</div>
	</div>
</DemoPageShell>
