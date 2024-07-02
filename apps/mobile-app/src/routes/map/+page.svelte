<script lang="ts">
	import Icon from '@iconify/svelte';

	import { MAP_SIZE, USE_SMOOTH_MAP_MOTION } from '@/config';
	import { gameState, sysState } from '@/states';
	import { startNextTrip } from './utils';
	import { getFilePublicUrl, getFileUrl, getTextFromObj, load, subscribe } from '@/utils';

	import { Avatar, Dialog } from '@/components';
	import { onMount } from 'svelte';

	const tripOptions = [0, 1] as const;

	let chooseNext = $state(false);
	const transitionClasses = USE_SMOOTH_MAP_MOTION ? 'transition-all duration-1000 ease-linear' : '';

	let dom = $state<HTMLElement>();
	let width = $derived(dom?.clientWidth || 0);
	let height = $derived(dom?.clientHeight || 0);

	const from = $derived(gameState.regions.find((r) => r.id === gameState.trip?.from) as Region);
	const to = $derived(gameState.regions.find((r) => r.id === gameState.trip?.to) as Region);

	const position = $derived.by(() => {
		if (!from) return { x: MAP_SIZE / 2, y: MAP_SIZE / 2 };
		return {
			x: (from.x + (to.x - from.x) * gameState.tripStatus.progress) * MAP_SIZE,
			y: (from.y + (to.y - from.y) * gameState.tripStatus.progress) * MAP_SIZE
		};
	});
	const origin = $derived({
		x: position.x - width / 2,
		y: position.y - height / 2
	});

	onMount(() => {
		const newTripSub = subscribe.newTrip();
		if (!newTripSub) console.error('Trip was not subscribed');
		newTripSub?.subscribe();

		return async () => {
			await newTripSub?.unsubscribe();
		};
	});
</script>

<div
	bind:this={dom}
	class="absolute z-[-10] h-screen w-screen bg-no-repeat {transitionClasses}"
	style="
		background-image: url('/map.webp');
		background-position: -{position.x}px -{position.y}px;
	"
></div>

{#if gameState.regions.length > 0 && gameState.trip}
	<Dialog
		bind:open={chooseNext}
		title={sysState.uiTexts.WHERE_ARE_YOU_GOING}
		class="divide-x divide-black/60"
	>
		{#each tripOptions as num}
			{#if gameState.trip}
				{@const region_id = gameState.trip[`next_${num}`]}
				<button
					class={sysState.processing ? 'hidden' : ''}
					onclick={async () => {
						chooseNext = false;
						await sysState.process(async () => {
							await startNextTrip(num);
							sysState.defaultSuccess();
						});
					}}
				>
					<span class="center-content flex-col text-black">
						{#await getFileUrl('regions', `stickers/${region_id}`) then { data }}
							<span
								style="background-image: url({data})"
								class="size-32 bg-contain bg-center bg-no-repeat"
							></span>
						{/await}
						{getTextFromObj(gameState.regions, 'name', region_id)}
					</span>
				</button>
			{/if}
		{/each}
	</Dialog>

	{#each gameState.regions as region}
		{@const fixedPos = {
			x: region.x * MAP_SIZE - origin.x - width / 10,
			y: region.y * MAP_SIZE - origin.y - height / 8
		}}
		{#if fixedPos.x < width * 2 && fixedPos.y < height * 2 && fixedPos.x > -width && fixedPos.y > -height}
			<div
				class="center-content fixed z-[-10] w-[35vw] flex-col {transitionClasses}"
				style="top: {fixedPos.y}px; left: {fixedPos.x}px;"
			>
				<img src={getFilePublicUrl('regions', `stickers/${region.id}`)} alt={region.name} />
			</div>
		{/if}
	{/each}

	<div class="full-screen center-content pointer-events-none">
		<div class="center-content flex flex-col">
			<Icon icon="ph:arrow-fat-down-fill" class="size-10 text-red-700" />
			{#if gameState.peopleNearBy.length > 0}
				<div class="pointer-events-auto flex flex-row gap-1">
					<div class="center-content flex flex-row gap-0.5 rounded-full bg-orange-600 p-0.5">
						{#each gameState.peopleNearBy as person}
							<Avatar profile={person} class="size-7" />
						{/each}
					</div>
					{#if gameState.tripStatus.progress === 1}
						{#if gameState.tripStatus.timeRemain === 0}
							<button
								class="center-content rounded-full border-b-4 border-r-4 bg-green-700 p-1"
								onclick={() => (chooseNext = true)}
							>
								<Icon icon="mingcute:run-fill" class="text-2xl" />
							</button>
						{/if}
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
