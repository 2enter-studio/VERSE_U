<script lang="ts">
	import Icon from '@iconify/svelte';

	import { MAP_SIZE } from '@/config';
	import { trip, tripStatus, regions, peopleNearby, general } from '@/states';
	import { getFileUrl } from '@/utils/storage';
	import { secToMin } from '@/utils/time';
	import { loadPeopleNearby, startNextTrip } from '@/utils/map';
	import { getTextFromObj } from '@/utils/ml_text';

	import { Dialog, Avatar } from '@/components';

	const tripOptions = [0, 1] as const;

	let chooseNext = $state(false);

	let dom = $state<HTMLElement>();
	let width = $derived(dom?.clientWidth || 0);
	let height = $derived(dom?.clientHeight || 0);
	const previousRegion = $derived($regions.find((r) => r.id === $trip?.from) as Region);
	const targetRegion = $derived($regions.find((r) => r.id === $trip?.to) as Region);
	const currentPos = $derived({
		x: (previousRegion.x + (targetRegion.x - previousRegion.x) * $tripStatus.progress) * MAP_SIZE,
		y: (previousRegion.y + (targetRegion.y - previousRegion.y) * $tripStatus.progress) * MAP_SIZE
	});
	const currentOrigin = $derived({
		x: currentPos.x - width / 2,
		y: currentPos.y - height / 2
	});
</script>

{#each $regions as region}
	<link rel="prefetch" href={getFileUrl('regions', `stickers/${region.id}`)} />
{/each}

<div
	bind:this={dom}
	class="absolute z-[-10] h-screen w-screen bg-no-repeat transition-all duration-1000 ease-linear"
	style="
		background-image: url('/map.webp');
		background-position: -{currentPos.x}px -{currentPos.y}px;
	"
></div>

{#if $regions.length > 0 && $trip}
	{#if $tripStatus.progress === 1}
		{#await loadPeopleNearby()}
			loading
		{:then a}
			{#if $tripStatus.timeRemain === 0}
				<button
					class="center-content fixed left-[58vw] top-[50vh] size-10 rounded-full border-b-4 border-r-4 bg-green-700 p-1"
					onclick={() => (chooseNext = true)}
				>
					<Icon icon="mingcute:run-fill" class="text-2xl" />
				</button>
			{:else}
				You must stay until: {secToMin($tripStatus.timeRemain)}
			{/if}
		{/await}
	{/if}

	<Dialog
		bind:open={chooseNext}
		title={general.uiTexts.where_are_you_going}
		class="divide-x divide-black/60"
	>
		{#each tripOptions as num}
			{#if $trip}
				{@const region_id = $trip[`next_${num}`]}
				<button
					onclick={() => {
						startNextTrip(num);
						chooseNext = false;
					}}
				>
					<span class="center-content flex-col text-black">
						<img src={getFileUrl('regions', `stickers/${region_id}`)} alt="" />
						{getTextFromObj($regions, 'name', region_id)}
					</span>
				</button>
			{/if}
		{/each}
	</Dialog>

	{#each $regions as region}
		{@const fixedPos = {
			x: region.x * MAP_SIZE - currentOrigin.x - width / 10,
			y: region.y * MAP_SIZE - currentOrigin.y - height / 8
		}}
		{#if fixedPos.x < width * 2 && fixedPos.y < height * 2 && fixedPos.x > -width && fixedPos.y > -height}
			<div
				class="center-content fixed z-[-10] w-[35vw] flex-col transition-all duration-1000 ease-linear"
				style="top: {fixedPos.y}px; left: {fixedPos.x}px;"
			>
				<img src={getFileUrl('regions', `stickers/${region.id}`)} alt={region.name} />
				{#if $peopleNearby.length > 0 && region.id === $trip?.to}
					<div class="center-content w-fit gap-1 rounded-full bg-orange-500 p-0.5">
						{#each $peopleNearby as person}
							<Avatar profile={person} class="size-8" />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/each}

	<Icon icon="ph:map-pin-fill" class="fixed left-[50vw] top-[50vh] size-8 text-red-700" />
{/if}
