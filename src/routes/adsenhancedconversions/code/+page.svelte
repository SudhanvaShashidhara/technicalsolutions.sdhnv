<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { enhancedConversionsLinks } from '$lib/nav';
	import { pushDataLayer } from '$lib/gtag';

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit_complete_dl',
  email: email.trim(),
  tel: tel.trim()
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const email = String(formData.get('email') ?? '').trim();
		const tel = String(formData.get('tel') ?? '').trim();

		const dlEvent = {
			event: 'form_submit_complete_dl',
			email,
			tel
		};
		pushDataLayer(dlEvent);

		livePayload = dlEvent;
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Ads Enhanced Conversions | dataLayer"
	heading="Enhanced Conversions: Code / dataLayer"
	category="Enhanced Conversions"
	badge="dataLayer"
	badgeColor="green"
	description="Pushes user-provided email and phone fields alongside a custom form_submit_complete_dl event onto window.dataLayer for GTM Data Layer Variables."
	tabs={enhancedConversionsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Safely initializes window.dataLayer and pushes event: "form_submit_complete_dl".',
		'Bind GTM Data Layer Variables to "email" and "tel" inside a User-Provided Data variable.',
		'Google Tag Manager automatically hashes plaintext values pushed to User-Provided Data.'
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
