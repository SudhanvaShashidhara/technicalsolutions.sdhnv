<script lang="ts">
	import { navGroups } from '$lib/nav';

	const accentDot: Record<string, string> = {
		blue: 'bg-googlebluecore',
		red: 'bg-googleredcore',
		yellow: 'bg-googleyellowcore',
		green: 'bg-googlegreencore'
	};

	const accentChip: Record<string, string> = {
		blue: 'g-chip-blue',
		red: 'g-chip-red',
		yellow: 'g-chip-yellow',
		green: 'g-chip-green'
	};
</script>

<svelte:head>
	<title>Technical Solutions Team</title>
	<meta
		name="description"
		content="Live, verifiable reference implementations for Google Ads measurement: lead scoring, enhanced conversions, Search Ads 360 Floodlight, and iframe tagging."
	/>
</svelte:head>

<!-- Clean Google Developers Hero -->
<section
	class="border-b border-googlegreyG300 bg-white dark:border-googlegreyG800 dark:bg-googledarkcard"
>
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
			<div class="lg:col-span-7">
				<div class="flex items-center gap-1.5" aria-hidden="true">
					<span class="h-2 w-2 rounded-full bg-googlebluecore"></span>
					<span class="h-2 w-2 rounded-full bg-googleredcore"></span>
					<span class="h-2 w-2 rounded-full bg-googleyellowcore"></span>
					<span class="h-2 w-2 rounded-full bg-googlegreencore"></span>
					<span
						class="ml-2 text-xs font-medium uppercase tracking-wider text-googlegreyG700 dark:text-googlegreycore"
					>
						Google Ads Measurement Sandbox
					</span>
				</div>

				<h1
					class="mt-4 text-4xl font-normal tracking-tight text-googlegreyG900 sm:text-5xl dark:text-white"
				>
					Tagging that just works.
				</h1>

				<p
					class="mt-5 max-w-2xl text-base leading-7 text-googlegreyG700 sm:text-lg dark:text-googlegreycore"
				>
					Interactive, copy-ready reference implementations for lead qualification scoring, enhanced
					conversions, Search Ads 360 Floodlight tags, and cross-origin iframe embeds &mdash; wired
					with live payload inspection.
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-3">
					<a href="/lead-scoring/google-tag-1" class="g-btn-primary">Explore demos</a>
					<a href="/contact" class="g-btn-secondary">SHA-256 Hash Verifier</a>
				</div>
			</div>

			<!-- Reference architecture preview card -->
			<div class="lg:col-span-5">
				<div
					class="overflow-hidden rounded-2xl border border-googlegreyG300 bg-googlegreyG900 text-googlegreyG200 shadow-sm dark:border-googlegreyG800 dark:bg-[#17181B]"
				>
					<div class="flex items-center justify-between border-b border-white/10 px-4 py-3">
						<div class="flex items-center gap-2">
							<span class="h-2.5 w-2.5 rounded-full bg-googleredcore"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-googleyellowcore"></span>
							<span class="h-2.5 w-2.5 rounded-full bg-googlegreencore"></span>
						</div>
						<span class="font-mono text-xs text-googlegreycore">gtag + dataLayer</span>
					</div>
					<pre class="overflow-x-auto p-5 font-mono text-xs leading-6"><code
							><span class="text-googlegreycore">// 1. Normalized first-party user data</span>
gtag('set', 'user_data', &#123;
  sha256_email_address: 'f660ab912ec121d1b1e928a0bb4bc61b...',
  sha256_phone_number: '422282c8899a441a036c5b3f833159b3...'
&#125;);

<span class="text-googlegreycore">// 2. Value-based lead conversion</span>
gtag('event', 'conversion', &#123;
  send_to: 'AW-700270946/XObGCK639_8YEOKS9c0C',
  value: 80,
  currency: 'USD'
&#125;);</code
						></pre>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Measurement Directory -->
<section class="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
	<div class="space-y-12">
		{#each navGroups as group (group.id)}
			<div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
					<div class="flex items-center gap-2.5">
						<span class="h-2.5 w-2.5 rounded-full {accentDot[group.accent]}"></span>
						<h2 class="text-xl font-normal tracking-tight text-googlegreyG900 dark:text-white">
							{group.title}
						</h2>
					</div>
					<p class="text-sm text-googlegreyG700 dark:text-googlegreycore">
						{group.summary}
					</p>
				</div>

				<div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each group.items as item (item.href)}
						<a href={item.href} class="g-card-interactive group flex flex-col justify-between p-5">
							<div>
								<div class="flex items-start justify-between gap-3">
									<h3
										class="text-sm font-medium text-googlegreyG900 group-hover:text-googleblue600 dark:text-white dark:group-hover:text-googleblue300"
									>
										{item.label}
									</h3>
									{#if item.badge}
										<span class="{accentChip[group.accent]} shrink-0">{item.badge}</span>
									{/if}
								</div>
								<p class="mt-2 text-xs leading-5 text-googlegreyG700 dark:text-googlegreycore">
									{item.description}
								</p>
							</div>
							<div
								class="mt-4 flex items-center gap-1 text-xs font-medium text-googleblue600 dark:text-googleblue300"
							>
								<span>Open implementation</span>
								<span
									class="transition-transform duration-150 group-hover:translate-x-0.5"
									aria-hidden="true">&rarr;</span
								>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>
