<script lang="ts">
	let form_submitted = false;
	function handle_submit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const form_data = new FormData(form);
		const full_name = form_data.get('full-name');
		const email = form_data.get('email');
		const income = form_data.get('income');
		const years_at_address = form_data.get('years_at_address');
		const about = form_data.get('about');
		const form_entered_data = { full_name, email, income, about, years_at_address };

		const income_val : any = document
				.querySelector(`option[value="${form_entered_data.income}"]`)
				?.getAttribute('data-lead-value');
				const years_at_address_val: any = years_at_address;
				const total__lead_value = parseInt(income_val) + parseInt(years_at_address_val);
		window.gtag('event', 'conversion', {
			send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
			value: total__lead_value,
			currency: 'USD'
		});
		form_submitted = true;
		form.reset();
	}
</script>

<svelte:head>
	<title>Lead Scoring Demo - Google Tag (Using predefined values in HTML Template)</title>
</svelte:head>
<h2 class="w-10/12 lg:w-6/12 mx-auto text-3xl text-center mt-4">
	Lead Scoring Demo - Google Tag [1]
</h2>
<form
	on:submit|preventDefault={handle_submit}
	class="w-11/12 lg:w-8/12 p-4 lg:py-10 m-auto border-b border-gray-900/10 pb-12"
>
	<div class="space-y-12">
		<div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
			<div>
				<h2 class="text-base font-semibold leading-7 text-gray-900">Contact Us</h2>
				<p class="mt-1 text-sm leading-6 text-gray-600">
					Use a permanent address where you can receive mail.
				</p>
			</div>

			<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
				<div class="col-start-2 sm:col-span-7">
					<label for="full-name" class="block text-sm font-medium leading-6 text-gray-900"
						>Full name</label
					>
					<div class="mt-2">
						<input
							type="text"
							required
							name="full-name"
							id="full-name"
							autocomplete="given-name"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							required
							autocomplete="email"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="income" class="block text-sm font-medium leading-6 text-gray-900"
						>Income ($ PA)</label
					>
					<div class="mt-2">
						<select
							id="income"
							name="income"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						>
							<option data-lead-value="10" value="<$30,000">&lt;$30,000</option>
							<option data-lead-value="20" value="$30,000 - $45,000">$30,000 - $45,000</option>
							<option data-lead-value="30" value="$45,000 - $65,000">$45,000 - $65,000</option>
							<option data-lead-value="40" value="$65,000 - $85,000">$65,000 - $85,000</option>
							<option data-lead-value="50" value="$85,000 - $100,000">$85,000 - $100,000</option>
							<option data-lead-value="60" value="$100,000+">$100,000+</option>
						</select>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="years_at_address" class="block text-sm font-medium leading-6 text-gray-900"
						>No of years at current address</label
					>
					<div class="mt-2">
						<select
							id="years_at_address"
							name="years_at_address"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						>
							<option data-lead-value="10" value="3">3</option>
							<option data-lead-value="20" value="4">4</option>
							<option data-lead-value="20" value="5">5</option>
						</select>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="about" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
						>Address</label
					>
					<div class="mt-2 sm:col-span-2 sm:mt-0">
						<textarea
							id="about"
							name="about"
							rows="3"
							class="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
						<p class="mt-3 text-sm leading-6 text-gray-600">
							Write a few sentences about yourself.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex items-center justify-end gap-x-6">
		<button
			type="submit"
			class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>SUBMIT</button
		>
	</div>

	{#if form_submitted}
		<div class="rounded-md bg-green-50 py-4 mt-4 px-6">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-green-400"
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
				</div>
				<div class="ml-3">
					<p class="text-sm font-medium text-green-800">Form successfully submitted.</p>
				</div>
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							on:click={() => (form_submitted = false)}
							type="button"
							class="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
						>
							<span class="sr-only">Dismiss</span>
							<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
								<path
									d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</form>
