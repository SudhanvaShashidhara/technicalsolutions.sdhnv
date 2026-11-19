<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '#lib/nav.ts';
	import { callGtag, pushDataLayer } from '#lib/gtag.ts';

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
	heading="Lead Scoring: Multi-Checkbox"
	category="Lead Scoring"
	badge="gtag.js"
	description="Sums selected checkbox values and sends the total and list to Google Tag."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Preserves #lead_scoring_form_multiple_checkbox and name="interest".',
		'Serializes selections via interest.join(",").'
	]}
>
	<ServiceLeadForm
		formId="lead_scoring_form_multiple_checkbox"
		heading="Select interests"
		showServiceSelect={false}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	>
		{#snippet customFields()}
			<fieldset>
				<legend class="ed-label flex w-full items-center justify-between">
					<span>Interests</span>
					<span class="ed-tag-accent">{previewScore} pts</span>
				</legend>

				<div class="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
					{#each interestOptions as opt (opt.id)}
						{@const checked = selectedInterests.includes(opt.value)}
						<label
							for={opt.id}
							class="flex min-h-[44px] cursor-pointer items-center justify-between rounded-lg border px-3.5 py-2.5 transition-colors {checked
								? 'border-cobalt bg-cobalt-soft/70 dark:border-cobalt-dark dark:bg-cobalt-dark/15'
								: 'border-line-strong bg-surface hover:border-ink/40 dark:border-line-dark-strong dark:bg-canvas-dark dark:hover:border-ink-dark/40'}"
						>
							<span class="flex items-center gap-2.5">
								<input
									id={opt.id}
									value={opt.value}
									name="interest"
									type="checkbox"
									bind:group={selectedInterests}
									class="h-4 w-4 rounded border-line-strong text-cobalt focus:ring-cobalt dark:border-line-dark-strong dark:bg-canvas-dark dark:text-cobalt-dark"
								/>
								<span class="text-sm font-medium text-ink dark:text-ink-dark">
									{opt.label}
								</span>
							</span>
							<span class="ed-tag">+{opt.points}</span>
						</label>
					{/each}
				</div>
			</fieldset>
		{/snippet}
	</ServiceLeadForm>
</DemoPageShell>
