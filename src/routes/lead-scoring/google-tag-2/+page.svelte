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
	heading="Lead Scoring: Google Tag (Programmatic)"
	category="Lead Scoring"
	badge="gtag.js"
	badgeColor="blue"
	description="Calculates lead qualification value in JavaScript lookup maps from annual income and address tenure, keeping scoring logic decoupled from HTML attributes."
	tabs={leadScoringLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Computes total lead value in JS (income bracket + years at current address) rather than DOM attributes.',
		'Dispatches gtag("event", "conversion", ...) with the computed numeric value in USD.',
		'Recommended when you do not want competitors inspecting qualification weights in HTML markup.'
	]}
>
	<ServiceLeadForm
		heading="Financial qualification demo"
		subheading="Select income band and address tenure to compute a programmatic lead score."
		showServiceSelect={false}
		{submitted}
		onSubmit={handleSubmit}
		onDismiss={() => (submitted = false)}
	>
		{#snippet customFields()}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="income" class="g-label">Annual income (USD)</label>
					<select id="income" name="income" class="g-input">
						<option value="<$30,000">&lt;$30,000</option>
						<option value="$30,000 - $45,000">$30,000 &ndash; $45,000</option>
						<option value="$45,000 - $65,000">$45,000 &ndash; $65,000</option>
						<option value="$65,000 - $85,000">$65,000 &ndash; $85,000</option>
						<option value="$85,000 - $100,000">$85,000 &ndash; $100,000</option>
						<option value="$100,000+">$100,000+</option>
					</select>
				</div>

				<div>
					<label for="years_at_address" class="g-label">Years at current address</label>
					<select id="years_at_address" name="years_at_address" class="g-input">
						<option value="3">3 years</option>
						<option value="4">4 years</option>
						<option value="5">5+ years</option>
					</select>
				</div>
			</div>
		{/snippet}
	</ServiceLeadForm>
</DemoPageShell>
