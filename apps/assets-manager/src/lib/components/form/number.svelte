<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: MetaDataProps<number> = $props();
</script>
<div class="flex h-10 items-center">
	<input type="number" bind:value={data} class={`input input-bordered input-sm ${className}`} step="0.000001" />
</div>