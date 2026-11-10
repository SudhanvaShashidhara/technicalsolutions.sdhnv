<script lang="ts">
	import type { Snippet } from 'svelte';
	import { serviceOptions, serviceRequirementOptions } from '$lib/nav';

	interface Props {
		formId?: string;
		heading?: string;
		subheading?: string;
		showPhone?: boolean;
		showServiceSelect?: boolean;
		showRequirementSelect?: boolean;
		submitLabel?: string;
		submitted?: boolean;
		successMessage?: string;
		successId?: string;
		ecCssSelectorValues?: { email: string; tel: string } | null;
		onSubmit: (formData: FormData, form: HTMLFormElement) => void | Promise<void>;
		onDismiss?: () => void;
		customFields?: Snippet;
	}

	let {
		formId,
		heading = 'Request a service consultation',
		subheading = 'Enter sample lead details to trigger this measurement implementation.',
		showPhone = false,
		showServiceSelect = true,
		showRequirementSelect = false,
		submitLabel = 'Submit lead',
		submitted = false,
		successMessage = 'Form successfully submitted.',
		successId = 'form_success',
		ecCssSelectorValues = null,
		onSubmit,
		onDismiss,
		customFields
	}: Props = $props();

	let submitting = $state(false);

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		submitting = true;
		try {
			await onSubmit(formData, form);
		} finally {
			submitting = false;
		}
	}
</script>

<form id={formId} onsubmit={handleFormSubmit} class="g-card overflow-hidden">
	<div class="border-b border-googlegreyG200 px-6 py-5 sm:px-8 dark:border-googlegreyG800">
		<h2 class="text-base font-medium text-googlegreyG900 dark:text-white">{heading}</h2>
		<p class="mt-1 text-sm text-googlegreyG700 dark:text-googlegreycore">{subheading}</p>
	</div>

	<div class="space-y-5 px-6 py-6 sm:px-8">
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
			<div class={showPhone ? 'sm:col-span-2' : 'sm:col-span-1'}>
				<label for="full-name" class="g-label">Full name</label>
				<input
					type="text"
					required
					name="full-name"
					id="full-name"
					autocomplete="name"
					placeholder="Alex Morgan"
					class="g-input"
				/>
			</div>

			<div class="sm:col-span-1">
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

			{#if showPhone}
				<div class="sm:col-span-1">
					<label for="tel" class="g-label">Phone number</label>
					<input
						id="tel"
						name="tel"
						type="tel"
						required
						autocomplete="tel"
						placeholder="+1 555 234 5678"
						class="g-input"
					/>
				</div>
			{/if}
		</div>

		{#if showServiceSelect || showRequirementSelect}
			<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{#if showServiceSelect}
					<div class={showRequirementSelect ? 'sm:col-span-1' : 'sm:col-span-2'}>
						<label for="service_details" class="g-label">Select your service</label>
						<select id="service_details" name="service_details" class="g-input">
							{#each serviceOptions as opt (opt.value)}
								<option data-lead-value={opt.leadValue} value={opt.value}>
									{opt.label} (${opt.leadValue} value)
								</option>
							{/each}
						</select>
					</div>
				{/if}

				{#if showRequirementSelect}
					<div class="sm:col-span-1">
						<label for="service_requirement" class="g-label">Urgency / timeframe</label>
						<select id="service_requirement" name="service_requirement" class="g-input">
							{#each serviceRequirementOptions as opt (opt.value)}
								<option data-lead-value={opt.leadValue} value={opt.value}>
									{opt.label} (+${opt.leadValue})
								</option>
							{/each}
						</select>
					</div>
				{/if}
			</div>
		{/if}

		{#if customFields}
			{@render customFields()}
		{/if}

		<div>
			<label for="additional_details" class="g-label">Additional details (optional)</label>
			<textarea
				id="additional_details"
				name="additional_details"
				rows="3"
				placeholder="Project scope, preferred contact hours, or notes..."
				class="g-input"
			></textarea>
		</div>
	</div>

	<div
		class="flex flex-wrap items-center justify-between gap-4 border-t border-googlegreyG200 bg-googlegreyG50/70 px-6 py-4 sm:px-8 dark:border-googlegreyG800 dark:bg-googlegreyG900/40"
	>
		<p class="text-xs text-googlegreyG700 dark:text-googlegreycore">
			No real quote is booked; data stays in your browser session.
		</p>
		<button type="submit" disabled={submitting} class="g-btn-primary">
			{submitting ? 'Submitting...' : submitLabel}
		</button>
	</div>

	{#if submitted}
		<div
			class="border-t border-googlegreenG800/20 bg-googlegreenG50 px-6 py-4 sm:px-8 dark:border-googlegreencore/30 dark:bg-googlegreencore/15"
			role="status"
			aria-live="polite"
		>
			<div class="flex items-start gap-3">
				<svg
					class="mt-0.5 h-5 w-5 shrink-0 text-googlegreenG800 dark:text-[#81C995]"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
						clip-rule="evenodd"
					/>
				</svg>
				<div class="min-w-0 flex-1">
					{#if ecCssSelectorValues}
						<p class="text-sm font-medium text-googlegreenG900 dark:text-[#CEEAD6]">
							Thanks for submitting the form. A confirmation email is sent to
							<span class="ec_email font-mono underline">{ecCssSelectorValues.email}</span>. We will
							also be contacting you at
							<span class="ec_tel font-mono underline">{ecCssSelectorValues.tel}</span>.
						</p>
					{:else}
						<p id={successId} class="text-sm font-medium text-googlegreenG900 dark:text-[#CEEAD6]">
							{successMessage}
						</p>
					{/if}
				</div>
				{#if onDismiss}
					<button
						type="button"
						onclick={onDismiss}
						class="rounded-full p-1 text-googlegreenG800 hover:bg-googlegreenG800/10 dark:text-[#81C995] dark:hover:bg-white/10"
						aria-label="Dismiss confirmation"
					>
						<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path
								d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	{/if}
</form>
