<script lang="ts">
	import { onMount } from 'svelte';
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';
	import { recordClientSubmission } from '#lib/submissions.ts';

	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `window.addEventListener('message', (event) => {
  if (!event.origin.endsWith('.typeform.com') && event.origin !== 'https://typeform.com') return;
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
			const trustedOrigin =
				event.origin === 'https://typeform.com' ||
				(event.origin.startsWith('https://') && event.origin.endsWith('.typeform.com'));
			if (!trustedOrigin) return;

			if (event.data && typeof event.data === 'object' && event.data.type === 'form-submit') {
				const payload = {
					event: 'typeform_submit',
					formId: event.data.formId ?? '01HT9JTWN98JDYTWBPD8F6E4V4',
					response_id: event.data.responseId ?? null
				};
				pushDataLayer(payload);
				livePayload = payload;
				void recordClientSubmission({
					route: '/iframe/typeform',
					formId: String(payload.formId),
					source: 'iframe',
					fields: {
						provider: 'typeform',
						response_id: payload.response_id
					},
					tagPayload: payload
				});
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
	heading="Typeform Embed"
	category="Tools & Embeds"
	badge="Iframe"
	description="Captures trusted Typeform postMessage submit events onto window.dataLayer."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Validates event.origin against *.typeform.com before handling messages.',
		'Pushes typeform_submit to dataLayer and logs submissions to /api/submissions.',
		'Pair with POST /api/typeform-handler for Typeform Responses API enrichment.'
	]}
>
	<div class="ed-card overflow-hidden p-4 sm:p-5">
		<div
			class="mb-4 flex items-center justify-between border-b border-line pb-3 dark:border-line-dark"
		>
			<h2 class="text-sm font-semibold text-ink dark:text-ink-dark">Embedded widget</h2>
			<span class="ed-tag">01HT9JTWN98JDYTWBPD8F6E4V4</span>
		</div>
		<div class="min-h-[520px] rounded-lg bg-subtle p-2 dark:bg-canvas-dark">
			<div data-tf-live="01HT9JTWN98JDYTWBPD8F6E4V4"></div>
		</div>
	</div>
</DemoPageShell>
