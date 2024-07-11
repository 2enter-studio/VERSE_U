<script lang="ts">
	import Icon from '@iconify/svelte';
	import P5 from 'p5';

	import { MAP_SIZE, USE_SMOOTH_MAP_MOTION } from '@/config';
	import { gameState, sysState } from '@/states';
	import { startNextTrip } from './utils';

	import { Avatar, Dialog, LocalImg } from '@/components';
	import { onDestroy } from 'svelte';
	import { watch } from 'runed';

	const tripOptions = [0, 1] as const;
	const transitionClasses = USE_SMOOTH_MAP_MOTION ? 'transition-all duration-1000 ease-linear' : '';

	let chooseNext = $state(false);
	let dom = $state<HTMLElement>();
	let tripRouteDom = $state<HTMLDivElement>();
	let width = $derived(dom?.clientWidth || 0);
	let height = $derived(dom?.clientHeight || 0);
	let p5: P5;

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

	type Point = { x: number; y: number };
	const sketch = (p: P5) => {
		if (!tripRouteDom) return;
		const [w, h] = [tripRouteDom.clientWidth, tripRouteDom.clientHeight];
		const dist = p.dist(0, 0, w, h);
		const numPoints = dist / 10;

		const x1 = from.x < to.x ? w : 0;
		const y1 = from.y < to.y ? h : 0;
		const x2 = x1 === 0 ? w : 0;
		const y2 = y1 === 0 ? h : 0;

		const noiseFactor = 12;
		const points: Point[] = [];

		p.setup = () => {
			if (!gameState.trip) return;
			p.createCanvas(w, h).parent('trip_route');
			p.noiseSeed(new Date(gameState.trip.created_at).getTime());
			p.strokeCap(p.PROJECT);
			p.noLoop();
			p.strokeWeight(14);
			p.stroke(250);
		};

		p.draw = () => {
			for (let i = 0; i <= numPoints; i++) {
				const t = i / numPoints;
				const x = p.lerp(x1, x2, t);
				const y = p.lerp(y1, y2, t);
				const noiseOffset = (p.noise(t * 15) - 1) * noiseFactor;
				const result = {
					x: x + noiseOffset,
					y: y + noiseOffset
				};
				points.push(result);
			}

			for (let i = 0; i < points.length - 1; i++) {
				const p1 = points[i];
				const p2 = points[i + 1];

				if (i % 5 >= 3) p.line(p1.x, p1.y, p2.x, p2.y);
			}
		};
	};

	watch(
		() => gameState.trip,
		() => {
			p5?.remove();
			p5 = new P5(sketch);
		}
	);

	onDestroy(() => {
		p5?.remove;
	});
</script>

<div
	bind:this={dom}
	class="full-screen z-[-12] bg-no-repeat {transitionClasses}"
	style="
		background-image: url('/images/map.jpg');
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
					onclick={async () => {
						chooseNext = false;
						await sysState.process(async () => {
							await startNextTrip(num);
							sysState.defaultSuccess();
						});
					}}
				>
					<span class="center-content flex-col text-black">
						<LocalImg
							bucket="regions"
							filename="stickers/{region_id}"
							mimetype="image/webp"
							class="size-32"
						/>
						{gameState.regions.find((r) => r.id === region_id)?.name}
					</span>
				</button>
			{/if}
		{/each}
	</Dialog>

	{#each gameState.regions as region}
		{@const fixedPos = {
			x: region.x * MAP_SIZE - origin.x,
			y: region.y * MAP_SIZE - origin.y
		}}
		{#if fixedPos.x < width * 2 && fixedPos.y < height * 2 && fixedPos.x > -width && fixedPos.y > -height}
			<div
				class="center-content absolute z-[-10] {transitionClasses}"
				style="top: calc({fixedPos.y}px - 4.5rem); left: calc({fixedPos.x}px - 4.5rem);"
			>
				<LocalImg
					bucket="regions"
					filename="stickers/{region.id}"
					mimetype="image/webp"
					class="size-36"
				/>
			</div>
		{/if}
	{/each}

	{#if gameState.tripStatus}
		{@const w = Math.abs(from.x - to.x) * MAP_SIZE}
		{@const h = Math.abs(from.y - to.y) * MAP_SIZE}
		{@const x = Math.min(from.x, to.x) * MAP_SIZE - origin.x}
		{@const y = Math.min(from.y, to.y) * MAP_SIZE - origin.y}
		<div
			id="trip_route"
			bind:this={tripRouteDom}
			style="width: {w}px; height: {h}px; top: {y}px; left: {x}px;"
			class="fixed z-[-11] mix-blend-soft-light {transitionClasses}"
		></div>
	{/if}

	<div class="full-screen center-content pointer-events-none">
		<div class="center-content flex-col">
			<Icon icon="ph:arrow-fat-down-fill" class="size-10 animate-bounce text-red-700 delay-1000" />
			<div class="pointer-events-auto flex flex-row gap-1">
				{#if gameState.peopleNearBy.length > 0}
					{@const sliced = gameState.peopleNearBy.length >= 5 ? 5 : gameState.peopleNearBy.length}
					<div class="center-content flex-row gap-0.5 rounded-full bg-orange-600 p-0.5">
						{#each gameState.peopleNearBy.slice(0, sliced) as person}
							<Avatar profile={person} class="size-7" />
						{/each}
					</div>
				{/if}
				{#if gameState.tripStatus.progress === 1 && gameState.tripStatus.timeRemain === 0 && !sysState.processing}
					<button
						class="center-content rounded-full border-b-4 border-r-4 bg-green-700 p-1"
						onclick={() => (chooseNext = true)}
					>
						<Icon icon="mingcute:run-fill" class="text-2xl" />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
