<script lang="ts">
  import type { Component } from 'svelte';
  import { enhance } from '$app/forms';
  import deepEqual from 'deep-equal';

  import type { Tables } from '@repo/supabase';
  import { typeOverRide } from '@repo/utils/types';

  import { type TableName, TABLES_INFO } from '@/config';
  import Forms from '@/components/form';
  import { HiddenInput } from '@/components';

  type Props = { tableName: TableName; tableData: Tables<TableName>; class?: string };
	let { tableName, tableData, class: className }: Props = $props();

	const tableInfo = TABLES_INFO[tableName];
	const { description, metadata } = tableInfo;

	let data = $state(tableData);
	let dataCopy = $state.snapshot(data);
	const modified = $derived(!deepEqual($state.snapshot(data), dataCopy));

	$effect(() => {
		console.log(modified ? 'modified' : 'un-modified');
	});

	async function onSubmit() {
		dataCopy = $state.snapshot(data);
	}

	const returnComponent = (c: any) => typeOverRide<Component>(c);
</script>

{description}

<form
	action="?/update"
	method="post"
	use:enhance
	class="flex flex-col gap-3 items-start text-center {className}"
>
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
