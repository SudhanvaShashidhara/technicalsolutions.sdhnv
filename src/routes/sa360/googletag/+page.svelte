<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { sa360Links, serviceOptions } from '$lib/nav';
	import { callGtag } from '$lib/gtag';

	const scoreByService = Object.fromEntries(serviceOptions.map((s) => [s.value, s.leadValue]));

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Search Ads 360 / Campaign Manager 360 Floodlight Sales event via Google Tag
gtag('event', 'conversion', {
  allow_custom_scripts: true,
  value: leadValue,
  transaction_id: orderId,
  u1: serviceDetails,      // Custom Floodlight variable u1
  u2: serviceRequirement,  // Custom Floodlight variable u2
  send_to: 'DC-1000000/leadgen0/quote0+transactions'
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const email = String(formData.get('email') ?? '').trim();
		const service_details = String(formData.get('service_details') ?? '');
		const service_requirement = String(formData.get('service_requirement') ?? '');
		const value = scoreByService[service_details] ?? 10;
		const transaction_id = `FL-${Date.now()}`;

		const floodlightParams = {
			allow_custom_scripts: true,
			value,
			transaction_id,
			u1: service_details,
			u2: service_requirement,
			send_to: 'DC-1000000/leadgen0/quote0+transactions'
		};

		callGtag('set', 'user_data', { email });
		callGtag('event', 'conversion', floodlightParams);

		livePayload = {
			gtag_command: ['event', 'conversion', floodlightParams]
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="SA360 Floodlight | Google Tag Implementation"
	heading="SA360: Google Tag (Floodlight)"
	category="Search Ads 360"
	badge="gtag.js"
	badgeColor="yellow"
	description="Fires a Search Ads 360 Floodlight Sales tag directly via gtag.js, passing custom Floodlight variables (u1, u2), revenue value, and a deduplicating transaction_id."
	tabs={sa360Links}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Uses DC-<advertiserId>/<groupTagString>/<activityTagString>+transactions send_to syntax.',
		'Passes custom Floodlight variables u1 (service category) and u2 (urgency timeframe).',
		'Includes unique transaction_id to deduplicate Floodlight Sales conversions in SA360.'
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
