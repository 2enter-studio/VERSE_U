<script lang="ts">
	import { gameState } from '@/states';
	import { MIN_STAY_TIME } from '@repo/shared/config';

	type Props = { class?: string };
	let { class: className }: Props = $props();

	const tripStatus = $derived(gameState.tripStatus);
</script>

<div class="{className} flex flex-row">
	<button class="flex h-2 w-full justify-start bg-white">
		{#if tripStatus.progress < 1}
			<div
				class="flex h-full items-center bg-rose-500"
				style="width: {100 * tripStatus.progress}%;"
			></div>
		{:else}
			<div
				class="flex h-full items-center bg-sky-500"
				style="width: {~~(100 * ((MIN_STAY_TIME - tripStatus.timeRemain) / MIN_STAY_TIME))}%;"
			></div>
		{/if}
	</button>
</div>
