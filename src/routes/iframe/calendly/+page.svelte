<script lang="ts">
	import { onMount } from 'svelte';
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '$lib/nav';
	import { pushDataLayer } from '$lib/gtag';

	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Listen for Calendly postMessage events in parent window
window.addEventListener('message', (e) => {
  if (e.origin === 'https://calendly.com' && e.data?.event?.startsWith('calendly.')) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: e.data.event, // e.g. "calendly.event_scheduled"
      calendly_payload: e.data.payload
    });
  }
});`;

	onMount(() => {
		const scriptId = 'calendly-script';
		let script = document.getElementById(scriptId) as HTMLScriptElement | null;
		if (!script) {
			script = document.createElement('script');
			script.src = 'https://assets.calendly.com/assets/external/widget.js';
			script.id = scriptId;
			script.async = true;
			document.head.appendChild(script);
		}

		function handleMessage(e: MessageEvent) {
			if (
				e.data &&
				typeof e.data === 'object' &&
				typeof e.data.event === 'string' &&
				e.data.event.startsWith('calendly.')
			) {
				const payload = {
					event: e.data.event,
					calendly_payload: e.data.payload ?? null
				};
				pushDataLayer(payload);
				livePayload = payload;
			}
		}

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
			document.getElementById(scriptId)?.remove();
		};
	});
</script>

<DemoPageShell
	title="Iframe Demo - Calendly"
	heading="Cross-Origin Iframe: Calendly Embed"
	category="Tools & Embeds"
	badge="Iframe"
	badgeColor="green"
	description="Embeds Calendly's inline scheduling widget and captures cross-origin calendly.* postMessage lifecycle events onto window.dataLayer."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Fixes SSR ReferenceError by scoping DOM script cleanup inside the onMount teardown callback.',
		'Forwards calendly.profile_page_viewed, calendly.date_and_time_selected, and calendly.event_scheduled to dataLayer.',
		'See /iframe/calendly/confirmation for redirect-based thank-you page tracking.'
	]}
>
	<div class="g-card overflow-hidden p-4 sm:p-6">
		<div
			class="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-googlegreyG200 pb-3 dark:border-googlegreyG800"
		>
			<h2 class="text-sm font-medium text-googlegreyG900 dark:text-white">
				Calendly Inline Widget
			</h2>
			<a
				href="/iframe/calendly/confirmation"
				class="text-xs font-medium text-googleblue600 hover:underline dark:text-googleblue300"
			>
				Preview redirect confirmation page &rarr;
			</a>
		</div>
		<div
			class="calendly-inline-widget overflow-hidden rounded-xl"
			data-url="https://calendly.com/sudhanvashashidhara/30min"
			style="min-width: 320px; height: 680px;"
		></div>
	</div>
</DemoPageShell>
