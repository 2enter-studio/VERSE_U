<script lang="ts">
	import { Haptics } from '@capacitor/haptics';
	import type { Snippet } from 'svelte';

	type Props = { trigger: Function; timeOut?: number; disabled?: boolean; children: Snippet };
	let { trigger, timeOut = 500, children, disabled = false }: Props = $props();

	let touchStart = $state<number>(0);
	let touchEnd = $state<number>(0);

	function touchDetection(e: TouchEvent) {
		const node = e.target;
		if (!node) return;
		node.addEventListener('touchend', () => {
			touchEnd = Date.now();
		});
		touchStart = Date.now();
		setTimeout(async () => {
			if (touchEnd < touchStart) {
				await Haptics.vibrate({ duration: 50 });
				await trigger();
			}
		}, timeOut);
		return () => {};
	}
</script>

{#if !disabled}
	<div ontouchstart={touchDetection}>
		{@render children()}
	</div>
{:else}
	{@render children()}
{/if}
