<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { APPS } from '@/config';

	let { children } = $props();
	$effect(() => {
		console.log($page.url);
	});
</script>

<div class="full-screen flex flex-row">
	<div class="h-screen w-64 overflow-y-scroll flex flex-col p-2 gap-2 *:text-lg bg-base-300">
		<a href="/" class="btn justify-start" class:btn-secondary={$page.url.pathname === '/'}>
			Quick start
		</a>
		<a
			href="/overview"
			class="btn justify-start"
			class:btn-accent={$page.url.pathname === '/overview'}
		>
			Overview
		</a>
		<div class="collapse collapse-plus">
			<input type="checkbox" checked />
			<div class="collapse-title text-xl font-medium">Apps</div>
			<div class="collapse-content">
				{#each [{ name: 'overview' }, ...APPS] as { name }}
					<a
						href="/apps/{name}"
						class="btn justify-start"
						class:btn-primary={$page.url.pathname === `/apps/${name}`}
					>
						{name}
					</a>
				{/each}
			</div>
		</div>

		<div class="collapse collapse-plus">
			<input type="checkbox" checked />
			<div class="collapse-title text-xl font-medium">Packages</div>
			<div class="collapse-content">
				{#each ['shared', 'supabase'] as app}
					<a
						href="/packages/{app}"
						class="btn justify-start"
						class:btn-secondary={$page.url.pathname === `/packages/${app}`}
					>
						{app}
					</a>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex flex-col p-5 w-[calc(100vw-16rem)] overflow-y-auto">
		{@render children()}
	</div>
</div>
