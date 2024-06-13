<script lang="ts">
	import type { Component } from 'svelte';
	import { enhance } from '$app/forms';
	import deepEqual from 'deep-equal';
	import { type TableName, TABLES_INFO } from '@/config';
	import Forms from '@/components/form';
	import { typeOverRide } from '@repo/utils';
	import type { Tables } from '@repo/supabase';

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
	class="flex flex-col items-start text-center {className}"
>
	<input type="text" name="table" value={tableName} readonly hidden />

	{#each Object.entries(metadata) as [name, content]}
		{@const form = returnComponent(Forms[content.type])}
		{name}
		{#if content.type !== 'ml_texts'}
			{#if content.readonly}
				<svelte:component this={form} bind:data={data[name]} {name} class="bg-gray-500 pointer-events-none" />
			{:else}
				<svelte:component this={form} data={data[name]} {name} />
			{/if}
		{:else}
			<svelte:component this={Forms.ml_texts} data={{ row_id: data.id, column_name: name }} />
		{/if}
	{/each}

	{#if tableInfo?.reference}
		reference
	{/if}

	{#if tableInfo?.storage}
		storage
	{/if}
</form>
