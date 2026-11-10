<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '$lib/nav';
	import { callGtag, pushDataLayer } from '$lib/gtag';

	const serviceDetailsValueMap: Record<string, number> = {
		door_service: 10,
		kitchen_remodeling: 20,
		roofing: 30,
		plumbing: 40,
		hvac: 50,
		landscaping: 60
	};

	const serviceRequirementValueMap: Record<string, number> = {
		immediate: 30,
		within_week: 20,
		within_month: 10
	};

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `const totalValue =
  (serviceDetailsValueMap[service_details] ?? 0) +
  (serviceRequirementValueMap[service_requirement] ?? 0);

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit_complete',
  form_data: form_entered_data,
  lead_value: totalValue
});

gtag('set', 'user_data', { email });
gtag('event', 'lead_scoring_form_submit', {
  value: totalValue,
  service_details,
  service_requirement
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const full_name = String(formData.get('full-name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const service_details = String(formData.get('service_details') ?? '');
		const service_requirement = String(formData.get('service_requirement') ?? '');
		const additional_details = String(formData.get('additional_details') ?? '').trim();

		const form_entered_data = {
			full_name,
			email,
			service_details,
			service_requirement,
			additional_details
		};

		const total_value =
			(serviceDetailsValueMap[service_details] ?? 0) +
			(serviceRequirementValueMap[service_requirement] ?? 0);

		const dlPayload = {
			event: 'form_submit_complete',
			form_data: form_entered_data,
			lead_value: total_value
		};

		pushDataLayer(dlPayload);
		callGtag('set', 'user_data', { email });
		callGtag('event', 'lead_scoring_form_submit', {
			value: total_value,
			service_details,
			service_requirement
		});

		livePayload = {
			dataLayer_push: dlPayload,
			gtag_event: {
				name: 'lead_scoring_form_submit',
				value: total_value,
				service_details,
				service_requirement
			}
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Lead Scoring Demo - GTM (Combined Score)"
	heading="Lead Scoring: GTM (Combined Multi-Field Score)"
	category="Lead Scoring"
	badge="GTM + gtag"
	badgeColor="green"
	description="Combines service category value and urgency timeframe into a composite lead score, dispatching both a GTM dataLayer event (form_submit_complete) and a gtag user_data + event call."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Sums service_details (10–60) and service_requirement (10–30) into lead_value (20–90).',
		'Safely pushes form_submit_complete to window.dataLayer and sets gtag user_data.',
		'Ideal when combining multiple qualification signals that would be cumbersome in GTM Lookup Tables.'
	]}
>
	<ServiceLeadForm
		showRequirementSelect={true}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	/>
</DemoPageShell>
