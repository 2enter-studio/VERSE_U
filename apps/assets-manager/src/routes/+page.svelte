<script lang="ts">
	import type { PageData } from './$types';
	import type { Tables } from '@repo/supabase';

	import { TABLE_NAMES, type TableName, TABLES_INFO } from '@/config';
	import { snakeCaseToCapitalize } from '@repo/utils/text';
	import { backEditing, editing, setEditing } from '@/stores/edit_history';
	import { SubmitBtn } from '@/components/index.js';

	import { Editor, SystemLog } from './';
	import Icon from '@iconify/svelte';
	import { getRowName } from '@/index';

	let { data }: { data: PageData } = $props();
	let showSysLog = $state(true);

	// const TablesMap = Object.entries(TABLES_INFO) as Array<[TableName, TableContent]>;

</script>

{#await data.tables}
	<div class="full-screen center-content">
		<Icon icon="mingcute:loading-fill" class="text-6xl animate-spin" />
	</div>
{:then tablesData}
	{#if tablesData}
		<div class="flex flex-col w-[50vw]">
			{#each TABLE_NAMES as tableName}
				<div class="flex flex-row justify-between mt-5 items-center">
					{snakeCaseToCapitalize(tableName)} - {TABLES_INFO[tableName].description}
					{#if !TABLES_INFO[tableName].readonly}
						<div class="flex flex-row justify-end">
							<SubmitBtn
								action="?/create"
								data={{ table: tableName }}
								icon="memory:plus-box"
								class="hover:text-amber-400 center-content"
								confirmMessage="You're about to insert a row into {tableName}, sure?"
							/>
						</div>
					{/if}
				</div>
				<div class="flex flex-col gap-1">
					{#each tablesData[tableName].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as row}
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
									class="center-content hover:bg-rose-500 hover:text-white bg-rose-300 text-rose-800 px-1"
									confirmMessage="You're about to delete a row from {tableName}, sure?"
									afterSubmit={backEditing}
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<div class="fixed right-0 top-0 w-[45vw]">
			<div class="flex flex-row justify-between">
				<Icon
					icon={showSysLog ? 'mingcute:eye-fill' : 'mingcute:eye-close-fill'}
					onclick={() => (showSysLog = !showSysLog)}
					class="text-2xl center-content hover:bg-orange-600"
				/>
				{#if showSysLog}
					<SystemLog class="bg-black p-1 max-h-[10vh] overflow-y-auto overflow-x-hidden" />
				{/if}
			</div>

			{#key $editing}
				{#if $editing?.id}
					{@const { tableName } = $editing}
					{@const index = tablesData[$editing.tableName].findIndex(
						(table) => table.id === $editing?.id
					)}
					<Editor
						{tableName}
						tableData={tablesData[tableName][index]}
						class="border-2 border-white"
					/>
				{/if}
			{/key}
		</div>
	{/if}
{/await}
