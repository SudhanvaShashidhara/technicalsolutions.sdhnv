<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { sa360Links, serviceOptions } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';

	const scoreByService = Object.fromEntries(serviceOptions.map((s) => [s.value, s.leadValue]));

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'floodlight_lead_submit',
  floodlight_u1: serviceDetails,
  floodlight_u2: serviceRequirement,
  floodlight_value: leadValue,
  transaction_id: \`FL-\${Date.now()}\`
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const service_details = String(formData.get('service_details') ?? '');
		const service_requirement = String(formData.get('service_requirement') ?? '');
		const floodlight_value = scoreByService[service_details] ?? 10;
		const transaction_id = `FL-${Date.now()}`;

		const dlPayload = {
			event: 'floodlight_lead_submit',
			floodlight_u1: service_details,
			floodlight_u2: service_requirement,
			floodlight_value,
			transaction_id
		};

		pushDataLayer(dlPayload);
		livePayload = dlPayload;
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="SA360 Floodlight | GTM dataLayer Implementation"
	heading="SA360: GTM (dataLayer)"
	category="Search Ads 360"
	badge="dataLayer"
	badgeColor="yellow"
	description="Pushes structured Floodlight parameters onto window.dataLayer with event floodlight_lead_submit so Google Tag Manager Floodlight Counter or Sales tags map Data Layer Variables cleanly."
	tabs={sa360Links}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Pushes event: "floodlight_lead_submit" with floodlight_u1, floodlight_u2, floodlight_value, and transaction_id.',
		'Ensure a Conversion Linker tag is active on All Pages in GTM for SA360 gclid/dclid attribution.',
		'Bind floodlight_u1 -> u1 and floodlight_u2 -> u2 under Custom Variables in the GTM Floodlight tag.'
	]}
>
	<ServiceLeadForm
		showPhone={true}
		showRequirementSelect={true}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	/>
</DemoPageShell>
