<script lang="ts">
	import { page } from '$app/stores';
	import { LOCALES } from '@/config';
	import type { PageData } from '../../../routes/$types';
	import type { Props } from '@/components/form/types';
	import { HiddenInput } from '@/components';

	let { data, name, class: className }: Props<{ row_id: string; column_name: string }> = $props();

	const { row_id, column_name } = data;

	const targetMLTexts = ($page.data as PageData).ml_texts.filter(
		(text) => text.row_id === row_id && text.column_name === column_name
	);
</script>

<div class="{className} flex flex-col text-left gap-1">
	{#each LOCALES as locale}
		{@const i = targetMLTexts.findIndex((text) => text.locale === locale)}
		<HiddenInput name="table" value="ml_texts" />
		<HiddenInput {name} value={targetMLTexts[i].value ?? ''} />
		<div class="flex flex-row gap-1">
			{locale}
			{#if targetMLTexts[i]}
				<input type="text" bind:value={targetMLTexts[i].value} />
			{:else}
				<input type="text" />
			{/if}
		</div>
	{/each}
</div>
