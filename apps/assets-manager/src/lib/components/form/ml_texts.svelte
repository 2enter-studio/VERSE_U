<script lang="ts">
	import { LOCALES } from '@/config';
	import type { Tables } from '@repo/supabase';
	import type { Props } from '@/components/form/types';

	let { data = $bindable() }: Props<Tables<'ml_texts'>> = $props();
</script>

{#each LOCALES as locale}
	{locale}
	<input type="text" bind:value={data.value} />
{/each}
