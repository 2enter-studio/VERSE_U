<script lang="ts">
	import type { Component } from 'svelte';
	import type { Tables } from '@repo/shared/supatypes';
	import { type TableName, TABLES_INFO } from '@/config';

	import { typeOverRide } from '@repo/shared/utils';

	import Forms from '@/components/form';
	import { SubmitBtn } from '@/components';
	import { backEditing, setEditing } from '@/stores/edit_history';

	type Props = { tableName: TableName; tableData: Tables<TableName>; class?: string };
	let { tableName, tableData, class: className }: Props = $props();

	const tableInfo = TABLES_INFO[tableName];
	const { metadata } = tableInfo;

	let data = $state({ ...tableData });
	let dataCopy = $state($state.snapshot(data));

	const modified = $derived.by(() => {
		const result: any = {};
		for (const name of Object.keys(data)) {
			// @ts-ignore
			if (data?.[name] !== dataCopy?.[name]) {
				// @ts-ignore
				result[name] = data[name];
			}
		}
		if (Object.keys(result).length === 0) return null;
		return result;
	});

	function afterSubmit() {
		dataCopy = $state.snapshot(data);
	}

	const returnComponent = (c: any) => typeOverRide<Component>(c);

	const CancelData = () => {
		backEditing();
	};
</script>

<div class="h-[calc(100%-6rem)]">
	<div class="flex flex-row items-start h-full {className}">
		{#if data}
			<SubmitBtn
				action="?/remove"
				data={{ table: tableName, id: data.id }}
				icon="mdi:trashcan-outline"
				class="btn center-content hover:bg-rose-500 hover:text-white bg-rose-300 text-rose-800 px-1 absolute top-4 right-4 aspect-square"
				confirmMessage="You're about to delete a row from {tableName}, sure?"
			/>
			<div class="flex flex-col gap-3 items-start text-center w-full h-full p-4 overflow-y-auto">
				{#each Object.entries(metadata) as [name, content]}
					{@const isMLTexts = content.type === 'ml_texts'}
					{@const Form = returnComponent(Forms[content.type])}
					<div class="flex items-start gap-0.5 {isMLTexts ? 'flex-col' : 'flex-row flex-wrap'}">
						{#if !isMLTexts}
							<h2
								class="rounded text-center p-2 flex items-center mr-4 text-white text-bold bg-orange-600"
							>
								{name}
							</h2>
							{#if content.readonly}
								<Form data={data[name]} {name} class="bg-gray-500 pointer-events-none text-sm" />
							{:else}
								<Form bind:data={data[name]} {name}></Form>
							{/if}
						{:else}
							<h2
								class="rounded text-center p-2 flex items-center mr-4 text-white text-bold bg-cyan-600"
							>
								{name}
							</h2>
							<Forms.ml_texts data={{ row_id: data.id }} {name} />
						{/if}
					</div>
				{/each}

				{#if tableInfo?.reference}
					{#each Object.entries(tableInfo.reference) as [name, content]}
						<div class="flex items-start gap-0.5 flex-col">
							{#if content.type === 'single_ref'}
								<h2
									class="rounded text-center p-2 flex items-center mr-4 text-white text-bold bg-orange-600"
								>
									{name}
								</h2>
								<Forms.single_ref
									base={tableName}
									target={content.target}
									{name}
									bind:selected={data[name]}
								/>
							{:else if content.type === 'multi_ref'}
								<h2
									class="rounded text-center p-2 flex items-center mr-4 text-white text-bold bg-cyan-700"
								>
									{name}
								</h2>
								<Forms.multi_ref base={tableName} target={content.target} {name} id={data.id} />
							{/if}
						</div>
					{/each}
				{/if}

				{#if tableInfo?.storage && tableData}
					{#each Object.entries(tableInfo.storage) as [name, content]}
						{@const { path, suffix, type, bucket } = content}
						{@const filename = `${path}/${tableData.id}${suffix ?? ''}`}
						<h2
							class="rounded text-center p-2 flex items-center mr-4 text-white text-bold bg-cyan-700"
						>
							{name}
						</h2>
						{#if type === 'webp'}
							{@const Form = returnComponent(Forms[type])}
							<Form {bucket} {filename} />
						{:else}
							<Forms.model {bucket} {filename} filetype={type} />
						{/if}
					{/each}
				{/if}
			</div>
		{/if}
	</div>
	<div class="flex justify-between w-full p-2">
		<button class="btn btn-error text-white" onclick={CancelData}>Cancel</button>
		{#if data?.id}
			<SubmitBtn
				action="?/update"
				data={{ id: data.id, data: JSON.stringify(modified), table: tableName }}
				class="btn  text-white btn-success {modified ? '' : 'btn-disabled'} "
				{afterSubmit}
			>
				Save
			</SubmitBtn>
		{:else}
			<SubmitBtn
				action="?/create"
				data={{ table: tableName, data: JSON.stringify(data) }}
				class="btn text-white btn-success"
				afterSubmit={(data) => {
					setEditing({ tableName, id: data.id });
				}}
			>
				Create
			</SubmitBtn>
		{/if}
	</div>
</div>
