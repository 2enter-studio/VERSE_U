<script lang="ts">
	import { page } from '$app/stores';
	import { LOCALES } from '@/config';
	import type { PageData } from '../../../routes/$types';

	type Props = { data: { row_id: string; column_name: string }; class?: string };
	let { data, class: className }: Props = $props();

	const { row_id, column_name } = data;

	const mlTexts = ($page.data as PageData).ml_texts.filter(
		(text) => text.row_id === row_id && text.column_name === column_name
	);

	let sortedMLTexts = $state(
		LOCALES.map((locale) => {
			return mlTexts.find((m) => m.locale === locale);
		})
	);
	console.log(sortedMLTexts);
</script>

<div class="{className} flex flex-col text-left gap-1">
	{#each LOCALES as locale, i}
		{#if sortedMLTexts[i]}
			<div class="flex flex-row gap-1">
				{locale}
				<input type="text" bind:value={sortedMLTexts[i].value} />
			</div>
		{/if}
	{/each}
</div>
