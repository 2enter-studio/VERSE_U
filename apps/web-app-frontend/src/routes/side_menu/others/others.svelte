<script lang="ts">
	import Icon from '@iconify/svelte';
	import { items, elements } from './config';
	import { onDestroy } from 'svelte';
	import { sysState } from '@/states';

	type Props = { selected: keyof typeof elements | null; open: boolean };
	let { selected = $bindable(null), open = $bindable(false) }: Props = $props();

	onDestroy(() => (selected = null));
</script>

<div class="center-content w-full flex-row flex-wrap gap-4">
	{#if selected}
		<svelte:component this={elements[selected]} bind:open={open} />
	{:else}
		{#each items as item}
			{@const { icon, class: className, name } = item}
			<div class="center-content flex-col">
				<input id="others_item_{name}" type="radio" bind:group={selected} value={name} hidden />
				<label for="others_item_{name}" hidden={!!selected}>
					<Icon
						{icon}
						class="size-10 rounded-full p-1.5 shadow-inner shadow-black/40 {className}"
					/>
				</label>
				<small>{sysState.uiTexts[`SIDE_MENU_${name}_TITLE`]}</small>
			</div>
		{/each}
	{/if}
</div>
