<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}
	let { children }: Props = $props();
</script>

<h1 class="text-xl font-bold mb-2">
	{@render children()}
</h1>
