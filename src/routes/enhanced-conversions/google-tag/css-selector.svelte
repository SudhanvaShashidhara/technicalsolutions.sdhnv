<svelte:head>
	<title>Lead Scoring Demo - Google Tag (Using predefined values in HTML Template)</title>
</svelte:head>
<form class="w-11/12 lg:w-8/12 p-4 lg:py-10 m-auto border-b border-gray-900/10 pb-12">
	<div class="space-y-12">
		<div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
			<div>
				<h2 class="text-base font-semibold leading-7 text-gray-900">Contact Us</h2>
				<p class="mt-1 text-sm leading-6 text-gray-600">
					Use a permanent address where you can receive mail.
				</p>
			</div>

			<div class="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
				<div class="sm:col-span-3">
					<label for="first-name" class="block text-sm font-medium leading-6 text-gray-900"
						>First name</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="first-name"
							id="first-name"
							autocomplete="given-name"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="last-name" class="block text-sm font-medium leading-6 text-gray-900"
						>Last name</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="last-name"
							id="last-name"
							autocomplete="family-name"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-4">
					<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
						>Email address</label
					>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="agency-freelancer" class="block text-sm font-medium leading-6 text-gray-900"
						>Are you an agency or freelancer?</label
					>
					<div class="mt-2">
						<select
							id="agency-freelancer"
							name="agency-freelancer"
							autocomplete="agency-freelancer-name"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
						>
							<option data-lead-value="20" value="agency-freelancer"
								>Yes, I'm an agency or a freelancer</option
							>
							<option data-lead-value="10" value="website-owner">No, I'm a website owner</option>
						</select>
					</div>
				</div>

				<div class="col-span-full">
					<label for="street-address" class="block text-sm font-medium leading-6 text-gray-900"
						>Street address</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="street-address"
							id="street-address"
							autocomplete="street-address"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-2 sm:col-start-1">
					<label for="city" class="block text-sm font-medium leading-6 text-gray-900">City</label>
					<div class="mt-2">
						<input
							type="text"
							name="city"
							id="city"
							autocomplete="address-level2"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="region" class="block text-sm font-medium leading-6 text-gray-900"
						>State / Province</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="region"
							id="region"
							autocomplete="address-level1"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label for="postal-code" class="block text-sm font-medium leading-6 text-gray-900"
						>ZIP / Postal code</label
					>
					<div class="mt-2">
						<input
							type="text"
							name="postal-code"
							id="postal-code"
							autocomplete="postal-code"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
</form>
