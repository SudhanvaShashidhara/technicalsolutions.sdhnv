<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { NavItem } from '#lib/nav.ts';

	interface Props {
		title: string;
		heading: string;
		category: string;
		description: string;
		badge?: string;
		badgeColor?: 'blue' | 'green' | 'yellow' | 'red' | 'neutral';
		tabs?: NavItem[];
		codeTitle?: string;
		codeSnippet?: string;
		livePayload?: Record<string, unknown> | null;
		inspectorNotes?: string[];
		children: Snippet;
	}

	let {
		title,
		heading,
		category,
		description,
		badge,
		badgeColor = 'blue',
		tabs = [],
		codeTitle = 'Reference implementation',
		codeSnippet,
		livePayload = null,
		inspectorNotes = [],
		children
	}: Props = $props();

	let copiedCode = $state(false);
	let copiedPayload = $state(false);

	const badgeClasses: Record<NonNullable<Props['badgeColor']>, string> = {
		blue: 'g-chip-blue',
		green: 'g-chip-green',
		yellow: 'g-chip-yellow',
		red: 'g-chip-red',
		neutral: 'g-chip-neutral'
	};

	async function copyText(value: string, target: 'code' | 'payload') {
		try {
			await navigator.clipboard.writeText(value);
			if (target === 'code') {
				copiedCode = true;
				setTimeout(() => (copiedCode = false), 1800);
			} else {
				copiedPayload = true;
				setTimeout(() => (copiedPayload = false), 1800);
			}
		} catch {
			// Ignore clipboard failures in restricted contexts
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<div
	class="border-b border-googlegreyG300 bg-white dark:border-googlegreyG800 dark:bg-googledarkcard"
>
	<div class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
		<!-- Breadcrumb -->
		<nav
			class="flex items-center gap-2 text-xs font-medium text-googlegreyG700 dark:text-googlegreycore"
			aria-label="Breadcrumb"
		>
			<a href="/" class="hover:text-googleblue600 dark:hover:text-googleblue300">Home</a>
			<span aria-hidden="true">/</span>
			<span>{category}</span>
		</nav>

		<div class="mt-3 flex flex-wrap items-center gap-3">
			<h1
				class="text-2xl font-normal tracking-tight text-googlegreyG900 sm:text-3xl dark:text-white"
			>
				{heading}
			</h1>
			{#if badge}
				<span class={badgeClasses[badgeColor]}>{badge}</span>
			{/if}
		</div>

		<p
			class="mt-2 max-w-3xl text-sm leading-6 text-googlegreyG700 sm:text-base dark:text-googlegreycore"
		>
			{description}
		</p>

		{#if tabs.length > 0}
			<nav class="-mb-px mt-6 flex gap-1 overflow-x-auto" aria-label="{category} implementations">
				{#each tabs as tab (tab.href)}
					{@const cleanHref = tab.href.split('?')[0]}
					{@const active = page.url.pathname === cleanHref}
					<a
						href={tab.href}
						aria-current={active ? 'page' : undefined}
						class=" shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors {active
							? 'border-googleblue600 text-googleblue600 dark:border-googleblue300 dark:text-googleblue300'
							: 'border-transparent text-googlegreyG700 hover:border-googlegreyG300 hover:text-googlegreyG900 dark:text-googlegreycore dark:hover:border-googlegreyG700 dark:hover:text-white'}"
					>
						{tab.shortLabel}
					</a>
				{/each}
			</nav>
		{:else}
			<div class="pb-6"></div>
		{/if}
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
	{#if codeSnippet || inspectorNotes.length > 0}
		<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
			<div class="lg:col-span-7">
				{@render children()}
			</div>

			<aside class="space-y-6 lg:col-span-5" aria-label="Tagging verification inspector">
				<!-- Live Payload Card -->
				<div class="g-card overflow-hidden">
					<div
						class="flex items-center justify-between border-b border-googlegreyG200 px-5 py-3.5 dark:border-googlegreyG800"
					>
						<div class="flex items-center gap-2">
							<span
								class="h-2.5 w-2.5 rounded-full {livePayload
									? 'bg-googlegreencore'
									: 'bg-googlegreyG300 dark:bg-googlegreyG700'}"
							></span>
							<h2 class="text-sm font-medium text-googlegreyG900 dark:text-white">
								Live Tag Payload
							</h2>
						</div>
						{#if livePayload}
							<button
								type="button"
								onclick={() => copyText(JSON.stringify(livePayload, null, 2), 'payload')}
								class="rounded-md px-2.5 py-1 text-xs font-medium text-googleblue600 hover:bg-googleblueG50 dark:text-googleblue300 dark:hover:bg-googleblue300/10"
							>
								{copiedPayload ? 'Copied' : 'Copy JSON'}
							</button>
						{:else}
							<span class="text-xs text-googlegreyG600 dark:text-googlegreycore"
								>Awaiting submit</span
							>
						{/if}
					</div>
					<div class="bg-googlegreyG50 p-4 dark:bg-googlegreyG900/70">
						{#if livePayload}
							<pre
								class="overflow-x-auto font-mono text-xs leading-5 text-googlegreyG900 dark:text-googlegreyG200"><code
									>{JSON.stringify(livePayload, null, 2)}</code
								></pre>
						{:else}
							<p class="text-xs leading-5 text-googlegreyG700 dark:text-googlegreycore">
								Submit the demo form to inspect the exact parameters dispatched to <code
									class="font-mono">gtag</code
								>, <code class="font-mono">dataLayer</code>, or
								<code class="font-mono">window</code>.
							</p>
						{/if}
					</div>
				</div>

				{#if codeSnippet}
					<div class="g-card overflow-hidden">
						<div
							class="flex items-center justify-between border-b border-googlegreyG200 px-5 py-3.5 dark:border-googlegreyG800"
						>
							<h2 class="text-sm font-medium text-googlegreyG900 dark:text-white">
								{codeTitle}
							</h2>
							<button
								type="button"
								onclick={() => copyText(codeSnippet, 'code')}
								class="rounded-md px-2.5 py-1 text-xs font-medium text-googleblue600 hover:bg-googleblueG50 dark:text-googleblue300 dark:hover:bg-googleblue300/10"
							>
								{copiedCode ? 'Copied' : 'Copy snippet'}
							</button>
						</div>
						<div class="bg-googlegreyG900 p-4 text-googlegreyG200 dark:bg-[#17181B]">
							<pre class="overflow-x-auto font-mono text-xs leading-5"><code>{codeSnippet}</code
								></pre>
						</div>
					</div>
				{/if}

				{#if inspectorNotes.length > 0}
					<div class="g-card p-5">
						<h2 class="text-sm font-medium text-googlegreyG900 dark:text-white">
							Verification checklist
						</h2>
						<ul
							class="mt-3 space-y-2 text-xs leading-5 text-googlegreyG700 dark:text-googlegreycore"
						>
							{#each inspectorNotes as note, idx (idx)}
								<li class="flex items-start gap-2.5">
									<span
										class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-googleblue600 dark:bg-googleblue300"
									></span>
									<span>{note}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</aside>
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
