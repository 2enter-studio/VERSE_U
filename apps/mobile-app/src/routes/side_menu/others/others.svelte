<script lang="ts">
	import Icon from '@iconify/svelte';
	import { items, elements } from './config';
	import { onDestroy } from 'svelte';

	type Props = { selected: keyof typeof elements | null };
	let { selected = $bindable(null) }: Props = $props();

	onDestroy(() => (selected = null));
</script>

<div class="center-content w-full flex-row flex-wrap gap-1">
	{#each items as item}
		{@const { icon, class: className, name } = item}
		<input id="others_item_{name}" type="radio" bind:group={selected} value={name} hidden />
		<label for="others_item_{name}" hidden={!!selected}>
			<Icon {icon} class="size-10 rounded-full p-1.5 shadow-inner shadow-black/40 {className}" />
		</label>
	{/each}
	{#if selected}
		<svelte:component this={elements[selected]} />
	{/if}
</div>
