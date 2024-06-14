<script lang="ts">
	import type { PageData } from './$types';
	import type { Tables } from '@repo/supabase';

	import { TABLE_NAMES, type TableName, TABLES_INFO } from '@/config';
	import { snakeCaseToCapitalize } from '@repo/utils/text';
	import { editing, setEditing } from '@/stores/edit_history';
	import Editor from './editor.svelte';

	let { data }: { data: PageData } = $props();

	// console.log(getStores());
	// onMount(()=>{
	// 	setTimeout(() => {
	// 		invalidateAll()	
	// 	}, 5000)
	// })

	const TablesMap = Object.entries(TABLES_INFO) as Array<[TableName, TableContent]>;
</script>

{#await data.tables}
	loading
{:then tables}
	{#if tables}
		{#if $editing}
			{@const { tableName } = $editing}
			{@const index = tables[tableName].findIndex((table) => table.id === $editing?.id)}
			<Editor
				class="fixed right-0 h-screen w-[30vw] border-l-2 border-white px-3"
				tableName="regions"
				tableData={tables[$editing.tableName][index]}
			/>
		{/if}
	{/if}
{/await}
