<script lang="ts">
	import type { Component } from 'svelte';
	import { enhance } from '$app/forms';
	import deepEqual from 'deep-equal';
	import Icon from '@iconify/svelte';

	import type { Tables } from '@repo/supabase';
	import { typeOverRide } from '@repo/utils/types';

	import { type TableName, TABLES_INFO } from '@/config';
	import Forms from '@/components/form';
	import { HiddenInput } from '@/components';

	type Props = { tableName: TableName; tableData: Tables<TableName>; class?: string };
	let { tableName, tableData, class: className }: Props = $props();

	const tableInfo = TABLES_INFO[tableName];
	const { metadata } = tableInfo;

	let data = $state(tableData);
	let dataCopy = $state.snapshot(data);

	const modified = $derived.by(() => {
		const result: any = {};
		const dynaData = $state.snapshot(data);
		for (const name of Object.keys(metadata)) {
			// @ts-ignore
			if (dynaData?.[name] !== dataCopy?.[name]) {
				// @ts-ignore
				result[name] = dynaData[name];
			}
		}
		if (Object.keys(result).length === 0) return null;
		return result;
		// return !deepEqual($state.snapshot(data), dataCopy);
	});

	$effect(() => {
		console.log(modified);
	});

	const returnComponent = (c: any) => typeOverRide<Component>(c);
</script>

<div class="flex flex-row items-start {className}">
	{#if modified}
		<button type="submit" form="editor" class="center-content">
			<Icon icon="mingcute:save-2-line" class="text-2xl center-content" />
		</button>
	{/if}
	<form
		id="editor"
		action="?/update"
		method="post"
		use:enhance
		class="flex flex-col gap-3 items-start text-center border-l-2 border-b-2 border-white w-full p-2"
	>
		<HiddenInput name="data" value={JSON.stringify(modified)} />
		<HiddenInput name="table" value={tableName} />

		{#each Object.entries(metadata) as [name, content]}
			{@const form = returnComponent(Forms[content.type])}
			<div class="flex flex-col items-start">
				<h2 class="text-bold">- {name}</h2>
				{#if content.type !== 'ml_texts'}
					<svelte:component
						this={form}
						bind:data={data[name]}
						{name}
						class="{content.readonly ? 'bg-gray-500 pointer-events-none' : ''} "
					/>
				{:else}
					<svelte:component
						this={Forms.ml_texts}
						data={{ row_id: data.id, column_name: name }}
						{name}
					/>
				{/if}
			</div>
		{/each}

		{#if tableInfo?.reference}
			reference
		{/if}

		{#if tableInfo?.storage}
			storage
		{/if}
	</form>
</div>
