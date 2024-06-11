<script lang="ts">
  import { LOCALES } from '@/config';
  import type { Tables } from '@repo/supabase';

  type Props = { data: Tables<'ml_texts'> };
	let { data = $bindable() }: Props = $props();
</script>

{#each LOCALES as locale}
	{locale}
	<input type="text" bind:value={data.value} />
{/each}
