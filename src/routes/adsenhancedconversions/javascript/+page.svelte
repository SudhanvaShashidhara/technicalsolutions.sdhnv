<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { enhancedConversionsLinks } from '$lib/nav';
	import { normalizePhone } from '$lib/ec-hash';

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Assign global JS variable read by Google Tag / GTM JavaScript Variable
window.enhanced_conversion_data = {
  email: email.trim(),
  phone_number: '+15552345678' // E.164 format
};`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const email = String(formData.get('email') ?? '').trim();
		const tel = String(formData.get('tel') ?? '').trim();
		const phone_number = normalizePhone(tel) ?? tel;

		const enhanced_conversion_data = { email, tel, phone_number };
		window.enhanced_conversion_data = enhanced_conversion_data;

		livePayload = {
			'window.enhanced_conversion_data': enhanced_conversion_data
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Ads Enhanced Conversions | JavaScript"
	heading="Enhanced Conversions: JavaScript Variable"
	category="Enhanced Conversions"
	badge="Window Variable"
	badgeColor="neutral"
	description="Populates window.enhanced_conversion_data on form submission so Google Tag or a GTM JavaScript Variable can read user-provided data directly from memory."
	tabs={enhancedConversionsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Form retains id="javascript_form" and assigns window.enhanced_conversion_data synchronously.',
		'Includes both tel (legacy container variable) and phone_number (standard Google Ads key) formatted in E.164.',
		'Open DevTools Console and evaluate window.enhanced_conversion_data after submitting.'
	]}
>
	<ServiceLeadForm
		formId="javascript_form"
		showPhone={true}
		showRequirementSelect={true}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	/>
</DemoPageShell>
