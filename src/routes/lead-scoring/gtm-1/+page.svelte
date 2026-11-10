<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'lead_scoring_form_submit',
  form_entered_data: {
    full_name,
    email,
    service_details,
    additional_details
  }
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const full_name = String(formData.get('full-name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const service_details = String(formData.get('service_details') ?? '');
		const additional_details = String(formData.get('additional_details') ?? '').trim();

		const form_entered_data = { full_name, email, service_details, additional_details };
		const dlEvent = {
			event: 'lead_scoring_form_submit',
			form_entered_data
		};

		pushDataLayer(dlEvent);
		livePayload = dlEvent;
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Lead Scoring Demo - GTM (dataLayer)"
	heading="Lead Scoring: GTM (dataLayer)"
	category="Lead Scoring"
	badge="dataLayer"
	badgeColor="green"
	description="Pushes raw form inputs to window.dataLayer with event lead_scoring_form_submit so Google Tag Manager Lookup Table or RegEx Table variables map service selections to conversion values."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Fires custom event "lead_scoring_form_submit" with nested form_entered_data.service_details.',
		'In GTM, map Data Layer Variable form_entered_data.service_details via a Lookup Table to numeric values.',
		'Allows marketing ops teams to adjust lead weights inside GTM without deploying code changes.'
	]}
>
	<ServiceLeadForm {submitted} onSubmit={handleSubmit} onDismiss={() => (submitted = false)} />
</DemoPageShell>
