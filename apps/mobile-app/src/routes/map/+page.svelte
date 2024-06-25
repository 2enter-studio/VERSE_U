<script lang="ts">
	import Icon from '@iconify/svelte';

	import { MAP_SIZE } from '@/config';
	import { gameState, sysState } from '@/states';
	import { startNextTrip } from '$routes/map/utils';
	import { getFileUrl, getTextFromObj, load, secToMin } from '@/utils';

	import { Avatar, Dialog } from '@/components';

	const tripOptions = [0, 1] as const;

	let chooseNext = $state(false);

	let dom = $state<HTMLElement>();
	let width = $derived(dom?.clientWidth || 0);
	let height = $derived(dom?.clientHeight || 0);

	const from = $derived(gameState.regions.find((r) => r.id === gameState.trip?.from) as Region);
	const to = $derived(gameState.regions.find((r) => r.id === gameState.trip?.to) as Region);

	const position = $derived({
		x: (from.x + (to.x - from.x) * gameState.tripStatus.progress) * MAP_SIZE,
		y: (from.y + (to.y - from.y) * gameState.tripStatus.progress) * MAP_SIZE
	});
	const origin = $derived({
		x: position.x - width / 2,
		y: position.y - height / 2
	});
</script>

{#each gameState.regions as region}
	<link rel="prefetch" href={getFileUrl('regions', `stickers/${region.id}`)} />
{/each}

<div
	bind:this={dom}
	class="absolute z-[-10] h-screen w-screen bg-no-repeat transition-all duration-1000 ease-linear"
	style="
		background-image: url('/map.webp');
		background-position: -{position.x}px -{position.y}px;
	"
></div>

{#if gameState.regions.length > 0 && gameState.trip}
	{#if gameState.tripStatus.progress === 1}
		{#await load.peopleNearBy()}
			loading
		{:then a}
			{#if gameState.tripStatus.timeRemain === 0}
				<button
					class="center-content fixed left-[58vw] top-[50vh] size-10 rounded-full border-b-4 border-r-4 bg-green-700 p-1"
					onclick={() => (chooseNext = true)}
				>
					<Icon icon="mingcute:run-fill" class="text-2xl" />
				</button>
			{:else}
				You must stay until: {secToMin(gameState.tripStatus.timeRemain)}
			{/if}
		{/await}
	{/if}

	<Dialog
		bind:open={chooseNext}
		title={sysState.uiTexts.WHERE_ARE_YOU_GOING}
		class="divide-x divide-black/60"
	>
		{#each tripOptions as num}
			{#if gameState.trip}
				{@const region_id = gameState.trip[`next_${num}`]}
				<button
					onclick={() => {
						startNextTrip(num);
						chooseNext = false;
					}}
				>
					<span class="center-content flex-col text-black">
						<img src={getFileUrl('regions', `stickers/${region_id}`)} alt="" />
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
				class="center-content fixed z-[-10] w-[35vw] flex-col transition-all duration-1000 ease-linear"
				style="top: {fixedPos.y}px; left: {fixedPos.x}px;"
			>
				<img src={getFileUrl('regions', `stickers/${region.id}`)} alt={region.name} />
				{#if gameState.peopleNearBy.length > 0 && region.id === gameState.trip?.to}
					<div class="center-content w-fit gap-1 rounded-full bg-orange-500 p-0.5">
						{#each gameState.peopleNearBy as person}
							<Avatar profile={person} class="size-8" />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	<Icon icon="ph:map-pin-fill" class="fixed left-[50vw] top-[50vh] size-8 text-red-700" />
{/if}
