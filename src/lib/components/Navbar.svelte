<script lang="ts">
	import { page } from '$app/state';
	import { navGroups, type NavGroup } from '#lib/nav.ts';
	import ThemeToggle from './ThemeToggle.svelte';

	let mobileOpen = $state(false);
	let openMenu = $state<NavGroup['id'] | null>(null);
	let lastTrigger: HTMLButtonElement | null = null;

	function toggleMenu(id: NavGroup['id'], e: MouseEvent) {
		e.stopPropagation();
		lastTrigger = e.currentTarget as HTMLButtonElement;
		openMenu = openMenu === id ? null : id;
	}

	function closeAll(restoreFocus = false) {
		const hadMenu = openMenu !== null;
		openMenu = null;
		mobileOpen = false;
		if (restoreFocus && hadMenu && lastTrigger) {
			lastTrigger.focus();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && (openMenu !== null || mobileOpen)) {
			e.preventDefault();
			closeAll(true);
		}
	}

	function isGroupActive(group: NavGroup, pathname: string): boolean {
		return group.items.some((item) => {
			const cleanHref = item.href.split('?')[0];
			return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
		});
	}
</script>

<svelte:window onclick={() => closeAll(false)} onkeydown={handleKeydown} />

<header
	class="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur dark:border-line-dark dark:bg-canvas-dark/95"
>
	<nav
		class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
		aria-label="Primary"
	>
		<!-- Editorial monochrome wordmark -->
		<a
			href="/"
			onclick={() => closeAll(false)}
			class="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg pr-2 text-sm font-semibold tracking-tight text-ink dark:text-ink-dark"
		>
			<span
				class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-ink font-mono text-[11px] font-semibold text-white dark:bg-ink-dark dark:text-canvas-dark"
				aria-hidden="true"
			>
				TS
			</span>
			<span>Technical Solutions</span>
		</a>

		<!-- Desktop menus -->
		<div class="hidden lg:flex lg:items-center lg:gap-1">
			{#each navGroups as group (group.id)}
				{@const active = isGroupActive(group, page.url.pathname)}
				{@const menuId = `nav-menu-${group.id}`}
				<div class="relative">
					<button
						type="button"
						aria-expanded={openMenu === group.id}
						aria-controls={menuId}
						onclick={(e) => toggleMenu(group.id, e)}
						class="inline-flex min-h-[40px] items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors {active
							? 'bg-cobalt-soft text-cobalt dark:bg-cobalt-dark/15 dark:text-cobalt-dark'
							: 'text-muted hover:bg-subtle hover:text-ink dark:text-muted-dark dark:hover:bg-subtle-dark dark:hover:text-ink-dark'}"
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
						<div
							id={menuId}
							role="region"
							aria-label="{group.title} pages"
							class="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-line bg-surface p-1.5 shadow-lg dark:border-line-dark dark:bg-surface-dark"
						>
							<ul class="space-y-0.5">
								{#each group.items as item (item.href)}
									{@const itemPath = item.href.split('?')[0]}
									{@const itemActive = page.url.pathname === itemPath}
									<li>
										<a
											href={item.href}
											aria-current={itemActive ? 'page' : undefined}
											onclick={() => closeAll(false)}
											class="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors {itemActive
												? 'bg-cobalt-soft font-medium text-cobalt dark:bg-cobalt-dark/15 dark:text-cobalt-dark'
												: 'text-ink hover:bg-subtle dark:text-ink-dark dark:hover:bg-subtle-dark'}"
										>
											<span class="truncate">{item.label}</span>
											{#if item.badge}
												<span class="ed-tag shrink-0">{item.badge}</span>
											{/if}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Desktop right actions -->
		<div class="hidden lg:flex lg:items-center lg:gap-2">
			<ThemeToggle />
			<a href="/contact" onclick={() => closeAll(false)} class="ed-btn-primary !px-4 !text-xs">
				SHA-256
			</a>
		</div>

		<!-- Mobile controls -->
		<div class="flex items-center gap-1 lg:hidden">
			<ThemeToggle />
			<button
				type="button"
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav-drawer"
				aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
				onclick={(e) => {
					e.stopPropagation();
					mobileOpen = !mobileOpen;
				}}
				class="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted hover:bg-subtle hover:text-ink dark:text-muted-dark dark:hover:bg-subtle-dark dark:hover:text-ink-dark"
			>
				<svg
					class="h-5 w-5"
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
			id="mobile-nav-drawer"
			class="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-surface px-4 pb-6 pt-3 lg:hidden dark:border-line-dark dark:bg-canvas-dark"
		>
			{#each navGroups as group (group.id)}
				<div class="py-2">
					<p
						class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted dark:text-muted-dark"
					>
						{group.title}
					</p>
					<ul class="space-y-0.5">
						{#each group.items as item (item.href)}
							{@const itemPath = item.href.split('?')[0]}
							{@const itemActive = page.url.pathname === itemPath}
							<li>
								<a
									href={item.href}
									aria-current={itemActive ? 'page' : undefined}
									onclick={() => closeAll(false)}
									class="flex min-h-[44px] items-center justify-between rounded-lg px-3 py-2 text-sm {itemActive
										? 'bg-cobalt-soft font-medium text-cobalt dark:bg-cobalt-dark/15 dark:text-cobalt-dark'
										: 'text-ink hover:bg-subtle dark:text-ink-dark dark:hover:bg-subtle-dark'}"
								>
									<span>{item.label}</span>
									{#if item.badge}
										<span class="ed-tag">{item.badge}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	{/if}
</header>
