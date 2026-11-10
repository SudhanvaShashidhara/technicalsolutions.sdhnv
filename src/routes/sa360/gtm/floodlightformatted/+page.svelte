<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { sa360Links, serviceOptions } from '#lib/nav.ts';
	import { pushDataLayer } from '#lib/gtag.ts';

	const scoreByService = Object.fromEntries(serviceOptions.map((s) => [s.value, s.leadValue]));

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Native Floodlight parameter naming convention (src, type, cat, cost, qty, ord, u1, u2)
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'floodlight_sales_formatted',
  floodlight: {
    src: '1000000',
    type: 'leadgen0',
    cat: 'quote0',
    cost: leadValue,
    qty: 1,
    ord: \`ORD-\${Date.now()}\`,
    u1: serviceDetails,
    u2: serviceRequirement
  }
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const service_details = String(formData.get('service_details') ?? '');
		const service_requirement = String(formData.get('service_requirement') ?? '');
		const cost = scoreByService[service_details] ?? 10;

		const dlPayload = {
			event: 'floodlight_sales_formatted',
			floodlight: {
				src: '1000000',
				type: 'leadgen0',
				cat: 'quote0',
				cost,
				qty: 1,
				ord: `ORD-${Date.now()}`,
				u1: service_details,
				u2: service_requirement
			}
		};

		pushDataLayer(dlPayload);
		livePayload = dlPayload;
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="SA360 Floodlight | GTM Floodlight-Formatted Payload"
	heading="SA360: GTM (Floodlight Formatted)"
	category="Search Ads 360"
	badge="Floodlight"
	badgeColor="yellow"
	description="Structures the dataLayer payload using canonical Floodlight Sales keys (src, type, cat, cost, qty, ord, u1, u2) for 1:1 mapping into GTM Floodlight Sales tags."
	tabs={sa360Links}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Uses canonical Floodlight Sales nomenclature: cost (revenue), qty (item count), and ord (order ID).',
		'Grouping parameters under floodlight.* avoids collisions with GA4 ecommerce dataLayer keys.',
		'Map floodlight.cost -> Revenue, floodlight.ord -> Order ID, and floodlight.qty -> Quantity in GTM.'
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
