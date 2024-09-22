<script lang="ts">
	import type { Locale } from '@/config';
	import { SubmitBtn } from '@/components';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Tables } from '@repo/shared/supatypes';

	type Props = { column_name: string; row_id: string; locale: Locale };
	let { column_name, row_id, locale }: Props = $props();

	const ml_texts = getContext<Writable<Tables<'ml_texts'>[]>>('ml_texts');

	const index = $ml_texts.findIndex(
		(ml_text) =>
			ml_text.row_id === row_id && ml_text.column_name === column_name && ml_text.locale === locale
	);

	let value = $state($ml_texts[index]?.value ?? '');
	const modified = $derived($ml_texts[index]?.value !== value);

	function afterSubmit() {
		if (index === -1) return;
		$ml_texts[index].value = value;
	}
</script>

<div class="flex flex-row gap-1 justify-center my-2">
	{#if index !== -1}
		<label>
			{locale}
			<input type="text" class="input input-bordered input-sm" bind:value />
		</label>
		{#if modified}
			<SubmitBtn
				icon="mingcute:save-2-line"
				action="?/update"
				data={{
					table: 'ml_texts',
					data: JSON.stringify({ value }),
					id: $ml_texts[index]?.id ?? ''
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
					value,
					column_name,
					row_id,
					locale
				})
			}}
		/>
	{/if}
</div>
