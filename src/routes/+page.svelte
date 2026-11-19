<script lang="ts">
	import { navGroups, type NavGroup } from '#lib/nav.ts';

	type FilterId = 'all' | NavGroup['id'];
	let activeFilter = $state<FilterId>('all');

	let visibleGroups = $derived(
		activeFilter === 'all' ? navGroups : navGroups.filter((g) => g.id === activeFilter)
	);
</script>

<svelte:head>
	<title>Technical Solutions Team</title>
	<meta
		name="description"
		content="Minimal, verifiable sandboxes for Google Ads lead scoring, enhanced conversions, Search Ads 360 Floodlight, and SHA-256 hashing."
	/>
</svelte:head>

<section class="border-b border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
	<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
		<p class="font-mono text-xs uppercase tracking-[0.14em] text-muted dark:text-muted-dark">
			Measurement Sandbox
		</p>
		<h1
			class="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl dark:text-ink-dark"
		>
			Tagging that just works.
		</h1>
		<p class="mt-4 max-w-xl text-base text-muted dark:text-muted-dark">
			Live demos for Google Ads, Search Ads 360, and GTM with real-time payload inspection.
		</p>

		<div class="mt-7 flex flex-wrap items-center gap-3">
			<a href="/lead-scoring/google-tag-1" class="ed-btn-primary">Start demo</a>
			<a href="/contact" class="ed-btn-secondary">SHA-256 Verifier</a>
		</div>
	</div>
</section>

<section
	class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
	aria-label="Measurement implementations"
>
	<!-- Filter bar -->
	<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
		<button
			type="button"
			aria-pressed={activeFilter === 'all'}
			onclick={() => (activeFilter = 'all')}
			class="inline-flex min-h-[38px] items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors {activeFilter ===
			'all'
				? 'border-ink bg-ink text-white dark:border-ink-dark dark:bg-ink-dark dark:text-canvas-dark'
				: 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink dark:border-line-dark dark:bg-surface-dark dark:text-muted-dark dark:hover:border-ink-dark/40 dark:hover:text-ink-dark'}"
		>
			All
		</button>
		{#each navGroups as group (group.id)}
			<button
				type="button"
				aria-pressed={activeFilter === group.id}
				onclick={() => (activeFilter = group.id)}
				class="inline-flex min-h-[38px] items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors {activeFilter ===
				group.id
					? 'border-ink bg-ink text-white dark:border-ink-dark dark:bg-ink-dark dark:text-canvas-dark'
					: 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink dark:border-line-dark dark:bg-surface-dark dark:text-muted-dark dark:hover:border-ink-dark/40 dark:hover:text-ink-dark'}"
			>
				{group.title}
			</button>
		{/each}
	</div>

	<div class="mt-10 space-y-10">
		{#each visibleGroups as group (group.id)}
			<div>
				<div
					class="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-2.5 dark:border-line-dark"
				>
					<h2 class="text-base font-semibold tracking-tight text-ink dark:text-ink-dark">
						{group.title}
					</h2>
					<p class="text-xs text-muted dark:text-muted-dark">{group.summary}</p>
				</div>

				<ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{#each group.items as item (item.href)}
						<li>
							<a href={item.href} class="ed-card-interactive group block h-full p-4">
								<div class="flex items-center justify-between gap-2">
									<h3
										class="text-sm font-medium text-ink transition-colors group-hover:text-cobalt dark:text-ink-dark dark:group-hover:text-cobalt-dark"
									>
										{item.label}
									</h3>
									{#if item.badge}
										<span class="ed-tag shrink-0">{item.badge}</span>
									{/if}
								</div>
								<p class="mt-1.5 text-xs leading-5 text-muted dark:text-muted-dark">
									{item.description}
								</p>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>
