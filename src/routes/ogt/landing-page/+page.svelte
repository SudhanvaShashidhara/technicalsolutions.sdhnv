<script lang="ts">
	import { page } from '$app/stores';
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '$lib/nav';

	let currentGclid = $derived($page.url.searchParams.get('gclid'));

	const codeSnippet = `// src/hooks.server.ts
if (event.url.pathname.includes('ogt/landing-page') && event.url.searchParams.has('gclid')) {
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
					pathname: $page.url.pathname,
					active_gclid: currentGclid,
					is_lowercase: currentGclid === currentGclid.toLowerCase()
				}
			: {
					pathname: $page.url.pathname,
					active_gclid: null,
					note: 'Click a mixed-case test URL below to trigger the 302 server redirect.'
				}
	);

	const sampleValues = ['TeSt_GcLiD_987XYZ', 'CjwKCAjw_MixedCase_123AbC', 'EAIaIQobChMI_DEMO_456'];
</script>

<DemoPageShell
	title="OGT | Landing Page GCLID Redirect Test"
	heading="One Google Tag: GCLID Case Redirect Test"
	category="Tools & Embeds"
	badge="SSR Hook"
	badgeColor="green"
	description="Simulates a server-side 302 redirect that rewrites mixed-case gclid query parameters to lowercase so you can diagnose GCLID mutation impact on Google Tag & Conversion Linker cookies."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'In real Google Ads campaigns, gclid values are case-sensitive base64url tokens — lowercasing them breaks auto-tagging attribution!',
		'This page intentionally reproduces that common server-redirect pitfall for Tag Assistant / _gcl_aw cookie diagnostics.',
		'Open DevTools Network tab (Preserve log) and click a mixed-case link below to observe the HTTP 302 redirect.'
	]}
>
	<div class="g-card space-y-6 p-6 sm:p-8">
		<div>
			<h2 class="text-base font-medium text-googlegreyG900 dark:text-white">
				Current URL parameter state
			</h2>
			<div
				class="mt-3 rounded-xl border border-googlegreyG200 bg-googlegreyG50 p-4 dark:border-googlegreyG800 dark:bg-googlegreyG900"
			>
				{#if currentGclid}
					<p
						class="text-xs font-medium uppercase tracking-wider text-googlegreyG700 dark:text-googlegreycore"
					>
						Detected gclid parameter
					</p>
					<p
						class="mt-1 break-all font-mono text-base font-medium text-googleblue600 dark:text-googleblue300"
					>
						{currentGclid}
					</p>
				{:else}
					<p class="text-sm text-googlegreyG700 dark:text-googlegreycore">
						No <code class="font-mono">gclid</code> query parameter is currently present in the URL.
					</p>
				{/if}
			</div>
		</div>

		<div>
			<h3 class="text-sm font-medium text-googlegreyG900 dark:text-white">
				Trigger mixed-case server redirect
			</h3>
			<p class="mt-1 text-xs text-googlegreyG700 dark:text-googlegreycore">
				Each link below forces a full server request (<code class="font-mono"
					>data-sveltekit-reload</code
				>) with uppercase characters so <code class="font-mono">hooks.server.ts</code> responds with
				<code class="font-mono">302 Found</code>.
			</p>

			<div class="mt-4 flex flex-wrap gap-2.5">
				{#each sampleValues as sample (sample)}
					<a
						data-sveltekit-reload
						href="/ogt/landing-page?gclid={sample}"
						class="g-btn-secondary !px-4 !py-2 font-mono !text-xs"
					>
						?gclid={sample}
					</a>
				{/each}
			</div>
		</div>
	</div>
</DemoPageShell>
