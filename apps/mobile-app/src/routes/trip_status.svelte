<script lang="ts">
	import { gameState, sysState } from '@/states';
	import { secToMin } from '@/utils';
	import { MIN_STAY_TIME } from '@repo/shared/config';
	import { Dialog } from '@/components';

	type Props = { class?: string };
	let { class: className }: Props = $props();
	let openDetail = $state(false);

	const tripStatus = $derived(gameState.tripStatus);
	const fromRegion = $derived(
		gameState.regions.find((region) => region.id === gameState.trip?.from)
	);
	const toRegion = $derived(gameState.regions.find((region) => region.id === gameState.trip?.to));
</script>

<div class="{className} flex flex-row">
	<button
		class="flex h-2 w-full justify-start bg-white"
		onclick={() => (openDetail = !openDetail)}
	>
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

{#if openDetail}
	<Dialog
		title={sysState.uiTexts.TRIP_INFO}
		open={openDetail}
		class="flex-col text-center text-black"
	>
		{#if tripStatus.progress < 1}
			{fromRegion?.name} --> {toRegion?.name}
			<small class="text-xs">{secToMin(Math.abs(tripStatus.timeRemain))}</small>
		{:else if tripStatus.timeRemain === 0}
			{sysState.uiTexts.READY_TO_GO}
		{:else}
			{sysState.uiTexts.MUST_STAY_FOR_A_SEC}
			<small class="text-xs">{secToMin(Math.abs(tripStatus.timeRemain))}</small>
		{/if}
	</Dialog>
{/if}
