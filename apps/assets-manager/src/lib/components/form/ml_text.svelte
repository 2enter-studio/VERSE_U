<script lang="ts">
	import type { Locale } from '@/config';
	import { page } from '$app/stores';
	import type { PageData } from '../../../routes/$types';
	import { SubmitBtn } from '@/components';
	import { onMount } from 'svelte';

	type Props = { column_name: string; row_id: string; locale: Locale };
	let { column_name, row_id, locale }: Props = $props();

	const { ml_texts } = $page.data as PageData;

	const index = ml_texts.findIndex(
		(ml_text) =>
			ml_text.row_id === row_id && ml_text.column_name === column_name && ml_text.locale === locale
	);

	let valueCopy = $state(ml_texts[index]?.value ?? '');
	const modified = $derived(ml_texts[index]?.value !== valueCopy);

	onMount(() => {
		return () => {
			if (index === -1) return;
			ml_texts[index].value = valueCopy;
		};
	});

	function afterSubmit() {
		valueCopy = ml_texts[index]?.value ?? '';
	}
</script>

<div class="flex flex-row gap-1">
	{locale}
	{#if index !== -1}
		<input type="text" bind:value={ml_texts[index].value} />
		{#if modified}
			<SubmitBtn
				icon="mingcute:save-2-line"
				action="?/update"
				data={{
					table: 'ml_texts',
					data: JSON.stringify({
						value: ml_texts[index]?.value ?? ''
					}),
					id: ml_texts[index]?.id ?? ''
				}}
				class="hover:bg-amber-700 center-content"
				{afterSubmit}
			/>
		{/if}
	{:else}
		<SubmitBtn
			icon="memory:plus-box"
			action="?/create"
			data={{
				table: 'ml_texts',
				data: JSON.stringify({
					value: ml_texts[index]?.value ?? '',
					column_name,
					row_id,
					locale
				})
			}}
		/>
	{/if}
</div>
