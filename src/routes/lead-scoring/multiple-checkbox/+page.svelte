<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '$lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '$lib/nav';
	import { callGtag, pushDataLayer } from '$lib/gtag';

	const interestOptions = [
		{ id: 'coding', value: 'coding', label: 'Coding & Engineering', points: 10 },
		{ id: 'music', value: 'music', label: 'Music Production', points: 5 },
		{ id: 'bike_riding', value: 'bike_riding', label: 'Bike Riding', points: 3 },
		{ id: 'martial_arts', value: 'martial_arts', label: 'Martial Arts', points: 2 }
	] as const;

	const leadValueMap: Record<string, number> = {
		coding: 10,
		music: 5,
		bike_riding: 3,
		martial_arts: 2
	};

	let submitted = $state(false);
	let selectedInterests = $state<string[]>(['coding']);
	let livePayload = $state<Record<string, unknown> | null>(null);

	let previewScore = $derived(
		selectedInterests.reduce((sum, key) => sum + (leadValueMap[key] ?? 0), 0)
	);

	const codeSnippet = `const interests = formData.getAll('interest').map(String);
const leadValue = interests.reduce((sum, key) => sum + (leadValueMap[key] ?? 0), 0);

window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'form_submit_complete',
  form_data: { full_name, email, additional_details, interest: interests },
  lead_value: leadValue
});

gtag('set', 'user_data', { email });
gtag('event', 'lead_scoring_form_submit', {
  value: leadValue,
  interest: interests.join(',')
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const full_name = String(formData.get('full-name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const additional_details = String(formData.get('additional_details') ?? '').trim();
		const interest = formData.getAll('interest').map(String);

		const lead_value = interest.reduce((sum, item) => sum + (leadValueMap[item] ?? 0), 0);
		const form_entered_data = { full_name, email, additional_details, interest };

		const dlPayload = {
			event: 'form_submit_complete',
			form_data: form_entered_data,
			lead_value
		};

		pushDataLayer(dlPayload);
		callGtag('set', 'user_data', { email });
		callGtag('event', 'lead_scoring_form_submit', {
			value: lead_value,
			interest: interest.join(',')
		});

		livePayload = {
			dataLayer_push: dlPayload,
			gtag_event: {
				name: 'lead_scoring_form_submit',
				value: lead_value,
				interest: interest.join(',')
			}
		};
		submitted = true;
		form.reset();
		selectedInterests = [];
	}
</script>

<DemoPageShell
	title="Lead Scoring Demo - Multiple Checkbox Selections (gtag.js)"
	heading="Lead Scoring: Multiple Checkboxes"
	category="Lead Scoring"
	badge="gtag.js"
	badgeColor="blue"
	description="Aggregates qualification points across multiple selected checkbox inputs (name=&quot;interest&quot;) via FormData.getAll('interest') and passes both the numeric total and comma-joined list to Google Tag."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Form retains id="lead_scoring_form_multiple_checkbox" and checkbox name="interest".',
		'Fixes serialization of selected checkboxes using interest.join(",") instead of an uninvoked toString reference.',
		'Live score badge updates reactively as you toggle interest checkboxes.'
	]}
>
	<ServiceLeadForm
		formId="lead_scoring_form_multiple_checkbox"
		heading="Multi-interest lead qualification"
		subheading="Select one or more interests below to accumulate a composite lead value."
		showServiceSelect={false}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	>
		{#snippet customFields()}
			<fieldset>
				<div class="flex items-center justify-between">
					<legend class="text-sm font-medium text-googlegreyG800 dark:text-googlegreyG200">
						Choose your interests
					</legend>
					<span class="g-chip-blue">Current score: {previewScore} pts</span>
				</div>

				<div class="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
					{#each interestOptions as opt (opt.id)}
						{@const checked = selectedInterests.includes(opt.value)}
						<label
							for={opt.id}
							class="flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors {checked
								? 'border-googleblue600 bg-googleblueG50/60 dark:border-googleblue300 dark:bg-googleblue300/10'
								: 'border-googlegreyG300 bg-white hover:bg-googlegreyG50 dark:border-googlegreyG700 dark:bg-googlegreyG900 dark:hover:bg-googledarktonal'}"
						>
							<span class="flex items-center gap-3">
								<input
									id={opt.id}
									value={opt.value}
									name="interest"
									type="checkbox"
									bind:group={selectedInterests}
									class="h-4 w-4 rounded border-googlegreyG600 text-googleblue600 focus:ring-googleblue600 dark:border-googlegreycore dark:bg-googlegreyG900 dark:text-googleblue300"
								/>
								<span class="text-sm font-medium text-googlegreyG900 dark:text-googlegreyG200">
									{opt.label}
								</span>
							</span>
							<span class="g-chip-neutral">+{opt.points}</span>
						</label>
					{/each}
				</div>
			</fieldset>
		{/snippet}
	</ServiceLeadForm>
</DemoPageShell>
