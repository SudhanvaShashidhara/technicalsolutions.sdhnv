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
		tabs = [],
		codeTitle = 'Snippet',
		codeSnippet,
		livePayload = null,
		inspectorNotes = [],
		children
	}: Props = $props();

	type InspectorTab = 'payload' | 'code' | 'notes';
	let activeTab = $state<InspectorTab>('payload');
	let copiedCode = $state(false);
	let copiedPayload = $state(false);
	let lastPayloadRef = $state<Record<string, unknown> | null>(null);

	let inspectorTabs = $derived.by<Array<{ id: InspectorTab; label: string }>>(() => {
		const list: Array<{ id: InspectorTab; label: string }> = [{ id: 'payload', label: 'Payload' }];
		if (codeSnippet) list.push({ id: 'code', label: 'Code' });
		if (inspectorNotes.length > 0) list.push({ id: 'notes', label: 'Notes' });
		return list;
	});

	$effect(() => {
		if (livePayload && livePayload !== lastPayloadRef) {
			lastPayloadRef = livePayload;
			activeTab = 'payload';
		}
	});

	function handleTabKeydown(e: KeyboardEvent, index: number) {
		const count = inspectorTabs.length;
		if (count <= 1) return;

		let nextIndex: number | null = null;
		if (e.key === 'ArrowRight') nextIndex = (index + 1) % count;
		else if (e.key === 'ArrowLeft') nextIndex = (index - 1 + count) % count;
		else if (e.key === 'Home') nextIndex = 0;
		else if (e.key === 'End') nextIndex = count - 1;

		if (nextIndex !== null) {
			e.preventDefault();
			const nextTab = inspectorTabs[nextIndex];
			activeTab = nextTab.id;
			const el = document.getElementById(`inspector-tab-${nextTab.id}`);
			el?.focus();
		}
	}

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

<div class="border-b border-line bg-surface dark:border-line-dark dark:bg-surface-dark">
	<div class="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
		<nav
			class="flex items-center gap-2 text-xs text-muted dark:text-muted-dark"
			aria-label="Breadcrumb"
		>
			<a href="/" class="hover:text-ink dark:hover:text-ink-dark">Home</a>
			<span aria-hidden="true">/</span>
			<span>{category}</span>
		</nav>

		<div class="mt-2.5 flex flex-wrap items-center gap-2.5">
			<h1 class="text-2xl font-semibold tracking-[-0.02em] text-ink sm:text-3xl dark:text-ink-dark">
				{heading}
			</h1>
			{#if badge}
				<span class="ed-tag-accent">{badge}</span>
			{/if}
		</div>

		<p class="mt-1.5 max-w-2xl text-sm text-muted dark:text-muted-dark">
			{description}
		</p>

		{#if tabs.length > 0}
			<nav class="-mb-px mt-5 flex gap-1 overflow-x-auto" aria-label="{category} pages">
				{#each tabs as tab (tab.href)}
					{@const cleanHref = tab.href.split('?')[0]}
					{@const active = page.url.pathname === cleanHref}
					<a
						href={tab.href}
						aria-current={active ? 'page' : undefined}
						class="inline-flex min-h-[40px] shrink-0 items-center border-b-2 px-3 py-2 text-xs font-medium transition-colors sm:text-sm {active
							? 'border-cobalt text-cobalt dark:border-cobalt-dark dark:text-cobalt-dark'
							: 'border-transparent text-muted hover:border-line-strong hover:text-ink dark:text-muted-dark dark:hover:border-line-dark-strong dark:hover:text-ink-dark'}"
					>
						{tab.shortLabel}
					</a>
				{/each}
			</nav>
		{:else}
			<div class="pb-5"></div>
		{/if}
	</div>
</div>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
	{#if codeSnippet || inspectorNotes.length > 0}
		<div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
			<div class="lg:col-span-7">
				{@render children()}
			</div>

			<aside class="lg:col-span-5" aria-label="Inspector">
				<div class="ed-card overflow-hidden">
					<div
						class="flex items-center justify-between border-b border-line px-3 py-2 dark:border-line-dark"
					>
						<div role="tablist" aria-label="Inspector views" class="flex items-center gap-1">
							{#each inspectorTabs as tab, index (tab.id)}
								<button
									id="inspector-tab-{tab.id}"
									type="button"
									role="tab"
									aria-selected={activeTab === tab.id}
									aria-controls="inspector-panel-{tab.id}"
									tabindex={activeTab === tab.id ? 0 : -1}
									onclick={() => (activeTab = tab.id)}
									onkeydown={(e) => handleTabKeydown(e, index)}
									class="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors {activeTab ===
									tab.id
										? 'bg-subtle text-ink dark:bg-subtle-dark dark:text-ink-dark'
										: 'text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark'}"
								>
									{#if tab.id === 'payload'}
										<span
											class="h-1.5 w-1.5 rounded-full {livePayload
												? 'bg-emerald-600 dark:bg-emerald-400'
												: 'bg-line-strong dark:bg-line-dark-strong'}"
											aria-hidden="true"
										></span>
									{/if}
									{tab.label}
								</button>
							{/each}
						</div>

						{#if activeTab === 'payload' && livePayload}
							<button
								type="button"
								onclick={() => copyText(JSON.stringify(livePayload, null, 2), 'payload')}
								class="rounded-md px-2.5 py-1.5 text-xs font-medium text-cobalt hover:bg-cobalt-soft dark:text-cobalt-dark dark:hover:bg-cobalt-dark/15"
							>
								{copiedPayload ? 'Copied' : 'Copy JSON'}
							</button>
						{:else if activeTab === 'code' && codeSnippet}
							<button
								type="button"
								onclick={() => copyText(codeSnippet, 'code')}
								class="rounded-md px-2.5 py-1.5 text-xs font-medium text-cobalt hover:bg-cobalt-soft dark:text-cobalt-dark dark:hover:bg-cobalt-dark/15"
							>
								{copiedCode ? 'Copied' : 'Copy'}
							</button>
						{/if}
					</div>

					{#if activeTab === 'payload'}
						<div
							id="inspector-panel-payload"
							role="tabpanel"
							aria-labelledby="inspector-tab-payload"
							class="bg-subtle/60 p-4 dark:bg-canvas-dark"
						>
							{#if livePayload}
								<pre
									class="max-h-[420px] overflow-auto font-mono text-xs leading-5 text-ink dark:text-ink-dark"><code
										>{JSON.stringify(livePayload, null, 2)}</code
									></pre>
							{:else}
								<p class="py-6 text-center text-xs text-muted dark:text-muted-dark">
									Submit the form to inspect live <code class="font-mono">gtag</code> /
									<code class="font-mono">dataLayer</code> output.
								</p>
							{/if}
						</div>
					{:else if activeTab === 'code' && codeSnippet}
						<div
							id="inspector-panel-code"
							role="tabpanel"
							aria-labelledby="inspector-tab-code"
							class="bg-ink p-4 text-zinc-100 dark:bg-canvas-dark"
						>
							<p class="sr-only">{codeTitle}</p>
							<pre class="max-h-[420px] overflow-auto font-mono text-xs leading-5"><code
									>{codeSnippet}</code
								></pre>
						</div>
					{:else if activeTab === 'notes' && inspectorNotes.length > 0}
						<div
							id="inspector-panel-notes"
							role="tabpanel"
							aria-labelledby="inspector-tab-notes"
							class="p-4"
						>
							<ul class="space-y-2.5 text-xs leading-5 text-muted dark:text-muted-dark">
								{#each inspectorNotes as note, idx (idx)}
									<li class="flex items-start gap-2.5">
										<span
											class="mt-2 h-1 w-1 shrink-0 rounded-full bg-cobalt dark:bg-cobalt-dark"
											aria-hidden="true"
										></span>
										<span>{note}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</aside>
		</div>
	{:else}
		{@render children()}
	{/if}
</div>
