<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import ServiceLeadForm from '#lib/components/ServiceLeadForm.svelte';
	import { enhancedConversionsLinks } from '#lib/nav.ts';
	import { normalizeEmail, normalizePhone, sha256Hex } from '#lib/ec-hash.ts';
	import { callGtag, pushDataLayer } from '#lib/gtag.ts';

	let submitted = $state(false);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// 1. Normalize per Google Ads spec (lowercase, trim, strip dots on Gmail only, E.164 phone)
const normalizedEmail = normalizeEmail(rawEmail); // e.g. "alexmorgan@gmail.com"
const normalizedPhone = normalizePhone(rawPhone); // e.g. "+15552345678"

// 2. Compute lowercase hex SHA-256 digests via Web Crypto API
const sha256_email_address = await sha256Hex(normalizedEmail);
const sha256_phone_number = await sha256Hex(normalizedPhone);

// 3. Pass pre-hashed fields to Google Tag & dataLayer
window.enhanced_conversion_data = { sha256_email_address, sha256_phone_number };
gtag('set', 'user_data', { sha256_email_address, sha256_phone_number });`;

	async function handleSubmit(formData: FormData, form: HTMLFormElement) {
		const rawEmail = String(formData.get('email') ?? '');
		const rawTel = String(formData.get('tel') ?? '');

		const normalizedEmail = normalizeEmail(rawEmail) ?? rawEmail.trim().toLowerCase();
		const normalizedPhone = normalizePhone(rawTel) ?? rawTel.trim();

		const [sha256_email_address, sha256_phone_number] = await Promise.all([
			sha256Hex(normalizedEmail),
			sha256Hex(normalizedPhone)
		]);

		const hashedData = { sha256_email_address, sha256_phone_number };
		window.enhanced_conversion_data = hashedData;
		callGtag('set', 'user_data', hashedData);
		pushDataLayer({
			event: 'ec_prehash_submit',
			...hashedData
		});

		livePayload = {
			event: 'ec_prehash_submit',
			normalized_inputs: {
				email: normalizedEmail,
				phone_number: normalizedPhone
			},
			user_data: hashedData
		};
		submitted = true;
		form.reset();
	}
</script>

<DemoPageShell
	title="Ads Enhanced Conversions | Pre Hashed Data"
	heading="Enhanced Conversions: Pre-hashed (SHA-256)"
	category="Enhanced Conversions"
	badge="SHA-256 Hex"
	badgeColor="red"
	description="Normalizes email and E.164 phone inputs in the browser and computes 64-character lowercase hexadecimal SHA-256 digests before passing sha256_email_address and sha256_phone_number to Google Tag."
	tabs={enhancedConversionsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Strips dots in the local part ONLY for gmail.com and googlemail.com domains per Google Ads spec.',
		'Uses sha256_email_address and sha256_phone_number keys so Google Tag does not double-hash the digests.',
		'Compare client-side digests against the server-side /contact SHA-256 verifier.'
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
