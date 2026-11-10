<script lang="ts">
	import DemoPageShell from '$lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '$lib/nav';
	import { callGtag, pushDataLayer } from '$lib/gtag';

	let submitting = $state(false);
	let errorMessage = $state('');
	let hashResult = $state<Record<string, string | null> | null>(null);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `// Server-verified normalization & SHA-256 hashing (/api/ec-sha-tester or POST /api/contact-form)
const params = new URLSearchParams({ email, phone });
const res = await fetch(\`/api/ec-sha-tester?\${params.toString()}\`);
const data = await res.json();

gtag('set', 'user_data', {
  sha256_email_address: data.email_hash2,
  sha256_phone_number: data.phone_hash2
});`;

	async function handleContactSubmit(e: SubmitEvent) {
		e.preventDefault();
		errorMessage = '';
		submitting = true;

		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const email = String(formData.get('email') ?? '').trim();
		const phone = String(formData.get('phone') ?? '').trim();
		const firstName = String(formData.get('first-name') ?? '').trim();
		const lastName = String(formData.get('last-name') ?? '').trim();
		const country = String(formData.get('country') ?? '').trim();

		try {
			const res = await fetch('/api/contact-form', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					phone,
					country
				})
			});

			const data = (await res.json()) as Record<string, string | null>;
			if (!res.ok) {
				errorMessage = String(data.error ?? 'Failed to validate contact details.');
				return;
			}

			hashResult = data;

			const userData: Record<string, string> = {};
			if (data.email_hash2) userData.sha256_email_address = data.email_hash2;
			if (data.phone_hash2) userData.sha256_phone_number = data.phone_hash2;

			callGtag('set', 'user_data', userData);
			pushDataLayer({
				event: 'contact_form_submit',
				sha256_email_address: data.email_hash2,
				email_hash_base64url: data.email_hash,
				sha256_phone_number: data.phone_hash2
			});

			livePayload = {
				event: 'contact_form_submit',
				normalized: {
					email: data.normalized_email,
					phone: data.normalised_phone
				},
				sha256_hex: {
					email: data.email_hash2,
					phone: data.phone_hash2
				},
				sha256_base64url: {
					email: data.email_hash,
					phone: data.phone_hash
				}
			};
		} catch {
			errorMessage = 'Network error while contacting /api/contact-form.';
		} finally {
			submitting = false;
		}
	}

	function resetForm(e: MouseEvent) {
		const form = (e.currentTarget as HTMLButtonElement).form;
		form?.reset();
		errorMessage = '';
		hashResult = null;
		livePayload = null;
	}
</script>

<DemoPageShell
	title="Contact & Enhanced Conversions SHA-256 Verifier"
	heading="Contact & SHA-256 Hash Verifier"
	category="Tools & Embeds"
	badge="API Verifier"
	badgeColor="green"
	description="Validates Google Ads Enhanced Conversions normalization rules (Gmail dot removal vs custom domains, E.164 phone formatting) via the server API and returns both hexadecimal and base64url SHA-256 digests."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Try "alex.morgan@gmail.com" vs "alex.morgan@company.com": dots are stripped only on gmail.com / googlemail.com.',
		'Properly URL-encodes "+" aliases (e.g. alex+ads@gmail.com) so plus signs are not corrupted into spaces.',
		'Outputs both lowercase hex (Google Ads Enhanced Conversions standard) and base64url digests.'
	]}
>
	<form onsubmit={handleContactSubmit} class="g-card overflow-hidden">
		<div class="border-b border-googlegreyG200 px-6 py-5 sm:px-8 dark:border-googlegreyG800">
			<h2 class="text-base font-medium text-googlegreyG900 dark:text-white">
				Lead details &amp; hash generator
			</h2>
			<p class="mt-1 text-sm text-googlegreyG700 dark:text-googlegreycore">
				Submit an email and optional phone number to verify server-side normalization.
			</p>
		</div>

		<div class="space-y-5 px-6 py-6 sm:px-8">
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="first-name" class="g-label">First name</label>
					<input
						type="text"
						name="first-name"
						id="first-name"
						autocomplete="given-name"
						placeholder="Alex"
						class="g-input"
					/>
				</div>

				<div>
					<label for="last-name" class="g-label">Last name</label>
					<input
						type="text"
						name="last-name"
						id="last-name"
						autocomplete="family-name"
						placeholder="Morgan"
						class="g-input"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				<div>
					<label for="email" class="g-label">Email address</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autocomplete="email"
						placeholder="alex.morgan@gmail.com"
						class="g-input"
					/>
				</div>

				<div>
					<label for="phone" class="g-label">Phone number (optional, E.164)</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						autocomplete="tel"
						placeholder="+1 555 234 5678"
						class="g-input"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div>
					<label for="country" class="g-label">Country</label>
					<select id="country" name="country" autocomplete="country-name" class="g-input">
						<option value="India">India</option>
						<option value="United States">United States</option>
						<option value="Poland">Poland</option>
						<option value="Brazil">Brazil</option>
					</select>
				</div>

				<div>
					<label for="city" class="g-label">City</label>
					<input
						type="text"
						name="city"
						id="city"
						autocomplete="address-level2"
						placeholder="Bengaluru"
						class="g-input"
					/>
				</div>

				<div>
					<label for="postal-code" class="g-label">Postal code</label>
					<input
						type="text"
						name="postal-code"
						id="postal-code"
						autocomplete="postal-code"
						placeholder="560001"
						class="g-input"
					/>
				</div>
			</div>
		</div>

		<div
			class="flex flex-wrap items-center justify-end gap-3 border-t border-googlegreyG200 bg-googlegreyG50/70 px-6 py-4 sm:px-8 dark:border-googlegreyG800 dark:bg-googlegreyG900/40"
		>
			<button type="button" onclick={resetForm} class="g-btn-secondary">Reset</button>
			<button type="submit" disabled={submitting} class="g-btn-primary">
				{submitting ? 'Computing SHA-256...' : 'Verify & Hash'}
			</button>
		</div>

		{#if errorMessage}
			<div
				class="border-t border-googleredG800/20 bg-googleredG50 px-6 py-4 text-sm font-medium text-googleredG900 sm:px-8 dark:border-googleredcore/30 dark:bg-googleredcore/15 dark:text-[#F28B82]"
				role="alert"
			>
				{errorMessage}
			</div>
		{/if}

		{#if hashResult}
			<div
				class="space-y-2 border-t border-googlegreenG800/20 bg-googlegreenG50 px-6 py-4 text-xs sm:px-8 dark:border-googlegreencore/30 dark:bg-googlegreencore/15"
				role="status"
			>
				<p class="text-sm font-medium text-googlegreenG900 dark:text-[#CEEAD6]">
					Normalized email: <code class="font-mono">{hashResult.normalized_email}</code>
				</p>
				<p class="break-all font-mono text-googlegreenG800 dark:text-[#81C995]">
					SHA-256 (hex): {hashResult.email_hash2}
				</p>
				{#if hashResult.normalised_phone && hashResult.phone_hash2}
					<p class="pt-1 text-sm font-medium text-googlegreenG900 dark:text-[#CEEAD6]">
						Normalized phone: <code class="font-mono">{hashResult.normalised_phone}</code>
					</p>
					<p class="break-all font-mono text-googlegreenG800 dark:text-[#81C995]">
						SHA-256 (hex): {hashResult.phone_hash2}
					</p>
				{/if}
			</div>
		{/if}
	</form>
</DemoPageShell>
