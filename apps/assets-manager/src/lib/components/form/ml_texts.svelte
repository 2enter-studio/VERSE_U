<script lang="ts">
	import { page } from '$app/stores';
	import { LOCALES } from '@/config';
	import type { PageData } from '../../../routes/$types';

	type Props = { data: { row_id: string; column_name: string }; class?: string };
	let { data, class: className }: Props = $props();

	const { row_id, column_name } = data;

	const targetMLTexts = ($page.data as PageData).ml_texts.filter(
		(text) => text.row_id === row_id && text.column_name === column_name
	);

	let sortedMLTexts = $state(
		LOCALES.map((locale) => {
			return targetMLTexts.find((m) => m.locale === locale);
		})
	);
</script>

<div class="{className} flex flex-col text-left gap-1">
	{#each LOCALES as locale}
		{@const i = targetMLTexts.findIndex((text) => text.locale === locale)}
		<div class="flex flex-row gap-1">
			{locale}
			{#if sortedMLTexts[i]}
				<input type="text" bind:value={sortedMLTexts[i].value} />
			{:else}
				<input type="text" />
			{/if}
		</div>
	{/each}
</div>
