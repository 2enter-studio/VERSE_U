<script lang="ts">
	import deepEqual from 'deep-equal';
	import { type TableName, TABLES_INFO } from '@/config';
	import Forms from '@/components/form';
	import type { Component } from 'svelte';
	import { typeOverRide } from '@repo/utils';

	type Props = { table: TableName; data: any };
	let { table, data }: Props = $props();

	const tableInfo = TABLES_INFO[table];
	const { description, metadata } = tableInfo;

	let dataCopy = { ...data };

	const modified = $derived(!deepEqual($state.snapshot(data), dataCopy));

	$effect(() => {
		console.log(modified ? 'modified' : 'un-modified');
	});

	async function onSubmit() {
		dataCopy = { ...data };
	}

	const returnComponent = (c: any) => typeOverRide<Component>(c);
</script>

{description}

<div class="center-content flex-col">
	{#each Object.entries(metadata) as [name, content]}
		{@const form = returnComponent(Forms[content.type])}
		{name}
		{#if content.type !== 'ml_texts'}
			<svelte:component this={form} bind:data={data[name]} {name} />
		{/if}
	{/each}

	{#if data?.reference}
		reference
	{/if}

	{#if data?.storage}
		storage
	{/if}
</div>
