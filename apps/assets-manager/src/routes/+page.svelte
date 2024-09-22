<script lang="ts">
	import type { PageData } from './$types';

	import { TABLE_NAMES, TABLES_INFO, type TableName } from '@/config';
	import { snakeCaseToCapitalize } from '@repo/shared/utils';
	import { editing, setEditing } from '@/stores/edit_history';
	import { tables, setTables } from '@/stores/data';

	import { Editor, SystemLog } from './';
	import Icon from '@iconify/svelte';
	import { getRowName } from '@/index';
	import { writable } from 'svelte/store';
	import type { Tables } from '@repo/shared/supatypes';
	import { setContext } from 'svelte';

	let { data }: { data: PageData } = $props();

	let tablesData = $state<Tables>(null);
	$effect(() => {
		async function fetchData() {
			await data.tables.then((t) => {
				setTables({ ml_texts: data.ml_texts, tables: t });
				tablesData = t;
			});
		}
		fetchData();
	});

	$effect(() => {
		tablesData = $tables.tables;
	});

	const initSearchIds: Record<string, string | null> = {};
	Object.keys(TABLE_NAMES).forEach((tableName) => {
		initSearchIds[tableName] = null;
	});
	let searchIds = $state(initSearchIds);

	const ml_texts = writable<Tables<'ml_texts'>[]>();
	$effect(() => {
		ml_texts.set(data.ml_texts);
	});
	setContext('ml_texts', ml_texts);

	const onAdd = (tableName: TableName) => {
		setEditing({ tableName, id: '' });
	};
</script>

{#if !tablesData}
	<div class="full-screen center-content">
		<Icon icon="mingcute:loading-fill" class="text-6xl animate-spin" />
	</div>
{:else}
	<div class="flex flex-row full-screen">
		<div
			class="w-96 gap-1 backdrop-blur-sm bg-white/5 shadow-inner shadow-black/40 rounded-lg m-4 overflow-scroll p-2 h-[calc(100%-2rem)]"
		>
			{#each TABLE_NAMES as tableName}
				<div class="collapse collapse-plus">
					<input type="checkbox" />
					<div class="flex flex-row justify-between mt-4 items-center collapse-title text-md">
						{snakeCaseToCapitalize(tableName)} - {TABLES_INFO[tableName].description}
					</div>
					<div class="collapse-content">
						<div class="flex flex-rol mb-4 items-center">
							<span
								class="rounded bg-white text-center p-2 flex items-center mr-4 text-info-content text-xs"
								>search (id)</span
							>
							<input
								type="text"
								class="input input-bordered input-sm max-w-xs"
								bind:value={searchIds[tableName]}
							/>
						</div>
						<div class="flex flex-col gap-1">
							{#each tablesData[tableName].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) as row}
								{@const selected = $editing?.id === row.id}
								{@const { id } = row}
								{@const name = getRowName(row)}
								<div
									class="flex flex-row mb-1 {id.includes(searchIds[tableName] ?? '') ||
									!searchIds[tableName]
										? ''
										: 'hidden'}"
								>
									<button
										class="btn btn-sm hover:bg-white hover:text-accent-content border-base-content border-2 px-1 w-full {selected
											? 'bg-white text-info-content'
											: ''}"
										onclick={() => setEditing({ tableName, id })}
									>
										{name}
									</button>
								</div>
							{/each}
						</div>
						{#if !TABLES_INFO[tableName].readonly}
							<button
								class="btn btn-sm btn-accent w-full text-white"
								onclick={() => onAdd(tableName)}>Add +</button
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<div class="w-[calc(100%-424px)] h-full">
			<div
				class="backdrop-blur-sm bg-white/5 shadow-inner shadow-black/40 rounded-lg m-4 h-108 overflow-auto h-4/5 p-2"
			>
				<h1 class="flex text-xl justify-center">
					Editor - {$editing && TABLES_INFO[$editing.tableName].description}
				</h1>
				{#key $editing}
					{#if $editing?.id}
						{@const { tableName } = $editing}
						{@const index = tablesData[$editing.tableName].findIndex(
							(table) => table.id === $editing?.id
						)}
						<Editor {tableName} tableData={tablesData[tableName][index]} />
					{:else if $editing?.tableName}
						{@const { tableName } = $editing}
						<Editor {tableName} />
					{/if}
				{/key}
			</div>
			<div
				class="flex flex-col items-center m-4 p-2 backdrop-blur-sm bg-white/5 shadow-inner shadow-black/40 rounded-lg h-[calc(20%-3rem)]"
			>
				<h1 class="text-xl">System Log</h1>
				<SystemLog class="p-1 overflow-y-auto overflow-x-hidden" />
			</div>
		</div>
	</div>
{/if}
