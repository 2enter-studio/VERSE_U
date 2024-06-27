<script lang="ts">
	import { gameState, sysState } from '@/states';
	import { secToMin } from '@/utils';
	import { MIN_STAY_TIME } from '@repo/shared/config';
	import { Dialog } from '@/components';

	type Props = { class?: string };
	let { class: className }: Props = $props();
	let openDetail = $state(false);

	const tripStatus = $derived(gameState.tripStatus);
</script>

<div class="{className} flex flex-row">
	<button
		class="flex h-1.5 w-full justify-start bg-white"
		onclick={() => (openDetail = !openDetail)}
	>
		{#if tripStatus.progress < 1}
			<div
				class="flex h-full items-center bg-rose-500"
				style="width: {100 * tripStatus.progress}%;"
			></div>
		{:else}
			<div
				class="flex h-full items-center bg-cyan-500"
				style="width: {~~(100 * ((MIN_STAY_TIME - tripStatus.timeRemain) / MIN_STAY_TIME))}%;"
			></div>
		{/if}
	</button>
</div>

{#if openDetail}
	<Dialog title="Info" open={openDetail} class="flex-col text-center text-black">
		{#if tripStatus.progress < 1}
			You're on the way to the {gameState.trip?.to}
			<small class="text-xs">{secToMin(Math.abs(tripStatus.timeRemain))}</small>
		{:else if tripStatus.timeRemain === 0}
			You're ready to go
		{:else}
			Stay for a sec, then you can start a new trip.
			<small class="text-xs">{secToMin(Math.abs(tripStatus.timeRemain))}</small>
		{/if}
	</Dialog>
{/if}
