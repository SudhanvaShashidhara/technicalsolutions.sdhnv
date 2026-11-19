<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { serviceOptions, serviceRequirementOptions } from '#lib/nav.ts';
	import {
		recordClientSubmission,
		serializeFormData,
		type ArchiveSubmissionResponse
	} from '#lib/submissions.ts';

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
		heading = 'Demo form',
		subheading = '',
		showPhone = false,
		showServiceSelect = true,
		showRequirementSelect = false,
		submitLabel = 'Submit',
		submitted = false,
		successMessage = 'Submission recorded.',
		successId = 'form_success',
		ecCssSelectorValues = null,
		onSubmit,
		onDismiss,
		customFields
	}: Props = $props();

	let submitting = $state(false);
	let archiveStatus = $state<ArchiveSubmissionResponse | null>(null);

	function extractLeadScore(form: HTMLFormElement): number | null {
		let total = 0;
		let found = false;
		const selects = form.querySelectorAll<HTMLSelectElement>('select');
		for (const select of selects) {
			const opt = select.selectedOptions[0];
			const val = opt?.dataset.leadValue ? Number(opt.dataset.leadValue) : NaN;
			if (!Number.isNaN(val)) {
				total += val;
				found = true;
			}
		}
		return found ? total : null;
	}

	async function handleFormSubmit(e: SubmitEvent) {
		e.preventDefault();
		const form = e.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		const fields = serializeFormData(formData);
		const score = extractLeadScore(form);

		submitting = true;
		archiveStatus = null;
		try {
			await onSubmit(formData, form);
			archiveStatus = await recordClientSubmission({
				route: page.url.pathname,
				formId: formId ?? null,
				source: 'form',
				fields,
				score
			});
		} finally {
			submitting = false;
		}
	}
</script>

<form id={formId} onsubmit={handleFormSubmit} class="ed-card overflow-hidden">
	<div class="border-b border-line px-5 py-4 sm:px-6 dark:border-line-dark">
		<h2 class="text-sm font-semibold text-ink dark:text-ink-dark">{heading}</h2>
		{#if subheading}
			<p class="mt-0.5 text-xs text-muted dark:text-muted-dark">{subheading}</p>
		{/if}
	</div>

	<div class="space-y-4 px-5 py-5 sm:px-6">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class={showPhone ? 'sm:col-span-2' : 'sm:col-span-1'}>
				<label for="full-name" class="ed-label">Full name</label>
				<input
					type="text"
					required
					aria-required="true"
					name="full-name"
					id="full-name"
					autocomplete="name"
					placeholder="Alex Morgan"
					class="ed-input"
				/>
			</div>

			<div class="sm:col-span-1">
				<label for="email" class="ed-label">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					aria-required="true"
					autocomplete="email"
					placeholder="alex.morgan@gmail.com"
					class="ed-input"
				/>
			</div>

			{#if showPhone}
				<div class="sm:col-span-1">
					<label for="tel" class="ed-label">Phone</label>
					<input
						id="tel"
						name="tel"
						type="tel"
						required
						aria-required="true"
						autocomplete="tel"
						placeholder="+1 555 234 5678"
						class="ed-input"
					/>
				</div>
			{/if}
		</div>

		{#if showServiceSelect || showRequirementSelect}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#if showServiceSelect}
					<div class={showRequirementSelect ? 'sm:col-span-1' : 'sm:col-span-2'}>
						<label for="service_details" class="ed-label">Service</label>
						<select id="service_details" name="service_details" class="ed-input">
							{#each serviceOptions as opt (opt.value)}
								<option data-lead-value={opt.leadValue} value={opt.value}>
									{opt.label} (${opt.leadValue})
								</option>
							{/each}
						</select>
					</div>
				{/if}

				{#if showRequirementSelect}
					<div class="sm:col-span-1">
						<label for="service_requirement" class="ed-label">Timeframe</label>
						<select id="service_requirement" name="service_requirement" class="ed-input">
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
			<label for="additional_details" class="ed-label">Notes (optional)</label>
			<textarea
				id="additional_details"
				name="additional_details"
				rows="2"
				placeholder="Optional context..."
				class="ed-input"></textarea>
		</div>
	</div>

	<div
		class="flex items-center justify-end border-t border-line bg-subtle/50 px-5 py-3.5 sm:px-6 dark:border-line-dark dark:bg-canvas-dark/40"
	>
		<button type="submit" disabled={submitting} class="ed-btn-primary">
			{submitting ? 'Submitting...' : submitLabel}
		</button>
	</div>

	{#if submitted}
		<div class="ed-status-ok px-5 py-3.5 sm:px-6" role="status" aria-live="polite">
			<div class="flex items-start justify-between gap-3">
				<div class="min-w-0 flex-1 space-y-1">
					{#if ecCssSelectorValues}
						<p class="text-sm font-medium">
							Confirmation sent to
							<span class="ec_email font-mono underline">{ecCssSelectorValues.email}</span>
							and
							<span class="ec_tel font-mono underline">{ecCssSelectorValues.tel}</span>.
						</p>
					{:else}
						<p id={successId} class="text-sm font-medium">{successMessage}</p>
					{/if}
					{#if archiveStatus?.saved && archiveStatus.id}
						<p class="font-mono text-[11px] opacity-80">
							Firestore ID: {archiveStatus.id}
						</p>
					{/if}
				</div>
				{#if onDismiss}
					<button
						type="button"
						onclick={onDismiss}
						class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"
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
