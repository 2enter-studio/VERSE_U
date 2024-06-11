<script lang="ts">
	import Editor from './editor.svelte';
	import type { PageData } from './$types';
	import { type TableContent, type TableName, TABLES_INFO } from '@/config';

	let { data }: { data: PageData } = $props();

	const TablesMap = Object.entries(TABLES_INFO) as Array<[TableName, TableContent]>;
</script>

{#if data.tables}
	<!--	{#each TablesMap as [table, info]}-->
	<!--		{table}-->
	<!--		<br />-->
	<!--		<Editor {table} data={data.tables.regions[0]} />-->
	<!--	{/each}-->
	<Editor table="regions" data={data.tables.regions[0]} />
{/if}
