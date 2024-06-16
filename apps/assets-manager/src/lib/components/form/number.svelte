<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: MetaDataProps<number> = $props();
</script>

<input type="number" bind:value={data} class={className} step="0.000001" />
