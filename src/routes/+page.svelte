<script lang="ts">
	const sections = [
		{
			href: '/lead-scoring/google-tag-1',
			title: 'Lead Scoring',
			body: 'Pass qualification values into Google Ads via the Google Tag and GTM dataLayer.',
			dot: 'bg-googlebluecore'
		},
		{
			href: '/adsenhancedconversions/automatic',
			title: 'Enhanced Conversions',
			body: 'Automatic, CSS-selector, and JavaScript enhanced-conversion implementations.',
			dot: 'bg-googleredcore'
		},
		{
			href: '/sa360/googletag',
			title: 'SA360',
			body: 'Search Ads 360 tagging via Google Tag, dataLayer, and Floodlight formats.',
			dot: 'bg-googleyellowcore'
		},
		{
			href: '/contact',
			title: 'Contact',
			body: 'reCAPTCHA-protected contact forms wired to the verification backend.',
			dot: 'bg-googlegreencore'
		}
	];
</script>

<svelte:head>
	<title>Technical Solutions Team</title>
</svelte:head>

<section class="relative overflow-hidden">
	<!-- Soft Google-colored glow -->
	<div
		class="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center opacity-30 blur-3xl"
		aria-hidden="true"
	>
		<div
			class="h-72 w-[40rem] bg-gradient-to-r from-googlebluecore via-googleredcore to-googleyellowcore"
		></div>
	</div>

	<div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
		<div class="mx-auto max-w-3xl text-center">
			<span
				class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-googlegreyG800 dark:border-white/10 dark:text-gray-300"
			>
				<span class="grid grid-cols-2 gap-0.5">
					<span class="h-1.5 w-1.5 rounded-full bg-googlebluecore"></span>
					<span class="h-1.5 w-1.5 rounded-full bg-googleredcore"></span>
					<span class="h-1.5 w-1.5 rounded-full bg-googleyellowcore"></span>
					<span class="h-1.5 w-1.5 rounded-full bg-googlegreencore"></span>
				</span>
				Google Ads measurement reference
			</span>
			<h1
				class="mt-6 text-4xl font-bold tracking-tight text-googlegreyG900 dark:text-white sm:text-6xl"
			>
				Tagging that <span class="text-googlebluecore">just works</span>.
			</h1>
			<p class="mt-6 text-lg leading-8 text-googlegreyG800 dark:text-gray-300">
				Working implementations of lead scoring, enhanced conversions, and SA360 tagging &mdash;
				each page is a live, copy-ready example you can verify end to end.
			</p>
			<div class="mt-10 flex items-center justify-center gap-4">
				<a
					href="/lead-scoring/google-tag-1"
					class="rounded-full bg-googlebluecore px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-googleblueG800"
				>
					Explore the demos
				</a>
				<a
					href="/contact"
					class="text-sm font-semibold text-googlegreyG900 transition-colors hover:text-googlebluecore dark:text-white"
				>
					Contact us <span aria-hidden="true">&rarr;</span>
				</a>
			</div>
		</div>

		<div class="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each sections as s}
				<a
					href={s.href}
					class="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-googlebluecore/40 hover:shadow-lg dark:border-white/10 dark:bg-googlegreyG800 dark:hover:border-googlebluecore/50"
				>
					<span class="block h-2.5 w-2.5 rounded-full {s.dot}"></span>
					<h3 class="mt-4 text-base font-semibold text-googlegreyG900 dark:text-white">
						{s.title}
					</h3>
					<p class="mt-2 text-sm leading-6 text-googlegreyG800 dark:text-gray-400">{s.body}</p>
					<span
						class="mt-4 inline-block text-sm font-medium text-googlebluecore opacity-0 transition-opacity group-hover:opacity-100"
					>
						Open &rarr;
					</span>
				</a>
			{/each}
		</div>
	</div>
</section>
