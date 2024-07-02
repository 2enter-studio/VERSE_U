<script lang="ts">
	import { sysState } from '@/states';
	import type { Snippet } from 'svelte';
	type Props = {
		children: Snippet;
		class?: string;
		disabled?: boolean;
		onclick?: Function;
	};
	let { children, class: className, onclick = () => {}, ...props }: Props = $props();
</script>

{#if !sysState.processing}
	<button type="submit" class={className} onclick={() => onclick()} {...props}>
		{@render children()}
	</button>
{/if}
