<script lang="ts">
	let form_submitted = false;
	const service_details_value_map = {
		door_service: 10,
		kitchen_remodeling: 20,
		roofing: 30,
		plumbing: 40,
		hvac: 50,
		landscaping: 60,
	};
	const service_requirement_value_map = {
		immediate: 30,
		within_week: 20,
		within_month: 10,
	};
	function handle_submit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const form_data = new FormData(form);
		const full_name = form_data.get('full-name');
		const email = form_data.get('email');
		const service_details = form_data.get('service_details');
		const service_requirement = form_data.get('service_requirement');
		const additional_details = form_data.get('additional_details');
		const form_entered_data = { full_name, email, service_details, service_requirement, additional_details };
		const service_details_lead_value = service_details_value_map[service_details as keyof typeof service_details_value_map];
		const service_requirement_lead_value = service_requirement_value_map[service_requirement as keyof typeof service_requirement_value_map];
		const total_value = service_details_lead_value + service_requirement_lead_value;
		console.log('Total Value:', total_value);
		console.log(form_entered_data);
		window.dataLayer.push({
			event: 'form_submit_complete',
			form_data: form_entered_data,
			lead_value: total_value
		});
		window.gtag('set', 'user_data', {
			"email": email,
		});
		window.gtag('event', 'lead_scoring_form_submit', {
			'value': total_value,
			'service_details': service_details,
			'service_requirement': service_requirement
		});
		form_submitted = true;
		form.reset();
	}
</script>

<svelte:head>
	<title>Lead Scoring Demo - GTM (Pulling values from HTML fields)</title>
</svelte:head>
<h2 class="w-10/12 lg:w-6/12 mx-auto text-3xl text-center mt-4">Lead Scoring Demo - GTM [2]</h2>
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
					<label for="service_details" class="block text-sm font-medium leading-6 text-gray-900"
						>Select your service</label
					>
					<div class="mt-2">
						<select
							id="service_details"
							name="service_details"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						>
							<option data-lead-value="10" value="door_service">Door Service</option>
							<option data-lead-value="20" value="kitchen_remodeling">Kitchen Remodeling</option>
							<option data-lead-value="30" value="roofing">Roofing</option>
							<option data-lead-value="40" value="plumbing">Plumbing</option>
							<option data-lead-value="50" value="hvac">HVAC</option>
							<option data-lead-value="60" value="landscaping">Landscaping</option>
						</select>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="service_requirement" class="block text-sm font-medium leading-6 text-gray-900"
						>Service Requirement?</label
					>
					<div class="mt-2">
						<select
							id="service_requirement"
							name="service_requirement"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						>
							<option data-lead-value="30" value="immediate">Immediate</option>
							<option data-lead-value="20" value="within_week">Within the week</option>
							<option data-lead-value="10" value="within_month">Within the month</option>
						</select>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="additional_details" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
						>Additional Details</label
					>
					<div class="mt-2 sm:col-span-2 sm:mt-0">
						<textarea
							id="additional_details"
							name="additional_details"
							rows="3"
							class="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
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
