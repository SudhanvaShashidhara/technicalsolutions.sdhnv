<svelte:head>
	<title>Booking Confirmed | Calendly Demo</title>
	<meta
		name="description"
		content="Confirmation landing page target for Calendly redirect conversion tracking."
	/>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
	<div class="g-card p-8 text-center sm:p-10">
		<div
			class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-googlegreenG50 text-googlegreenG800 dark:bg-googlegreencore/20 dark:text-[#81C995]"
		>
			<svg class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>

		<h1 class="mt-5 text-2xl font-normal tracking-tight text-googlegreyG900 dark:text-white">
			Thanks for scheduling a session
		</h1>
		<p class="mt-2 text-sm leading-6 text-googlegreyG700 dark:text-googlegreycore">
			This destination route (<code class="font-mono">/iframe/calendly/confirmation</code>) serves
			as a page-view conversion target when Calendly is configured to redirect invitees after
			booking.
		</p>

		<div class="mt-8 flex flex-wrap justify-center gap-3">
			<a href="/iframe/calendly" class="g-btn-secondary">Back to Calendly embed</a>
			<a href="/" class="g-btn-primary">All demos</a>
		</div>
	</div>
</div>
