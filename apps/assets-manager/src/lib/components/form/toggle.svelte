<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: MetaDataProps<boolean> = $props();
</script>

<input type="checkbox" bind:checked={data} class={className} />
