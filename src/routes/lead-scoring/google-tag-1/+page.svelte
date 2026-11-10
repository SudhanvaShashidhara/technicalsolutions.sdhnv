<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '#lib/nav.ts';
	import { callGtag } from '#lib/gtag.ts';

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Extract predefined score from the selected HTML <option data-lead-value="...">
const selectedOption = form.querySelector(
  \`select[name="service_details"] option[value="\${serviceDetails}"]\`
);
const leadValue = Number(selectedOption?.getAttribute('data-lead-value') ?? 0);

gtag('event', 'conversion', {
  send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
  value: leadValue,
  currency: 'USD'
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const full_name = String(formData.get('full-name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const service_details = String(formData.get('service_details') ?? '');
		const additional_details = String(formData.get('additional_details') ?? '').trim();

		const selectedOption = form.querySelector(
			`select[name="service_details"] option[value="${CSS.escape(service_details)}"]`
		);
		const value = Number.parseInt(selectedOption?.getAttribute('data-lead-value') ?? '0', 10) || 0;

		const conversionParams = {
			send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
			value,
			currency: 'USD'
		};

		callGtag('event', 'conversion', conversionParams);

		livePayload = {
			gtag_command: ['event', 'conversion', conversionParams],
			form_entered_data: { full_name, email, service_details, additional_details }
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Lead Scoring Demo - Google Tag (HTML Attributes)"
	heading="Lead Scoring: Google Tag (HTML Attributes)"
	category="Lead Scoring"
	badge="gtag.js"
	badgeColor="blue"
	description="Reads predefined data-lead-value attributes directly from the chosen HTML <option> element and sends the dynamic conversion value to Google Ads via gtag('event', 'conversion', ...)."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Each <option> in select[name="service_details"] carries a data-lead-value attribute (10 to 60).',
		'Conversion event fires to AW-700270946/XObGCK639_8YEOKS9c0C with dynamic USD value.',
		'Uses safe callGtag helper so blocked or delayed tag scripts fall back cleanly onto window.dataLayer.'
	]}
>
	<ServiceLeadForm {submitted} onSubmit={handleSubmit} onDismiss={() => (submitted = false)} />
</DemoPageShell>
