<script lang="ts">
	import type { Props } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: Props<number> = $props();
</script>

<input type="number" bind:value={data} {name} class={className} />
