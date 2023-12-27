<script lang="ts">
	function handle_submit(e: SubmitEvent) {
		const form = e.target as HTMLFormElement;
		const form_data = new FormData(form);
		const full_name = form_data.get('full-name');
		const email = form_data.get('email');
		const income = form_data.get('income');
		const about = form_data.get('about');
		const form_entered_data = { full_name, email, income, about };
		console.log(form_entered_data);
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({ event: 'form_submit', form_entered_data });
		form.reset();
	}
</script>

<svelte:head>
	<title>Lead Scoring Demo - GTM (Programatic Values)</title>
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
					<label for="about" class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
						>About</label
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
</form>
