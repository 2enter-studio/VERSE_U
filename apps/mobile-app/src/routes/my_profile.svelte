<script lang="ts">
	import { fly } from 'svelte/transition';

	import { showMenu, auth } from '@/stores';
	import { Avatar } from '@/components';
	import { Settings } from './';

	type Props = { class?: string };
	let { class: className }: Props = $props();

	let openSetting = $state(false);
</script>

{#if auth.profile && $showMenu}
	<button
		onclick={() => (openSetting = !openSetting)}
		transition:fly={{ x: -100 }}
		class="center-content h-7 flex-row gap-1 rounded-xl bg-orange-500/90 pr-3 text-sm shadow-inner shadow-orange-600 {className}"
	>
		<Avatar profile={auth.profile} class="size-12 shadow-md shadow-orange-900/30" />
		{auth.profile.name}
	</button>
{/if}

<Settings bind:open={openSetting} />
