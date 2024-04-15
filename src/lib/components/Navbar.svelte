<script lang="ts">
	let classes_to_remove = [];
	let show_lead_scoring = false; // svelte-ignore missing-declaration
	let show_enhanced_conversions = false; // svelte-ignore missing-declaration
	let lead_scoring_options: null | HTMLDivElement = null;
	let enhanced_conversions_options: null | HTMLDivElement = null;

	function handle_element_transitions_hide(elem: HTMLDivElement) {
		elem.classList.remove('transition');
		elem.classList.remove('ease-out');
		elem.classList.remove('duration-200');
		elem.classList.remove('opacity-100');
		elem.classList.remove('translate-y-0');
		elem.classList.add('hidden');
		elem.classList.add('transition');
		elem.classList.add('ease-in');
		elem.classList.add('duration-150');
		elem.classList.add('opacity-0');
		elem.classList.add('translate-y-1');
	}

	function handle_element_transitions_show(elem: HTMLDivElement) {
		elem.classList.remove('hidden');
		elem.classList.remove('transition');
		elem.classList.remove('ease-in');
		elem.classList.remove('duration-150');
		elem.classList.remove('opacity-0');
		elem.classList.remove('translate-y-1');
		elem.classList.add('transition');
		elem.classList.add('ease-out');
		elem.classList.add('duration-200');
		elem.classList.add('opacity-100');
		elem.classList.add('translate-y-0');
	}
	function toggle_lead_scoring_options() {
		if (show_lead_scoring && lead_scoring_options) {
			handle_element_transitions_hide(lead_scoring_options);
		} else if (!show_lead_scoring && lead_scoring_options) {
			handle_element_transitions_show(lead_scoring_options);
		}
		show_lead_scoring = !show_lead_scoring;
	}

	function toggle_enhanced_conversions_options() {
		if (show_enhanced_conversions && enhanced_conversions_options) {
			handle_element_transitions_hide(enhanced_conversions_options);
		} else if (!show_enhanced_conversions && enhanced_conversions_options) {
			handle_element_transitions_show(enhanced_conversions_options);
		}
		show_enhanced_conversions = !show_enhanced_conversions;
	}
</script>

<header class="bg-white">
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 p-1.5">
				<span class="sr-only">Your Company</span>
				<img
					class="h-8 w-auto"
					src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
					alt=""
				/>
			</a>
		</div>
		<div class="flex lg:hidden">
			<button
				type="button"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			<div class="relative">
				<a
					href="/contact"
					class="text-sm font-semibold leading-6 text-gray-900"
				>
					Contact Us
					<!-- <svg
						class="h-5 w-5 flex-none text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg> -->
				</a>
			</div>

			<a href="/iframe/typeform" class="text-sm font-semibold leading-6 text-gray-900">Iframe</a>

			<div class="relative">
				<button
					type="button"
					class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
					aria-expanded="false"
					on:click={toggle_lead_scoring_options}
				>
					Lead Scoring
					<svg
						class="h-5 w-5 flex-none text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<div
					bind:this={lead_scoring_options}
					class="absolute -left-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5 opacity-0 translate-y-1 hidden"
				>
					<a
						on:click={toggle_lead_scoring_options}
						href="/lead-scoring/google-tag-1"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
						>Google Tag(HTML Predefined Values)</a
					>
					<a
						on:click={toggle_lead_scoring_options}
						href="/lead-scoring/google-tag-2"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
						>Google Tag(Programatic Values)</a
					>
					<a
						on:click={toggle_lead_scoring_options}
						href="/lead-scoring/gtm-1"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
						>GTM(HTML Predefined Values)</a
					>
					<a
						on:click={toggle_lead_scoring_options}
						href="/lead-scoring/gtm-2"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
						>GTM(Programatic Values)</a
					>
				</div>
			</div>
			<!-- EC Section START -->
			<div class="relative">
				<button
					type="button"
					class="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900"
					aria-expanded="false"
					on:click={toggle_enhanced_conversions_options}
				>
					Enhanced Conversions
					<svg
						class="h-5 w-5 flex-none text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<div bind:this={enhanced_conversions_options} class="absolute -left-8 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5 opacity-0 translate-y-1 hidden">
					<a on:click={toggle_enhanced_conversions_options}
						href="/enhanced-conversions/google-tag/prehash"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
						Google Tag(Prehash)
					</a>
					<a on:click={toggle_enhanced_conversions_options}
						href="/enhanced-conversions/gtm/prehash"
						class="block rounded-lg px-3 py-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50">
						GTM(Prehash)
					</a>
				</div>
			</div>
			<!-- EC Section END -->
		</div>
		<div class="hidden lg:flex lg:flex-1 lg:justify-end">
			<a href="/" class="text-sm font-semibold leading-6 text-gray-900"
				>Log in <span aria-hidden="true">&rarr;</span></a
			>
		</div>
	</nav>
	<!-- Mobile menu, show/hide based on menu open state. -->
	<div class="lg:hidden" role="dialog" aria-modal="true">
		<!-- Background backdrop, show/hide based on slide-over state. -->
		<div class="fixed inset-0 z-10" />
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
		>
			<div class="flex items-center justify-between">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Your Company</span>
					<img
						class="h-8 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt=""
					/>
				</a>
				<button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
					<span class="sr-only">Close menu</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/10">
					<div class="space-y-2 py-6">
						<div class="-mx-3">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								aria-controls="disclosure-1"
								aria-expanded="false"
							>
								Product
								<!--
                    Expand/collapse icon, toggle classes based on menu open state.
  
                    Open: "rotate-180", Closed: ""
                  -->
								<svg
									class="h-5 w-5 flex-none"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>

						<a
							href="/iframe/typeform"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Iframe</a
						>
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Marketplace</a
						>

						<div class="-mx-3">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								aria-controls="disclosure-2"
								aria-expanded="false"
							>
								Company
								<!--
                    Expand/collapse icon, toggle classes based on menu open state.
  
                    Open: "rotate-180", Closed: ""
                  -->
								<svg
									class="h-5 w-5 flex-none"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
							<!-- 'Company' sub-menu, show/hide based on menu state. -->
							<div class="mt-2 space-y-2" id="disclosure-2">
								<a
									href="/"
									class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>About us</a
								>
								<a
									href="/"
									class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>Careers</a
								>
								<a
									href="/"
									class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>Support</a
								>
								<a
									href="/"
									class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>Press</a
								>
								<a
									href="/"
									class="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
									>Blog</a
								>
							</div>
						</div>
					</div>
					<div class="py-6">
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Log in</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
