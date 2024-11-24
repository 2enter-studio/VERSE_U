<script>
	import { secToMin } from '@/utils';
	import { gameState, sysState } from '@/states';

	const tripStatus = $derived(gameState.tripStatus);
	const fromRegion = $derived(
		gameState.regions.find((region) => region.id === gameState.trip?.from)
	);
	const toRegion = $derived(gameState.regions.find((region) => region.id === gameState.trip?.to));
</script>

{#if tripStatus.progress < 1}
	{fromRegion?.name} --> {toRegion?.name}
	<small class="text-xs">
		{secToMin(Math.abs(tripStatus.timeRemain))}
	</small>
{:else if tripStatus.timeRemain === 0}
	{sysState.uiTexts.READY_TO_GO}
{:else}
	{sysState.uiTexts.MUST_STAY_FOR_A_SEC}
	<small class="text-xs">
		{secToMin(Math.abs(tripStatus.timeRemain))}
	</small>
{/if}
