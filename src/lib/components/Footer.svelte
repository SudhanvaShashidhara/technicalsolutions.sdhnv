<script lang="ts">
	import { navGroups } from '#lib/nav.ts';
</script>

<footer
	class="border-t border-googlegreyG300 bg-white dark:border-googlegreyG800 dark:bg-googlegreyG900"
	aria-labelledby="footer-heading"
>
	<h2 id="footer-heading" class="sr-only">Footer</h2>
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
			<div class="space-y-4 lg:col-span-4">
				<a href="/" class="inline-flex items-center gap-2.5">
					<span class="grid grid-cols-2 gap-0.5" aria-hidden="true">
						<span class="h-2 w-2 rounded-full bg-googlebluecore"></span>
						<span class="h-2 w-2 rounded-full bg-googleredcore"></span>
						<span class="h-2 w-2 rounded-full bg-googleyellowcore"></span>
						<span class="h-2 w-2 rounded-full bg-googlegreencore"></span>
					</span>
					<span class="text-base font-medium tracking-tight text-googlegreyG900 dark:text-white">
						Technical <span class="text-googlegreyG700 dark:text-googlegreycore">Solutions</span>
					</span>
				</a>
				<p class="max-w-sm text-sm leading-6 text-googlegreyG700 dark:text-googlegreycore">
					Interactive reference implementations for Google Ads measurement &mdash; lead scoring,
					enhanced conversions, Search Ads 360 Floodlight, and iframe tagging.
				</p>
				<div class="flex items-center gap-2 text-xs text-googlegreyG700 dark:text-googlegreycore">
					<span class="g-chip-neutral">GTM-5JFB33F</span>
					<span>Container active on all pages</span>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
				{#each navGroups as group (group.id)}
					<div>
						<h3
							class="text-xs font-semibold uppercase tracking-wider text-googlegreyG900 dark:text-white"
						>
							{group.title}
						</h3>
						<ul class="mt-4 space-y-2.5">
							{#each group.items as item (item.href)}
								<li>
									<a
										href={item.href}
										class="text-sm text-googlegreyG700 transition-colors hover:text-googleblue600 dark:text-googlegreycore dark:hover:text-googleblue300"
									>
										{item.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div
			class="mt-12 flex flex-col items-start justify-between gap-4 border-t border-googlegreyG200 pt-8 sm:flex-row sm:items-center dark:border-googlegreyG800"
		>
			<p class="text-xs text-googlegreyG700 dark:text-googlegreycore">
				&copy; {new Date().getFullYear()} Technical Solutions. Independent measurement sandbox; not affiliated
				with Google LLC.
			</p>
			<p class="text-xs text-googlegreyG700 dark:text-googlegreycore">
				Made in BLR by
				<a
					class="font-medium text-googleblue600 hover:underline dark:text-googleblue300"
					href="mailto:sudhanvashashidhara@gmail.com">Sudhanva S</a
				>
			</p>
		</div>
	</div>
</footer>
