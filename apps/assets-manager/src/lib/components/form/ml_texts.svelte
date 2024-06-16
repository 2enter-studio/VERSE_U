<script lang="ts">
	import { LOCALES } from '@/config';
	import type { Props } from '@/components/form/types';
	import MLText from './ml_text.svelte';

	let { data, name, class: className }: Props<{ row_id: string }> = $props();

	const { row_id } = data;
</script>

<div class="{className} flex flex-col text-left gap-1">
	{#each LOCALES as locale}
		<div class="flex flex-row gap-1">
			<MLText column_name={name} {locale} {row_id} />
		</div>
	{/each}
</div>
