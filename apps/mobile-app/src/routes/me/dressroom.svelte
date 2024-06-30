<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { sysState, gameState } from '@/states';
	import { buyWearing, equipWearings } from './utils';
	import { Drawer } from '@/components/index.js';
	import { getFilePublicUrl } from '@/utils';

	type Props = {
		open: boolean;
		selectedWearings: Record<string, string>;
		selectedWearingType: string;
	};

	let {
		open = $bindable(),
		selectedWearings = $bindable(),
		selectedWearingType = $bindable()
	}: Props = $props();
	// let selectedType = $state(randomItem(gameState.wearingTypes).id);
	const thumbnailSize = 'size-20';
	let initSelectedWearings = $state({ ...selectedWearings });

	const unSaved = $derived(
		JSON.stringify(selectedWearings) !== JSON.stringify(initSelectedWearings)
	);
	const filteredSelectedWearings = $derived(
		Object.values(selectedWearings).filter((w) => w !== '')
	);

	onMount(() => {
		sysState.showMenu = false;

		return () => {
			selectedWearings = { ...initSelectedWearings };
			selectedWearingType = gameState.wearingTypes[0].id;
			sysState.showMenu = true;
		};
	});
</script>

<Drawer bind:open class="w-screen gap-2 bg-amber-500 p-1">
	{#each gameState.wearingTypes as wearingType}
		{@const typeSelected = wearingType.id === selectedWearingType}
		<div
			class="z-10 flex max-h-[30vh] w-full flex-row flex-wrap justify-evenly overflow-y-auto {typeSelected
				? ''
				: 'hidden'}"
		>
			<input
				id="{wearingType.id}-none"
				type="radio"
				value=""
				bind:group={selectedWearings[wearingType.id]}
				hidden
			/>
			<label
				for="{wearingType.id}-none"
				class="center-content flex items-center text-3xl {thumbnailSize}"
			>
				<Icon
					icon="ion:ban-sharp"
					class="{selectedWearings[wearingType.id] === '' ? 'text-red-500' : 'text-white'} "
				/>
			</label>

			{#each gameState.wearings.filter((w) => w.category.id === wearingType.id) as wearing}
				{@const selected = selectedWearings[wearingType.id] === wearing.id}
				{@const owned = gameState.ownedWearings.some((w) => w.id === wearing.id)}
				{#if owned}
					<input
						id={wearing.id}
						type="radio"
						value={wearing.id}
						bind:group={selectedWearings[wearingType.id]}
						hidden
					/>
					<label class="text-white {selected ? 'rounded-full bg-white' : ''}" for={wearing.id}>
						<img
							src={getFilePublicUrl('wearings', `thumbnails/${wearing.id}`)}
							alt="loading"
							class="{thumbnailSize} "
						/>
					</label>
				{:else}
					<div class="flex flex-col items-center">
						<span class="text-cyan-500">
							<img
								src={getFilePublicUrl('wearings', `thumbnails/${wearing.id}`)}
								alt="loading"
								class="{thumbnailSize} opacity-30"
							/>
						</span>
						<!--						<button-->
						<!--							onclick={async () => {-->
						<!--								const res = await buyWearing(wearing.id);-->
						<!--								if (res?.error) {-->
						<!--									sysState.defaultError('OPERATION_FAILED');-->
						<!--								}-->
						<!--							}}-->
						<!--						>-->
						<!--							<Icon icon="fa6-solid:cart-plus" />-->
						<!--						</button>-->
					</div>
				{/if}
			{/each}
		</div>
	{/each}

	<div class="flex w-screen flex-row justify-evenly gap-3 overflow-x-scroll px-3 py-1 bg-purple-800">
		{#each gameState.wearingTypes as wearingType}
			{@const typeSelected = wearingType.id === selectedWearingType}
			<input
				id={wearingType.id}
				value={wearingType.id}
				type="radio"
				bind:group={selectedWearingType}
				hidden
			/>
			<label
				for={wearingType.id}
				class="w-1/4 whitespace-nowrap px-2 text-center {typeSelected
					? 'rounded-sm bg-transparent text-white shadow-inner shadow-black/30'
					: ''}"
			>
				{wearingType.name}
			</label>
		{/each}
	</div>

	<button
		class="z-10 mb-1 rounded-xl bg-white px-2 py-1 text-black {unSaved && !sysState.processing
			? ''
			: 'hidden'}"
		disabled={!unSaved && sysState.processing}
		onclick={async () => {
			if (!unSaved) return;
			await sysState.process(async () => {
				const res = await equipWearings(filteredSelectedWearings);
				if (res?.error) {
					console.error(res.error);
				} else {
					sysState.defaultSuccess('SUCCESS');
					initSelectedWearings = { ...selectedWearings };
				}
			});
		}}
	>
		{sysState.uiTexts.SAVE_MODIFIED}
	</button>
</Drawer>
