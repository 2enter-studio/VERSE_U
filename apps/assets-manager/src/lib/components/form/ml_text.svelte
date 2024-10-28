<script lang="ts">
	import type { Locale } from '@/config';
	import { SubmitBtn } from '@/components';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Tables } from '@repo/shared/supatypes';
	import { tables } from '@/stores';

	type Props = { column_name: string; row_id: string; locale: Locale };
	let { column_name, row_id, locale }: Props = $props();

	const ml_text = $derived.by(() =>  $tables.ml_texts.find(
			(ml_text) => {
				return ml_text.row_id === row_id && ml_text.column_name === column_name && ml_text.locale === locale
			}	
		)
	);

	let value = $state.raw(ml_text?.value ?? '');
	const modified = $derived(ml_text?.value !== value);

</script>

<div class="flex flex-row gap-1 justify-center my-2">
	{#if ml_text}
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
					id: ml_text.id
				}}
				class="hover:bg-amber-700 center-content"
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
