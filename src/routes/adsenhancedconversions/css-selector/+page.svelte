<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { enhancedConversionsLinks } from '#lib/nav.ts';

	let submitted = $state(false);
	let ecValues = $state<{ email: string; tel: string } | null>(null);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `<!-- Confirmation DOM elements targeted by CSS Selectors in GTM / Google Ads -->
<p>
  A confirmation email is sent to <span class="ec_email">user@gmail.com</span>.
  We will also be contacting you at <span class="ec_tel">+15552345678</span>.
</p>

/* Configure User-Provided Data variable in GTM:
 * Email -> DOM Element -> CSS Selector: .ec_email
 * Phone -> DOM Element -> CSS Selector: .ec_tel
 */`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const email = String(formData.get('email') ?? '').trim();
		const tel = String(formData.get('tel') ?? '').trim();

		ecValues = { email, tel };
		livePayload = {
			method: 'css_selector',
			form_id: 'css_selector_form',
			selectors: {
				'.ec_email': email,
				'.ec_tel': tel
			}
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Ads Enhanced Conversions | CSS Selector"
	heading="Enhanced Conversions: CSS Selector"
	category="Enhanced Conversions"
	badge="CSS Selector"
	badgeColor="yellow"
	description="Renders submitted user fields inside dedicated .ec_email and .ec_tel confirmation elements so Google Tag or GTM DOM Element variables can extract them via CSS selectors."
	tabs={enhancedConversionsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Form retains id="css_selector_form" for GTM Form Submission triggers.',
		'Confirmation alert outputs <span class="ec_email"> and <span class="ec_tel"> immediately on submit.',
		'Verify in Tag Assistant that DOM Element variables resolve non-empty text before firing the conversion tag.'
	]}
>
	<ServiceLeadForm
		formId="css_selector_form"
		showPhone={true}
		showRequirementSelect={true}
		{submitted}
		ecCssSelectorValues={ecValues}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	/>
</DemoPageShell>
