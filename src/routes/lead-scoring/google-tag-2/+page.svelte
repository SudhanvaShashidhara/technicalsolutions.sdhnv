<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { leadScoringLinks } from '#lib/nav.ts';
	import { callGtag } from '#lib/gtag.ts';

	const incomeScores: Record<string, number> = {
		'<$30,000': 10,
		'$30,000 - $45,000': 20,
		'$45,000 - $65,000': 30,
		'$65,000 - $85,000': 40,
		'$85,000 - $100,000': 50,
		'$100,000+': 60
	};

	const tenureScores: Record<string, number> = {
		'3': 10,
		'4': 20,
		'5': 30
	};

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Compute score programmatically in JavaScript (keeps scoring rules out of DOM markup)
const incomeScores = { '<$30,000': 10, '$30,000 - $45,000': 20, /* ... */ '$100,000+': 60 };
const tenureScores = { '3': 10, '4': 20, '5': 30 };

const leadScore = (incomeScores[income] ?? 0) + (tenureScores[yearsAtAddress] ?? 0);

gtag('event', 'conversion', {
  send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
  value: leadScore,
  currency: 'USD'
});`;

	function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const full_name = String(formData.get('full-name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const income = String(formData.get('income') ?? '');
		const years_at_address = String(formData.get('years_at_address') ?? '');
		const additional_details = String(formData.get('additional_details') ?? '').trim();

		const incomeValue = incomeScores[income] ?? 0;
		const tenureValue = tenureScores[years_at_address] ?? 0;
		const value = incomeValue + tenureValue;

		const conversionParams = {
			send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
			value,
			currency: 'USD'
		};

		callGtag('event', 'conversion', conversionParams);

		livePayload = {
			gtag_command: ['event', 'conversion', conversionParams],
			score_breakdown: {
				income_score: incomeValue,
				tenure_score: tenureValue,
				total_value: value
			},
			form_entered_data: { full_name, email, income, years_at_address, additional_details }
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Lead Scoring Demo - Google Tag (Programmatic Values)"
	heading="Lead Scoring: Programmatic"
	category="Lead Scoring"
	badge="gtag.js"
	description="Computes lead score in JavaScript lookup maps without exposing weights in HTML."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Sums income bracket and address tenure scores in JS.',
		'Dispatches gtag("event", "conversion", ...) in USD.'
	]}
>
	<ServiceLeadForm
		heading="Financial qualification"
		showServiceSelect={false}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	>
		{#snippet customFields()}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="income" class="ed-label">Annual income (USD)</label>
					<select id="income" name="income" class="ed-input">
						<option value="<$30,000">&lt;$30,000</option>
						<option value="$30,000 - $45,000">$30,000 &ndash; $45,000</option>
						<option value="$45,000 - $65,000">$45,000 &ndash; $65,000</option>
						<option value="$65,000 - $85,000">$65,000 &ndash; $85,000</option>
						<option value="$85,000 - $100,000">$85,000 &ndash; $100,000</option>
						<option value="$100,000+">$100,000+</option>
					</select>
				</div>

				<div>
					<label for="years_at_address" class="ed-label">Years at address</label>
					<select id="years_at_address" name="years_at_address" class="ed-input">
						<option value="3">3 years</option>
						<option value="4">4 years</option>
						<option value="5">5+ years</option>
					</select>
				</div>
			</div>
		{/snippet}
	</ServiceLeadForm>
</DemoPageShell>
