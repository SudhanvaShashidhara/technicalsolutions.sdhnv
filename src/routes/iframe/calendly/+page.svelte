<script lang="ts">
	import { onMount } from 'svelte';
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';
	import { recordClientSubmission } from '#lib/submissions.ts';

	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `window.addEventListener('message', (e) => {
  if (e.origin === 'https://calendly.com' && e.data?.event?.startsWith('calendly.')) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: e.data.event,
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
			if (e.origin !== 'https://calendly.com') return;
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
				if (e.data.event === 'calendly.event_scheduled') {
					void recordClientSubmission({
						route: '/iframe/calendly',
						formId: 'calendly_embed',
						source: 'iframe',
						fields: {
							provider: 'calendly',
							event: e.data.event
						},
						tagPayload: payload
					});
				}
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
	heading="Calendly Embed"
	category="Tools & Embeds"
	badge="Iframe"
	description="Captures trusted calendly.* postMessage lifecycle events onto window.dataLayer."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Validates e.origin === "https://calendly.com" before accepting postMessage payloads.',
		'Records calendly.event_scheduled bookings to /api/submissions.',
		'See /iframe/calendly/confirmation for redirect-based conversion tracking.'
	]}
>
	<div class="ed-card overflow-hidden p-4 sm:p-5">
		<div
			class="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 dark:border-line-dark"
		>
			<h2 class="text-sm font-semibold text-ink dark:text-ink-dark">Inline scheduler</h2>
			<a
				href="/iframe/calendly/confirmation"
				class="text-xs font-medium text-cobalt hover:underline dark:text-cobalt-dark"
			>
				Confirmation page &rarr;
			</a>
		</div>
		<div
			class="calendly-inline-widget overflow-hidden rounded-lg"
			data-url="https://calendly.com/sudhanvashashidhara/30min"
			style="min-width: 320px; height: 680px;"
		></div>
	</div>
</DemoPageShell>
