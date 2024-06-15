<script lang="ts">
	import type { Props } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: Props<number> = $props();
</script>

<input type="number" bind:value={data} class={className} step="0.00000001" />
