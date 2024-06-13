<script lang="ts">
	import type { Props } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: Props<boolean> = $props();
</script>

<input type="checkbox" {name} bind:checked={data} class={className} />
