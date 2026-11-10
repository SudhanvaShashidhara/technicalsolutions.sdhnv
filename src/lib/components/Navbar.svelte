<script lang="ts">
	import { page } from '$app/stores';
	import { navGroups, type NavGroup } from '$lib/nav';
	import ThemeToggle from './ThemeToggle.svelte';

	let mobileOpen = $state(false);
	let openMenu = $state<NavGroup['id'] | null>(null);

	function toggleMenu(id: NavGroup['id'], e: MouseEvent) {
		e.stopPropagation();
		openMenu = openMenu === id ? null : id;
	}

	function closeAll() {
		openMenu = null;
		mobileOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeAll();
		}
	}

	function isGroupActive(group: NavGroup, pathname: string): boolean {
		return group.items.some((item) => {
			const cleanHref = item.href.split('?')[0];
			return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
		});
	}
</script>

<svelte:window onclick={() => (openMenu = null)} onkeydown={handleKeydown} />

<header
	class="sticky top-0 z-40 border-b border-googlegreyG300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 dark:border-googlegreyG800 dark:bg-googlegreyG900/95"
>
	<nav
		class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
		aria-label="Global"
	>
		<!-- Google 4-color mark + wordmark -->
		<div class="flex items-center">
			<a
				href="/"
				onclick={closeAll}
				class="flex items-center gap-2.5 rounded-lg py-1.5 pr-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-googleblue600"
			>
				<span class="grid grid-cols-2 gap-0.5" aria-hidden="true">
					<span class="h-2 w-2 rounded-full bg-googlebluecore"></span>
					<span class="h-2 w-2 rounded-full bg-googleredcore"></span>
					<span class="h-2 w-2 rounded-full bg-googleyellowcore"></span>
					<span class="h-2 w-2 rounded-full bg-googlegreencore"></span>
				</span>
				<span class="text-[17px] font-medium tracking-tight text-googlegreyG900 dark:text-white">
					Technical <span class="text-googlegreyG700 dark:text-googlegreycore">Solutions</span>
				</span>
			</a>
		</div>

		<!-- Desktop navigation groups -->
		<div class="hidden lg:flex lg:items-center lg:gap-x-1">
			{#each navGroups as group (group.id)}
				{@const active = isGroupActive(group, $page.url.pathname)}
				<div class="relative">
					<button
						type="button"
						aria-expanded={openMenu === group.id}
						aria-haspopup="true"
						onclick={(e) => toggleMenu(group.id, e)}
						class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors {active
							? 'bg-googleblueG50 text-googleblue600 dark:bg-googleblue300/15 dark:text-googleblue300'
							: 'text-googlegreyG700 hover:bg-googlegreyG100 hover:text-googlegreyG900 dark:text-googlegreyG200 dark:hover:bg-googlegreyG800 dark:hover:text-white'}"
					>
						{group.title}
						<svg
							class="h-4 w-4 transition-transform duration-150 {openMenu === group.id
								? 'rotate-180'
								: ''}"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					{#if openMenu === group.id}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							onclick={(e) => e.stopPropagation()}
							class="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-googlegreyG300 bg-white p-2 shadow-[0_4px_16px_rgba(60,64,67,0.16)] dark:border-googlegreyG800 dark:bg-googledarkcard dark:shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
						>
							<div class="px-3 py-2">
								<p class="text-xs font-medium text-googlegreyG700 dark:text-googlegreycore">
									{group.summary}
								</p>
							</div>
							<div class="my-1 border-t border-googlegreyG200 dark:border-googlegreyG800"></div>
							{#each group.items as item (item.href)}
								{@const itemPath = item.href.split('?')[0]}
								{@const itemActive = $page.url.pathname === itemPath}
								<a
									href={item.href}
									onclick={closeAll}
									class="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors {itemActive
										? 'bg-googleblueG50/80 text-googleblueG800 dark:bg-googleblue300/15 dark:text-googleblue300'
										: 'hover:bg-googlegreyG50 dark:hover:bg-googledarktonal'}"
								>
									<div class="min-w-0">
										<p
											class="text-sm font-medium {itemActive
												? 'text-googleblue600 dark:text-googleblue300'
												: 'text-googlegreyG900 dark:text-googlegreyG200'}"
										>
											{item.label}
										</p>
										<p
											class="mt-0.5 line-clamp-1 text-xs text-googlegreyG700 dark:text-googlegreycore"
										>
											{item.description}
										</p>
									</div>
									{#if item.badge}
										<span class="g-chip-neutral shrink-0">{item.badge}</span>
									{/if}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Desktop right actions -->
		<div class="hidden lg:flex lg:items-center lg:gap-x-3">
			<ThemeToggle />
			<a href="/contact" onclick={closeAll} class="g-btn-primary !px-4 !py-2">SHA-256 Tester</a>
		</div>

		<!-- Mobile controls -->
		<div class="flex items-center gap-1 lg:hidden">
			<ThemeToggle />
			<button
				type="button"
				aria-expanded={mobileOpen}
				aria-label="Toggle navigation menu"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="inline-flex h-10 w-10 items-center justify-center rounded-full text-googlegreyG700 hover:bg-googlegreyG100 dark:text-googlegreyG200 dark:hover:bg-googlegreyG800"
			>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.75"
					stroke="currentColor"
					aria-hidden="true"
				>
					{#if mobileOpen}
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
	</nav>

	<!-- Mobile menu drawer -->
	{#if mobileOpen}
		<div
			class="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-googlegreyG300 bg-white px-4 pb-6 pt-3 lg:hidden dark:border-googlegreyG800 dark:bg-googlegreyG900"
		>
			{#each navGroups as group (group.id)}
				<div class="py-2.5">
					<p
						class="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wider text-googlegreyG700 dark:text-googlegreycore"
					>
						{group.title}
					</p>
					<div class="space-y-0.5">
						{#each group.items as item (item.href)}
							{@const itemPath = item.href.split('?')[0]}
							{@const itemActive = $page.url.pathname === itemPath}
							<a
								href={item.href}
								onclick={closeAll}
								class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium {itemActive
									? 'bg-googleblueG50 text-googleblue600 dark:bg-googleblue300/15 dark:text-googleblue300'
									: 'text-googlegreyG800 hover:bg-googlegreyG100 dark:text-googlegreyG200 dark:hover:bg-googlegreyG800'}"
							>
								<span>{item.label}</span>
								{#if item.badge}
									<span class="g-chip-neutral">{item.badge}</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</header>
