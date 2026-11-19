<script lang="ts">
	import DemoPageShell from '#lib/components/DemoPageShell.svelte';
	import { toolsLinks } from '#lib/nav.ts';
	import { callGtag, pushDataLayer } from '#lib/gtag.ts';

	interface ContactApiResult {
		normalized_email?: string;
		email_hash?: string;
		email_hash_base64?: string;
		email_hash2?: string;
		normalised_phone?: string | null;
		phone_hash?: string | null;
		phone_hash_base64?: string | null;
		phone_hash2?: string | null;
		submission?: {
			saved: boolean;
			storage: string;
			id: string | null;
		};
		error?: string;
	}

	let submitting = $state(false);
	let errorMessage = $state('');
	let hashResult = $state<ContactApiResult | null>(null);
	let livePayload = $state<Record<string, unknown> | null>(null);

	const codeSnippet = `const res = await fetch('/api/contact-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, phone })
});
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
		const city = String(formData.get('city') ?? '').trim();
		const postalCode = String(formData.get('postal-code') ?? '').trim();

		try {
			const res = await fetch('/api/contact-form', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					phone,
					country,
					city,
					postalCode
				})
			});

			const data = (await res.json()) as ContactApiResult;
			if (!res.ok) {
				errorMessage = data.error ?? 'Failed to validate contact details.';
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
				email_hash_base64: data.email_hash_base64,
				email_hash_base64url: data.email_hash,
				sha256_phone_number: data.phone_hash2,
				phone_hash_base64: data.phone_hash_base64,
				phone_hash_base64url: data.phone_hash
			});

			livePayload = {
				event: 'contact_form_submit',
				normalized: {
					email: data.normalized_email,
					phone: data.normalised_phone ?? null
				},
				sha256_hex: {
					email: data.email_hash2,
					phone: data.phone_hash2 ?? null
				},
				sha256_base64: {
					email: data.email_hash_base64,
					phone: data.phone_hash_base64 ?? null
				},
				sha256_base64url: {
					email: data.email_hash,
					phone: data.phone_hash ?? null
				},
				storage: data.submission ?? null
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
	heading="SHA-256 Verifier"
	category="Tools & Embeds"
	badge="API"
	description="Verify Google Ads normalization and inspect hex, Base64, and Base64URL SHA-256 digests."
	tabs={toolsLinks}
	{codeSnippet}
	{livePayload}
	inspectorNotes={[
		'Strips dots only on gmail.com / googlemail.com.',
		'Preserves "+" aliases in email addresses.',
		'Outputs hex, RFC 4648 Base64, and Google Tag Base64URL.'
	]}
>
	<form onsubmit={handleContactSubmit} class="ed-card overflow-hidden" novalidate={false}>
		<div class="border-b border-line px-5 py-4 sm:px-6 dark:border-line-dark">
			<h2 class="text-sm font-semibold text-ink dark:text-ink-dark">Contact &amp; hash check</h2>
		</div>

		<div class="space-y-4 px-5 py-5 sm:px-6">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="first-name" class="ed-label">First name</label>
					<input
						type="text"
						name="first-name"
						id="first-name"
						autocomplete="given-name"
						placeholder="Alex"
						class="ed-input"
					/>
				</div>

				<div>
					<label for="last-name" class="ed-label">Last name</label>
					<input
						type="text"
						name="last-name"
						id="last-name"
						autocomplete="family-name"
						placeholder="Morgan"
						class="ed-input"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="email" class="ed-label">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						aria-required="true"
						aria-invalid={errorMessage ? 'true' : undefined}
						aria-describedby={errorMessage ? 'contact-error' : undefined}
						autocomplete="email"
						placeholder="alex.morgan@gmail.com"
						class="ed-input"
					/>
				</div>

				<div>
					<label for="phone" class="ed-label">Phone (optional, E.164)</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						autocomplete="tel"
						placeholder="+1 555 234 5678"
						class="ed-input"
					/>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div>
					<label for="country" class="ed-label">Country</label>
					<select id="country" name="country" autocomplete="country-name" class="ed-input">
						<option value="India">India</option>
						<option value="United States">United States</option>
						<option value="Poland">Poland</option>
						<option value="Brazil">Brazil</option>
					</select>
				</div>

				<div>
					<label for="city" class="ed-label">City</label>
					<input
						type="text"
						name="city"
						id="city"
						autocomplete="address-level2"
						placeholder="Bengaluru"
						class="ed-input"
					/>
				</div>

				<div>
					<label for="postal-code" class="ed-label">Postal code</label>
					<input
						type="text"
						name="postal-code"
						id="postal-code"
						autocomplete="postal-code"
						placeholder="560001"
						class="ed-input"
					/>
				</div>
			</div>
		</div>

		<div
			class="flex flex-wrap items-center justify-end gap-2.5 border-t border-line bg-subtle/50 px-5 py-3.5 sm:px-6 dark:border-line-dark dark:bg-canvas-dark/40"
		>
			<button type="button" onclick={resetForm} class="ed-btn-secondary">Reset</button>
			<button type="submit" disabled={submitting} class="ed-btn-primary">
				{submitting ? 'Hashing...' : 'Verify & Hash'}
			</button>
		</div>

		{#if errorMessage}
			<div
				id="contact-error"
				class="ed-status-err px-5 py-3.5 text-sm font-medium sm:px-6"
				role="alert"
			>
				{errorMessage}
			</div>
		{/if}

		{#if hashResult}
			<div
				class="ed-status-ok space-y-4 px-5 py-4 text-xs sm:px-6"
				role="status"
				aria-live="polite"
			>
				<div class="space-y-1.5">
					<p class="text-sm font-medium">
						Email: <code class="font-mono">{hashResult.normalized_email}</code>
					</p>
					<div class="space-y-1 break-all font-mono">
						<p>
							<span class="font-sans font-medium">SHA-256 (hex):</span>
							{hashResult.email_hash2}
						</p>
						<p>
							<span class="font-sans font-medium">SHA-256 (base64):</span>
							{hashResult.email_hash_base64}
						</p>
						<p>
							<span class="font-sans font-medium">SHA-256 (base64url):</span>
							{hashResult.email_hash}
						</p>
					</div>
				</div>

				{#if hashResult.normalised_phone && hashResult.phone_hash2}
					<div class="space-y-1.5 border-t border-current/15 pt-3">
						<p class="text-sm font-medium">
							Phone: <code class="font-mono">{hashResult.normalised_phone}</code>
						</p>
						<div class="space-y-1 break-all font-mono">
							<p>
								<span class="font-sans font-medium">SHA-256 (hex):</span>
								{hashResult.phone_hash2}
							</p>
							<p>
								<span class="font-sans font-medium">SHA-256 (base64):</span>
								{hashResult.phone_hash_base64}
							</p>
							<p>
								<span class="font-sans font-medium">SHA-256 (base64url):</span>
								{hashResult.phone_hash}
							</p>
						</div>
					</div>
				{/if}

				{#if hashResult.submission?.saved && hashResult.submission.id}
					<p class="font-mono text-[11px] opacity-80">
						Firestore ID: {hashResult.submission.id}
					</p>
				{/if}
			</div>
		{/if}
	</form>
</DemoPageShell>
