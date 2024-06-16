<script lang="ts">
	import type { PageData } from './$types';
	import type { Tables } from '@repo/supabase';

	import { TABLE_NAMES, type TableName, TABLES_INFO } from '@/config';
	import { snakeCaseToCapitalize } from '@repo/utils/text';
	import { editing, setEditing } from '@/stores/edit_history';
	import { SubmitBtn } from '@/components/index.js';
	import { invalidateAll } from '$app/navigation';

	import { Editor, SystemLog } from './';

	let { data }: { data: PageData } = $props();
	const { ml_texts } = data;

	// const TablesMap = Object.entries(TABLES_INFO) as Array<[TableName, TableContent]>;

	function getRowName(row: Tables<TableName>) {
		const texts = ml_texts
			?.filter((ml_text) => ml_text.row_id === row.id && ml_text.column_name === 'name')
			?.map((texts) => texts.value);
		if (texts.length > 0) return texts.join('/');
		return (row as { value?: string })?.value ?? '?????????';
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
						<div class="flex flex-row">
							<button
								class="hover:bg-white hover:text-black border-white border-2 px-2 text-left w-full {selected
									? 'bg-white text-black'
									: ''}"
								onclick={() => setEditing({ tableName, id })}
							>
								{name}
							</button>
							{#if selected}
								<SubmitBtn
									action="?/remove"
									data={{ table: tableName, id }}
									icon="mdi:trashcan-outline"
									class="center-content hover:bg-red-500 hover:text-white p-1 border-2 border-white"
									needConfirm
									afterSubmit={async () => {
										await invalidateAll();
									}}
								/>
							{/if}
						</div>
					{/each}
				</div>
				{#if !TABLES_INFO[tableName].readonly}
					<SubmitBtn
						action="?/create"
						data={{ table: tableName }}
						icon="memory:plus-box"
						class="text-right"
					/>
				{/if}
			{/each}
		</div>

		<div class="fixed right-0 top-0 w-[40vw]">
			<SystemLog class="bg-black p-1 max-h-[10vh] overflow-y-auto overflow-x-hidden" />

			{#key $editing}
				{#if $editing?.id}
					{@const { tableName } = $editing}
					{@const index = tablesData[$editing.tableName].findIndex(
						(table) => table.id === $editing?.id
					)}
					<Editor {tableName} tableData={tablesData[tableName][index]} class="border-2" />
				{/if}
			{/key}
		</div>
	{/if}
{/await}
