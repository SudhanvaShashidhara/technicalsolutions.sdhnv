<script lang="ts">
	import { onMount } from 'svelte';
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '$lib/nav';
	import { pushDataLayer } from '$lib/gtag';

	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Listen for Typeform embed postMessage submit events in parent window
window.addEventListener('message', (event) => {
  if (event.data?.type === 'form-submit') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'typeform_submit',
      form_id: event.data.formId,
      response_id: event.data.responseId
    });
  }
});`;

	onMount(() => {
		const scriptId = 'typeform-script';
		let script = document.getElementById(scriptId) as HTMLScriptElement | null;
		if (!script) {
			script = document.createElement('script');
			script.src = 'https://embed.typeform.com/next/embed.js';
			script.id = scriptId;
			script.async = true;
			document.head.appendChild(script);
		}

		function handleMessage(event: MessageEvent) {
			if (event.data && typeof event.data === 'object' && event.data.type === 'form-submit') {
				const payload = {
					event: 'typeform_submit',
					formId: event.data.formId ?? '01HT9JTWN98JDYTWBPD8F6E4V4',
					response_id: event.data.responseId ?? null
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
	title="Iframe Demo - Typeform"
	heading="Cross-Origin Iframe: Typeform Embed"
	category="Tools & Embeds"
	badge="Iframe"
	badgeColor="green"
	description="Demonstrates cross-frame lead capture with Typeform's Next Embed SDK and parent-window postMessage event forwarding to window.dataLayer."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Script injection and cleanup run inside onMount so SSR renders cleanly without ReferenceError.',
		'Parent window listens for Typeform form-submit postMessage events and pushes typeform_submit to dataLayer.',
		'Pair with POST /api/typeform-handler on the backend to enrich conversion events via Typeform Responses API.'
	]}
>
	<div class="g-card overflow-hidden p-4 sm:p-6">
		<div
			class="mb-4 flex items-center justify-between border-b border-googlegreyG200 pb-3 dark:border-googlegreyG800"
		>
			<h2 class="text-sm font-medium text-googlegreyG900 dark:text-white">
				Embedded Typeform Widget
			</h2>
			<span class="g-chip-neutral">01HT9JTWN98JDYTWBPD8F6E4V4</span>
		</div>
		<div class="min-h-[520px] rounded-xl bg-googlegreyG50 p-2 dark:bg-googlegreyG900">
			<div data-tf-live="01HT9JTWN98JDYTWBPD8F6E4V4"></div>
		</div>
	</div>
</DemoPageShell>
