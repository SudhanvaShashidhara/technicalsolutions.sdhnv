<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { enhancedConversionsLinks } from '$lib/nav';

	let submitted = $state(false);
	let successMessage = $state('');
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `<!-- Standard HTML inputs automatically detected by Google Tag -->
<form id="automatic_form">
  <input type="email" name="email" autocomplete="email" required />
  <input type="tel" name="tel" autocomplete="tel" required />
  <button type="submit">Submit lead</button>
</form>

<!-- Google Tag config with Enhanced Conversions enabled -->
<script>
  gtag('config', 'AW-XXXXXXXXX', {
    allow_enhanced_conversions: true
  });
${'</' + 'script>'}`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const email = String(formData.get('email') ?? '').trim();
		const tel = String(formData.get('tel') ?? '').trim();
		const service = String(formData.get('service_details') ?? '');
		const requirement = String(formData.get('service_requirement') ?? '');

		successMessage = `Thanks for submitting the form. A confirmation email is sent to ${email}. We will also be contacting you at ${tel}.`;
		livePayload = {
			method: 'automatic_detection',
			form_id: 'automatic_form',
			detected_inputs: { email, tel },
			service_details: service,
			service_requirement: requirement
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Ads Enhanced Conversions | Automatic"
	heading="Enhanced Conversions: Automatic Detection"
	category="Enhanced Conversions"
	badge="Automatic"
	badgeColor="blue"
	description="Google Tag inspects standard type=&quot;email&quot; and type=&quot;tel&quot; form inputs on submit when Automatic Enhanced Conversions is enabled in Google Ads."
	tabs={enhancedConversionsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Form retains id="automatic_form" and standard email/tel input types for automatic tag scraping.',
		'Confirmation message renders with id="form_success" for GTM Element Visibility triggers.',
		'Google Tag automatically normalizes and SHA-256 hashes detected PII before network transmission.'
	]}
>
	<ServiceLeadForm
		formId="automatic_form"
		showPhone={true}
		showRequirementSelect={true}
		{submitted}
		{successMessage}
		successId="form_success"
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	/>
</DemoPageShell>
