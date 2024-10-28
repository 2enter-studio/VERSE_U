<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';

	let { name, data = $bindable(), class: className }: MetaDataProps<string> = $props();
</script>

<div class="flex h-10 items-center">
	<input type="text" bind:value={data} class="{`input input-bordered input-sm ${className}`} " />
</div>
