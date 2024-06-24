<script lang="ts">
	import type { Component } from 'svelte';
	import type { Tables } from '@repo/shared/supatypes';
	import { type TableName, TABLES_INFO } from '@/config';

	import { typeOverRide } from '@repo/utils/types';

	import Forms from '@/components/form';
	import { SubmitBtn } from '@/components';
	import Icon from '@iconify/svelte';
	import { backEditing } from '@/stores/edit_history';

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
</script>

{#if data}
	<div class="flex flex-row items-start divide-white divide-x-2 overflow-y-auto {className}">
		<div class="flex flex-col p-0.5">
			<Icon
				icon="lets-icons:back"
				class="text-2xl center-content hover:bg-violet-600"
				onclick={backEditing}
			/>
			{#if modified}
				<SubmitBtn
					action="?/update"
					data={{ id: data.id, data: JSON.stringify(modified), table: tableName }}
					icon="mingcute:save-2-line"
					class="center-content	pointer-events-auto hover:bg-cyan-800"
					{afterSubmit}
				/>
			{/if}
		</div>
		<div class="flex flex-col gap-3 items-start text-center w-full p-2">
			{#each Object.entries(metadata) as [name, content]}
				{@const isMLTexts = content.type === 'ml_texts'}
				{@const form = returnComponent(Forms[content.type])}
				<div class="flex items-start gap-0.5 {isMLTexts ? 'flex-col' : 'flex-row flex-wrap'}">
					{#if !isMLTexts}
						<h2 class="text-bold bg-orange-600 px-1">{name}</h2>
						{#if content.readonly}
							<svelte:component
								this={form}
								data={data[name]}
								{name}
								class="bg-gray-500 pointer-events-none text-sm"
							/>
						{:else}
							<svelte:component
								this={form}
								bind:data={data[name]}
								{name}
							/>
						{/if}
					{:else}
						<h2 class="text-bold bg-cyan-600 px-1">{name}</h2>
						<svelte:component this={Forms.ml_texts} data={{ row_id: data.id }} {name} />
					{/if}
				</div>
			{/each}

			{#if tableInfo?.reference}
				{#each Object.entries(tableInfo.reference) as [name, content]}
					<div class="flex items-start gap-0.5 flex-col">
						{#if content.type === 'single_ref'}
							<h2 class="text-bold bg-orange-600 px-1">{name}</h2>
							<svelte:component
								this={Forms.single_ref}
								base={tableName}
								target={content.target}
								{name}
								bind:selected={data[name]}
							/>
						{:else if content.type === 'multi_ref'}
							<h2 class="text-bold bg-cyan-700 px-1">{name}</h2>
							<svelte:component
								this={Forms.multi_ref}
								base={tableName}
								target={content.target}
								{name}
								id={data.id}
							/>
						{/if}
					</div>
				{/each}
			{/if}

			{#if tableInfo?.storage}
				{#each Object.entries(tableInfo.storage) as [name, content]}
					{@const { path, suffix, type, bucket } = content}
					{@const filename = `${path}/${tableData.id}${suffix ?? ''}`}
					<h2 class="text-bold bg-cyan-700 px-1">{name}</h2>
					{#if type === 'webp'}
						<svelte:component this={Forms[type]} {bucket} {filename} />
					{:else}
						<svelte:component this={Forms.model} {bucket} {filename} filetype={type} />
					{/if}
				{/each}
			{/if}
		</div>
	</div>
{/if}
