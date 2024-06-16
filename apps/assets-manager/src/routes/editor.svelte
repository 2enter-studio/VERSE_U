<script lang="ts">
	import type { Component } from 'svelte';
	import type { Tables } from '@repo/supabase';
	import { type TableName, TABLES_INFO } from '@/config';

	import { typeOverRide } from '@repo/utils/types';

	import Forms from '@/components/form';
	import { SubmitBtn } from '@/components';

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
	});

	// $effect(() => {
	// 	console.log(modified);
	// });

	const returnComponent = (c: any) => typeOverRide<Component>(c);
</script>

{#if data}
	<div class="flex flex-row items-start {className}">
		{#if modified}
			<SubmitBtn
				action="?/update"
				data={{ id: data.id, data: JSON.stringify(modified), table: tableName }}
				icon="mingcute:save-2-line"
				class="center-content"
			/>
		{/if}
		<div
			class="flex flex-col gap-3 items-start text-center border-l-2 border-b-2 border-white w-full p-2"
		>
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
		</div>
	</div>
{/if}
