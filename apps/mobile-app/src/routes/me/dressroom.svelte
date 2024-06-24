<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { generalState, gameState } from '@/states';
	import { buyWearing, equipWearings } from '@/utils/dress/wearing';
	import { Drawer } from '@/components/index.js';

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
	let initSelectedWearings = $state({ ...selectedWearings });

	const unSaved = $derived(
		JSON.stringify(selectedWearings) !== JSON.stringify(initSelectedWearings)
	);
	const filteredSelectedWearings = $derived(
		Object.values(selectedWearings).filter((w) => w !== '')
	);

	onMount(() => {
		generalState.showMenu = false;

		return () => {
			selectedWearings = { ...initSelectedWearings };
			selectedWearingType = gameState.wearingTypes[0].id;
			generalState.showMenu = true;
		};
	});
</script>

<Drawer bind:open class="w-screen gap-2 bg-black p-1">
	{#each gameState.wearingTypes as wearingType}
		{@const typeSelected = wearingType.id === selectedWearingType}
		<div class="z-10 flex w-full flex-row justify-evenly {typeSelected ? '' : 'hidden'}">
			<input
				id="{wearingType.id}-none"
				type="radio"
				value=""
				bind:group={selectedWearings[wearingType.id]}
				hidden
			/>
			<label for="{wearingType.id}-none" class="flex items-center">
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
					<label class="bg-black text-white {selected ? 'bg-red-300' : ''}" for={wearing.id}
						>{wearing.name}</label
					>
				{:else}
					<div class="flex flex-col items-center">
						<span class="bg-gray-300 text-cyan-500">{wearing.name}</span>
						<button
							onclick={async () => {
								const res = await buyWearing(wearing.id);
								if (res?.error) generalState.errorMessage = res.error.message;
							}}
						>
							<Icon icon="fa6-solid:cart-plus" />
						</button>
					</div>
				{/if}
			{/each}
		</div>
	{/each}

	<div class="flex w-full flex-row justify-evenly">
		{#each gameState.wearingTypes as wearingType}
			{@const typeSelected = wearingType.id === selectedWearingType}
			<input
				id={wearingType.id}
				value={wearingType.id}
				type="radio"
				bind:group={selectedWearingType}
				hidden
			/>
			<label for={wearingType.id} class="px-1 {typeSelected ? 'bg-white text-black' : ''}"
				>{wearingType.name}</label
			>
		{/each}
	</div>

	<button
		class="z-10 bg-white text-black {unSaved ? '' : 'hidden'}"
		disabled={!unSaved}
		onclick={async () => {
			if (!unSaved) return;
			const res = await equipWearings(filteredSelectedWearings);
			if (res?.error) {
				console.error(res.error);
				return;
			}
			initSelectedWearings = { ...selectedWearings };
		}}
	>
		Equip
	</button>
</Drawer>
