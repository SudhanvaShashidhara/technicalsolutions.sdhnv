<script lang="ts">
	const lead_scoring = [
		{ href: '/lead-scoring/google-tag-1', label: 'Google Tag (HTML Predefined Values)' },
		{ href: '/lead-scoring/google-tag-2', label: 'Google Tag (Programatic Values)' },
		{ href: '/lead-scoring/gtm-1', label: 'GTM (HTML Predefined Values)' },
		{ href: '/lead-scoring/gtm-2', label: 'GTM (Programatic Values)' }
	];

	const enhanced_conversions = [
		{ href: '/adsenhancedconversions/automatic', label: 'Automatic' },
		{ href: '/adsenhancedconversions/css-selector', label: 'CSS Selector' },
		{ href: '/adsenhancedconversions/javascript', label: 'JavaScript' },
		{ href: '/adsenhancedconversions/code', label: 'Code' }
	];

	const tools = [
		{ href: '/iframe/typeform', label: 'Iframe (Typeform)' },
		{ href: '/iframe/calendly', label: 'Iframe (Calendly)' },
		{ href: '/contact', label: 'Contact' }
	];
</script>

<footer
	class="border-t border-gray-200 bg-white dark:border-white/10 dark:bg-googlegreyG900"
	aria-labelledby="footer-heading"
>
	<h2 id="footer-heading" class="sr-only">Footer</h2>
	<div class="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<div class="space-y-4">
				<a href="/" class="flex items-center gap-2">
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
				<p class="max-w-xs text-sm leading-6 text-googlegreyG800 dark:text-gray-400">
					Reference implementations for Google Ads measurement &mdash; lead scoring, enhanced
					conversions, and SA360 tagging.
				</p>
			</div>

			<div class="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
				<div>
					<h3 class="text-sm font-semibold text-googlegreyG900 dark:text-white">Lead Scoring</h3>
					<ul class="mt-6 space-y-4">
						{#each lead_scoring as item}
							<li>
								<a
									href={item.href}
									class="text-sm leading-6 text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-400 dark:hover:text-white"
									>{item.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="text-sm font-semibold text-googlegreyG900 dark:text-white">
						Enhanced Conversions
					</h3>
					<ul class="mt-6 space-y-4">
						{#each enhanced_conversions as item}
							<li>
								<a
									href={item.href}
									class="text-sm leading-6 text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-400 dark:hover:text-white"
									>{item.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="text-sm font-semibold text-googlegreyG900 dark:text-white">Tools</h3>
					<ul class="mt-6 space-y-4">
						{#each tools as item}
							<li>
								<a
									href={item.href}
									class="text-sm leading-6 text-googlegreyG800 transition-colors hover:text-googlebluecore dark:text-gray-400 dark:hover:text-white"
									>{item.label}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<div
			class="mt-16 flex flex-col items-start gap-4 border-t border-gray-200 pt-8 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="text-xs leading-5 text-googlegreyG800 dark:text-gray-400">
				&copy; {new Date().getFullYear()} Technical Solutions. Not affiliated with Google LLC.
			</p>
			<p class="text-xs leading-5 text-googlegreyG800 dark:text-gray-400">
				Made in BLR by
				<a
					target="_blank"
					rel="noopener noreferrer"
					class="font-semibold text-googlebluecore hover:underline"
					href="mailto:sudhanvashashidhara@gmail.com">Sudhanva S</a
				>
			</p>
		</div>
	</div>
</footer>
