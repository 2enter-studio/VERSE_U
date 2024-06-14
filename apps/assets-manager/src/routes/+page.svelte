<script lang="ts">
	import type { PageData } from './$types';
	import type { Tables } from '@repo/supabase';

	import { TABLE_NAMES, type TableName, TABLES_INFO } from '@/config';
	import { snakeCaseToCapitalize } from '@repo/utils/text';
	import { editing, setEditing } from '@/stores/edit_history';
	import Editor from './editor.svelte';

	let { data }: { data: PageData } = $props();
	const { ml_texts } = data;

	// console.log(getStores());
	// onMount(()=>{
	// 	setTimeout(() => {
	// 		invalidateAll();
	// 	}, 5000)
	// })

	// const TablesMap = Object.entries(TABLES_INFO) as Array<[TableName, TableContent]>;

	function getRowName(row: Tables<TableName>) {
		const texts = ml_texts
			?.filter((ml_text) => ml_text.row_id === row.id && ml_text.column_name === 'name')
			?.map((texts) => texts.value);
		if (texts.length > 0) return texts.join('/');
		return (row as { value?: string })?.value ?? '?';
	}
</script>

{#await data.tables}
	loading
{:then tablesData}
	{#if tablesData}
		<div class="flex flex-col gap-3 w-[50vw]">
			{#each TABLE_NAMES as tableName}
				{snakeCaseToCapitalize(tableName)} - {TABLES_INFO[tableName].description}
				<div class="flex flex-col gap-1">
					{#each tablesData[tableName] as row}
						{@const selected = $editing?.id === row.id}
						{@const { id } = row}
						{@const name = getRowName(row)}
						<button
							class="hover:bg-white hover:text-black border-white border-2 px-2 text-left {selected
								? 'bg-white text-black'
								: ''}"
							onclick={() => setEditing({ tableName, id })}
						>
							{name}
						</button>
					{/each}
				</div>
			{/each}
		</div>

		{#key $editing}
			{#if $editing?.id}
				{@const { tableName } = $editing}
				{@const index = tablesData[$editing.tableName].findIndex(
					(table) => table.id === $editing?.id
				)}
				<Editor
					class="fixed top-0 right-0 h-screen w-[30vw] border-l-2 border-white px-3"
					{tableName}
					tableData={tablesData[tableName][index]}
				/>
			{/if}
		{/key}
	{/if}
{/await}
