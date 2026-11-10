<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { sa360Links, serviceOptions } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';

	const scoreByService = Object.fromEntries(serviceOptions.map((s) => [s.value, s.leadValue]));

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Expose Floodlight fields on window for GTM JavaScript Variable extraction
window.floodlight_data = {
  u1: serviceDetails,
  u2: serviceRequirement,
  cost: leadValue,
  ord: \`ORD-\${Date.now()}\`,
  qty: 1
};

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: 'floodlight_js_ready' });`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const service_details = String(formData.get('service_details') ?? '');
		const service_requirement = String(formData.get('service_requirement') ?? '');
		const cost = scoreByService[service_details] ?? 10;

		const floodlight_data = {
			u1: service_details,
			u2: service_requirement,
			cost,
			ord: `ORD-${Date.now()}`,
			qty: 1
		};

		window.floodlight_data = floodlight_data;
		pushDataLayer({ event: 'floodlight_js_ready' });

		livePayload = {
			event: 'floodlight_js_ready',
			'window.floodlight_data': floodlight_data
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="SA360 Floodlight | GTM JavaScript Variable"
	heading="SA360: GTM (JavaScript Variable)"
	category="Search Ads 360"
	badge="Window Variable"
	badgeColor="yellow"
	description="Populates window.floodlight_data before firing a lightweight floodlight_js_ready trigger event so GTM JavaScript Variables (e.g. floodlight_data.cost) can read values directly."
	tabs={sa360Links}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Assigns typed window.floodlight_data synchronously before pushing the GTM trigger event.',
		'In GTM, create JavaScript Variables with Global Variable Name set to floodlight_data.u1, floodlight_data.cost, etc.',
		'Inspect window.floodlight_data in DevTools Console after submitting.'
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
