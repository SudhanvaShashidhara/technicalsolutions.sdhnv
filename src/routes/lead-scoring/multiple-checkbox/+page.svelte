<script lang="ts">
	let form_submitted = false;
    const lead_value_map = {
        coding: 10,
        music: 5,
        bike_riding: 3,
        martial_arts: 2
    };

	function handle_submit(e: SubmitEvent) {
        let lead_value = 0;
		const form = e.target as HTMLFormElement;
		const form_data = new FormData(form);
		const full_name = form_data.get('full-name');
		const email = form_data.get('email');
		const additional_details = form_data.get('additional_details');
		const interest = form_data.getAll('interest');
        console.log(interest);
        const form_entered_data = { full_name, email, additional_details, interest };
        interest.forEach(interests => {
			lead_value += lead_value_map[interests as keyof typeof lead_value_map];
        });
		console.log(form_entered_data);
        console.log(lead_value);
		window.dataLayer.push({
			event: 'form_submit_complete',
			form_data: form_entered_data,
			lead_value: lead_value
		});
		window.gtag('set', 'user_data', {
			"email": email,
		});
		window.gtag('event', 'lead_scoring_form_submit', {
			'value': lead_value,
            'interest': interest.toString
		});
		form_submitted = true;
		form.reset();
	}
</script>


<svelte:head>
	<title>Lead Scoring Demo - Multiple Checkbox selections (gtag.js)</title>
</svelte:head>

<h2 class="w-10/12 lg:w-6/12 mx-auto text-3xl text-center mt-4">Lead Scoring Demo - Multiple Checkbox selections (gtag.js)</h2>

<div class="w-10/12 lg:w-6/12 mx-auto mt-4 text-center">
    <p>This is a test form to review Lead Scoring setup on checkboxes where multiple selections are possible.</p>
<p>The form below has a multi select checkbox field with the name "interest".</p>
<p>Let's assign an arbitrary lead score to the options under the "interest" field. with the below scores</p>
<ul>
    <li>Coding: 10</li>
    <li>Music: 5</li>
    <li>Bike Riding: 3</li>
    <li>Martial Arts: 2</li>
</ul>
</div>

<form
	on:submit|preventDefault={handle_submit}
    id="lead_scoring_form_multiple_checkbox"
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
                    <fieldset>
                        <legend class="text-base font-semibold text-gray-900">Choose your interests</legend>
                        <div class="mt-4 divide-y divide-gray-200 border-b border-t border-gray-200">
                          <div class="relative flex gap-3 py-4">
                            <div class="min-w-0 flex-1 text-sm/6">
                              <label for="coding" class="select-none font-medium text-gray-900">Coding</label>
                            </div>
                            <div class="flex h-6 shrink-0 items-center">
                              <div class="group grid size-4 grid-cols-1">
                                <input id="coding" value="coding" name="interest" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
                                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div class="relative flex gap-3 py-4">
                            <div class="min-w-0 flex-1 text-sm/6">
                              <label for="music" class="select-none font-medium text-gray-900">Music</label>
                            </div>
                            <div class="flex h-6 shrink-0 items-center">
                              <div class="group grid size-4 grid-cols-1">
                                <input id="music" value="music" name="interest" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
                                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div class="relative flex gap-3 py-4">
                            <div class="min-w-0 flex-1 text-sm/6">
                              <label for="bike_riding" class="select-none font-medium text-gray-900">Bike Riding</label>
                            </div>
                            <div class="flex h-6 shrink-0 items-center">
                              <div class="group grid size-4 grid-cols-1">
                                <input id="bike_riding" value="bike_riding" name="interest" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
                                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div class="relative flex gap-3 py-4">
                            <div class="min-w-0 flex-1 text-sm/6">
                              <label for="martial_arts" class="select-none font-medium text-gray-900">Martial Arts</label>
                            </div>
                            <div class="flex h-6 shrink-0 items-center">
                              <div class="group grid size-4 grid-cols-1">
                                <input id="martial_arts" value="martial_arts" name="interest" type="checkbox" class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto">
                                <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
                                  <path class="opacity-0 group-has-[:checked]:opacity-100" d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                  <path class="opacity-0 group-has-[:indeterminate]:opacity-100" d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </div>
                            </div>
                          </div>        
                        </div>
                      </fieldset> 
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
