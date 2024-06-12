<script lang="ts">
	import type { Props } from '@/components/form/types';

	let { name, data = $bindable() }: Props<any> = $props();
</script>

<input type="number" bind:value={data} {name} />
