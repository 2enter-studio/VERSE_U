<script lang="ts">
	import type { RefProps } from './types';
	import { page } from '$app/stores';
	import type { PageData } from '../../../routes/$types';
	import { getRowName } from '@/index';
	import { onDestroy } from 'svelte';

	let { base, target, class: className, selected = $bindable() }: RefProps = $props();

	const selectedCopy = selected;

	onDestroy(() => {
		selected = selectedCopy;
	});

	const tablePromise = ($page.data as PageData).tables;
</script>

{#await tablePromise then tables}
	{@const options = tables[target]}
	<div class="flex flex-col text-left {className}">
		{#each options as option}
			{@const { id } = option}
			{@const isSelected = id === selected}
			<input
				id="option-{id}"
				type="radio"
				bind:group={selected}
				value={id}
				class="text-white"
				hidden
			/>
			<label
				for="option-{id}"
				class="{isSelected ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer hover:border-white border-white/0 border-2 px-1"
			>
				{getRowName(option)}
			</label>
		{/each}
	</div>
{/await}
