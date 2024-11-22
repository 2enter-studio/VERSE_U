<script lang="ts">
	import pluralize from 'pluralize';
	import { onMount } from 'svelte';

	import type { RefProps } from '@/components/form/types';
	import type { PageData } from '../../../routes/$types';

	import { getRowName } from '@/index';
	import { page } from '$app/stores';
	import { SubmitBtn } from '@/components/index.js';
	import { setEditing } from '@/stores/edit_history';

	const { tables } = $page.data as PageData;

	let { base, target, class: className, id }: RefProps = $props();

	let options = $state<{ id: string; value?: string }[]>([]);
	let selected = $state<string[]>([]);
	let selectedCopy = $state<string[]>([]);

	const modified = $derived(
		selected.length !== selectedCopy.length || !selected.every((d) => selectedCopy.includes(d))
	);
	const isSelected = $derived((id: string) => selected.includes(id));

	onMount(async () => {
		const tablesData = await tables;
		const selectedData = await fetchOptions();
		options = tablesData[target];
		selected = selectedData;
		selectedCopy = $state.snapshot(selected);
	});

	async function fetchOptions() {
		const res = await fetch(`/api/j/${base}-${target}/${id}`);
		const json = (await res.json()) as any[];
		return json.map((d) => d[pluralize.singular(target)].id);
	}
</script>

<div class="flex flex-col text-left">
	{#each options as option}
		<input id="option-{option.id}" type="checkbox" bind:group={selected} value={option.id} hidden />
		<label
			for="option-{option.id}"
			class="{isSelected(option.id)
				? 'bg-white text-black'
				: ''} flex flex-row justify-between gap-3 px-1 cursor-pointer hover:border-white border-white/0 border-2"
		>
			<button
				class="hover:bg-amber-500"
				onclick={() => {
					setEditing({ id: option.id, tableName: target });
				}}
			>
				{'->'}
			</button>
			{getRowName(option)}
		</label>
	{/each}

	{#if modified}
		<SubmitBtn
			action="?/junction"
			icon="mingcute:save-2-line"
			data={{ base, target, data: JSON.stringify({ selected, id }) }}
			class="hover:bg-rose-500 text-left w-fit center-content"
			afterSubmit={() => {
				selectedCopy = $state.snapshot(selected);
			}}
		/>
	{/if}
</div>
