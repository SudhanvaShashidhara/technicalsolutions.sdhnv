<script lang="ts">
	let form_submitted = false, form_message = '', form_email : FormDataEntryValue | null = '', form_tel : FormDataEntryValue | null = '';
	function handle_submit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const form_data = new FormData(form);
		const full_name = form_data.get('full-name');
		const email = form_data.get('email');
        form_email = email;
		const tel = form_data.get('tel');
        form_tel = tel;
		const service_details = form_data.get('service_details');
		const additional_details = form_data.get('additional_details');
		// const form_entered_data = { full_name, email, service_details, additional_details };
        form_message = `Thanks for submitting the form. A confirmation email is sent to ${email}. We will also be contacting you at ${tel}`;
		form_submitted = true;
		form.reset();
	}
</script>

<svelte:head>
	<title>Ads Enhanced Conversions | CSS Selector</title>
</svelte:head>
<h2 class="w-10/12 lg:w-6/12 mx-auto text-3xl text-center mt-2 pt-6">Ads Enhanced Conversions | CSS Selector</h2>
<form
	on:submit|preventDefault={handle_submit}
	class="w-11/12 lg:w-8/12 p-4 lg:py-10 m-auto border-b border-gray-900/10 pb-12"
>
	<div class="space-y-12">
		<div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
			<div class="relative overflow-hidden py-10 px-6 sm:px-10 xl:p-12 bg-googleyellowcore rounded-md">
				<h2 class="text-base font-semibold leading-7 text-gray-200">Contact Us</h2>
				<p class="mt-1 text-sm leading-6 text-gray-100">
					Use a permanent address where you can receive mail.
				</p>
				<dl class="mt-8 space-y-6">
					<dt>
						<span class="sr-only">Phone number</span>
					</dt>
					<dd class="flex text-base text-white">
						<svg class="flex-shrink-0 w-6 h-6 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
						</svg>
						<span class="ml-3"><a href="tel:+1 (555) 123-4567">+1 (555) 123-4567</a></span>
					</dd>
					<dt>
						<span class="sr-only">Email</span>
					</dt>
					<dd class="flex text-base text-white">
						<svg class="flex-shrink-0 w-6 h-6 text-gray-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
						<span class="ml-3"><a href="mailto:me@sdhnv.com">me@sdhnv.com</a></span>
					</dd>
				</dl>			
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
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:text-sm sm:leading-6"
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
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="col-start-2 sm:col-span-7">
					<label for="tel" class="block text-sm font-medium leading-6 text-gray-900"
						>Phone Number</label
					>
					<div class="mt-2">
						<input
							id="tel"
							name="tel"
							type="tel"
							required
							autocomplete="tel"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:text-sm sm:leading-6"
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
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:max-w-xs sm:text-sm sm:leading-6"
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
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:max-w-xs sm:text-sm sm:leading-6"
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
							class="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-googleyellowcore sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="col-start-2 flex justify-end sm:col-span-7">
					<button
						type="submit"
						class="rounded-md bg-googleyellowcore px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-googleyellowG900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-googlebluecore"
						>SUBMIT</button
					>
				</div>
			</div>
		</div>
	</div>


	{#if form_submitted}
		<div class="rounded-md py-4 mt-4 px-6 bg-googlegreenG50">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-googlegreenG800"
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
					<p class="text-sm font-medium text-green-800">Thanks for submitting the form. A confirmation email is sent to <span class="ec_email">{form_email}</span>. We will also be contacting you at <span class="ec_tel">{form_tel}</span>.</p>
				</div>
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							on:click={() => (form_submitted = false)}
							type="button"
							class="inline-flex rounded-md bg-green-50 p-1.5 text-googlegreenG800 hover:bg-googlegreenG50 focus:outline-none focus:ring-2 focus:ring-googlegreenG900 focus:ring-offset-2 focus:ring-offset-green-50"
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
