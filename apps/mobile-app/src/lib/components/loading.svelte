<script lang="ts">
	import { onMount } from 'svelte';

	export let mode: 'big' | 'medium' | 'small' = 'big';
	let mounted = false;
	onMount(async () => {
		mounted = true;
	});
</script>

{#if mounted}
	{#if mode === 'big'}
		<slot />
	{/if}
{:else if mode === 'big'}
	<h1 class="text-3xl">Page loading...</h1>
{/if}
