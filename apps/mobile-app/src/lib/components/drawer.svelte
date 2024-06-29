<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Icon from '@iconify/svelte';

	import { sysState } from '@/states';

	type Props = { children: Snippet; class?: string; open: boolean; onclose?: () => void };
	let { children, class: className, open = $bindable(false), onclose }: Props = $props();

	function close() {
		if (onclose) onclose();
		open = false;
	}
	onMount(() => {
		sysState.showMenu = false;
		return () => {
			sysState.showMenu = true;
		};
	});
</script>

{#if open}
	<div class="{className} center-content fixed bottom-0 flex-col rounded-t-2xl pb-4">
		<div class="w-full">
			<Icon
				icon="mdi:close"
				onclick={close}
				class="size-6 rounded-full bg-red-500 p-1 text-white"
			/>
		</div>
		{@render children()}
	</div>
{/if}
