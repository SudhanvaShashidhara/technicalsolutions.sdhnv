<svelte:head>
	<title>Booking Confirmed | Calendly Demo</title>
	<meta
		name="description"
		content="Confirmation target page for Calendly redirect conversion tracking."
	/>
</svelte:head>

<div class="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-24">
	<div class="ed-card p-8 text-center sm:p-10">
		<div
			class="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-status-ok-bg text-status-ok-text dark:bg-emerald-950/60 dark:text-emerald-300"
		>
			<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>

		<h1 class="mt-4 text-2xl font-semibold tracking-tight text-ink dark:text-ink-dark">
			Booking confirmed
		</h1>
		<p class="mt-2 text-sm text-muted dark:text-muted-dark">
			Redirect target route (<code class="font-mono">/iframe/calendly/confirmation</code>) for
			page-view conversion triggers.
		</p>

		<div class="mt-7 flex flex-wrap justify-center gap-2.5">
			<a href="/iframe/calendly" class="ed-btn-secondary">Back to Calendly</a>
			<a href="/" class="ed-btn-primary">All demos</a>
		</div>
	</div>
</div>
