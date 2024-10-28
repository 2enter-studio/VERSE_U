<script lang="ts">
	import type { RefProps } from './types';
	import { page } from '$app/stores';
	import type { PageData } from '../../../routes/$types';
	import { getRowName } from '@/index';
	import { onDestroy } from 'svelte';
	import { setEditing } from '@/stores/edit_history';

	let { base, target, class: className, selected = $bindable() }: RefProps = $props();

	const selectedCopy = selected;
	const isSelected = $derived((id: string) => id === selected);

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
			<input
				id="option-{id}"
				type="radio"
				bind:group={selected}
				value={id}
				class="text-white radio radio-sm"
				hidden
			/>
			<label
				for="option-{id}"
				class="{isSelected(id)
					? 'bg-white text-black'
					: 'text-white'} cursor-pointer hover:border-white border-white/0 border-2 px-1"
			>
				<button
					class="hover:bg-amber-500"
					onclick={() => {
						setEditing({ id, tableName: target });
					}}
				>
					{'->'}
				</button>
				{getRowName(option)}
			</label>
		{/each}
	</div>
{/await}
