<script lang="ts">
	import deepEqual from 'deep-equal';
	import { type TableName, TABLES_INFO } from '@/config';
	import { Number, PlainText, Toggle } from '@/components/form';

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
</script>

{description}

<div class="center-content flex-col">
	{#each Object.entries(metadata) as [name, content]}
		{name}
		{#if content.type === 'toggle'}
			<Toggle bind:value={data[name]} />
		{:else if content.type === 'number'}
			<Number bind:value={data[name]} />
		{:else if content.type === 'plain_text'}
			<PlainText bind:value={data[name]} />
			<!--{:else if content.type === 'ml_texts'}-->
			<!--	<MLTexts bind:data={data[name]} />-->
		{/if}
	{/each}

	{#if data?.reference}
		reference
	{/if}

	{#if data?.storage}
		storage
	{/if}
</div>
