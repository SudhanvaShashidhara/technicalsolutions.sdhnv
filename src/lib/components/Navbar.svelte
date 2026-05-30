<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';

	const lead_scoring = [
		{ href: '/lead-scoring/google-tag-1', label: 'Google Tag (HTML Predefined Values)' },
		{ href: '/lead-scoring/google-tag-2', label: 'Google Tag (Programatic Values)' },
		{ href: '/lead-scoring/gtm-1', label: 'GTM (dataLayer)' },
		{ href: '/lead-scoring/gtm-2', label: 'GTM (HTML Predefined Values)' }
	];

	const enhanced_conversions = [
		{ href: '/adsenhancedconversions/automatic', label: 'Automatic' },
		{ href: '/adsenhancedconversions/css-selector', label: 'CSS Selector' },
		{ href: '/adsenhancedconversions/javascript', label: 'JavaScript' },
		{ href: '/adsenhancedconversions/code', label: 'Code' }
	];

	let mobile_open = false;
	let open_menu: 'lead' | 'ec' | null = null;

	function toggle(menu: 'lead' | 'ec') {
		open_menu = open_menu === menu ? null : menu;
	}

	function close_all() {
		open_menu = null;
		mobile_open = false;
	}
</script>

<svelte:window on:click={() => (open_menu = null)} />

<header
	class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-googlegreyG900/80"
>
	<nav class="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
		<!-- Wordmark -->
		<div class="flex lg:flex-1">
			<a href="/" class="-m-1.5 flex items-center gap-2 p-1.5">
				<span class="grid grid-cols-2 gap-0.5">
					<span class="h-2 w-2 rounded-full bg-googlebluecore"></span>
					<span class="h-2 w-2 rounded-full bg-googleredcore"></span>
					<span class="h-2 w-2 rounded-full bg-googleyellowcore"></span>
					<span class="h-2 w-2 rounded-full bg-googlegreencore"></span>
				</span>
				<span class="text-base font-semibold tracking-tight text-googlegreyG900 dark:text-white">
					Technical Solutions
				</span>
			</a>
		</div>

		<!-- Mobile controls -->
		<div class="flex items-center gap-1 lg:hidden">
			<ThemeToggle />
			<button
				type="button"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-googlegreyG800 dark:text-gray-300"
				on:click={() => (mobile_open = !mobile_open)}
			>
				<span class="sr-only">Toggle main menu</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					{#if mobile_open}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					{/if}
				</svg>
			</button>
		</div>

		<!-- Desktop links -->
		<div class="hidden lg:flex lg:items-center lg:gap-x-8">
			<a
				href="/contact"
				class="text-sm font-medium text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-300 dark:hover:text-white"
			>
				Contact Us
			</a>
			<a
				href="/iframe/typeform"
				class="text-sm font-medium text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-300 dark:hover:text-white"
			>
				Iframe
			</a>

			<div class="relative">
				<button
					type="button"
					class="flex items-center gap-x-1 text-sm font-medium text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-300 dark:hover:text-white"
					aria-expanded={open_menu === 'lead'}
					on:click|stopPropagation={() => toggle('lead')}
				>
					Lead Scoring
					<svg
						class="h-4 w-4 transition-transform {open_menu === 'lead' ? 'rotate-180' : ''}"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				{#if open_menu === 'lead'}
					<div
						class="absolute -left-4 top-full z-10 mt-3 w-72 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5 dark:bg-googlegreyG800 dark:ring-white/10"
					>
						{#each lead_scoring as item}
							<a
								href={item.href}
								on:click={close_all}
								class="block rounded-lg px-3 py-2 text-sm font-medium text-googlegreyG800 transition-colors hover:bg-googleblueG50 hover:text-googleblueG800 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white"
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<div class="relative">
				<button
					type="button"
					class="flex items-center gap-x-1 text-sm font-medium text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-300 dark:hover:text-white"
					aria-expanded={open_menu === 'ec'}
					on:click|stopPropagation={() => toggle('ec')}
				>
					Enhanced Conversions
					<svg
						class="h-4 w-4 transition-transform {open_menu === 'ec' ? 'rotate-180' : ''}"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				{#if open_menu === 'ec'}
					<div
						class="absolute -left-4 top-full z-10 mt-3 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-900/5 dark:bg-googlegreyG800 dark:ring-white/10"
					>
						{#each enhanced_conversions as item}
							<a
								href={item.href}
								on:click={close_all}
								class="block rounded-lg px-3 py-2 text-sm font-medium text-googlegreyG800 transition-colors hover:bg-googleblueG50 hover:text-googleblueG800 dark:text-gray-200 dark:hover:bg-white/5 dark:hover:text-white"
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-4">
			<ThemeToggle />
			<a
				href="/contact"
				class="rounded-full bg-googlebluecore px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-googleblueG800"
			>
				Get in touch
			</a>
		</div>
	</nav>

	<!-- Mobile menu -->
	{#if mobile_open}
		<div class="border-t border-gray-200 lg:hidden dark:border-white/10">
			<div class="space-y-1 px-4 py-4">
				<a
					href="/contact"
					on:click={close_all}
					class="block rounded-lg px-3 py-2 text-base font-medium text-googlegreyG800 hover:bg-googleblueG50 dark:text-gray-200 dark:hover:bg-white/5"
					>Contact Us</a
				>
				<a
					href="/iframe/typeform"
					on:click={close_all}
					class="block rounded-lg px-3 py-2 text-base font-medium text-googlegreyG800 hover:bg-googleblueG50 dark:text-gray-200 dark:hover:bg-white/5"
					>Iframe</a
				>

				<p class="px-3 pt-4 text-xs font-semibold uppercase tracking-wide text-googlegreycore">
					Lead Scoring
				</p>
				{#each lead_scoring as item}
					<a
						href={item.href}
						on:click={close_all}
						class="block rounded-lg px-3 py-2 text-sm font-medium text-googlegreyG800 hover:bg-googleblueG50 dark:text-gray-200 dark:hover:bg-white/5"
						>{item.label}</a
					>
				{/each}

				<p class="px-3 pt-4 text-xs font-semibold uppercase tracking-wide text-googlegreycore">
					Enhanced Conversions
				</p>
				{#each enhanced_conversions as item}
					<a
						href={item.href}
						on:click={close_all}
						class="block rounded-lg px-3 py-2 text-sm font-medium text-googlegreyG800 hover:bg-googleblueG50 dark:text-gray-200 dark:hover:bg-white/5"
						>{item.label}</a
					>
				{/each}
			</div>
		</div>
	{/if}
</header>
