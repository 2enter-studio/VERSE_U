<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	import { gameState, sysState } from '@/states';
	import { type CharacterAnimation, ZOOM_IN_CAMERA_POS } from '@/config';
	import { Dialog, LocalImg, UModel } from '@/components';
	import { equipWearings, uploadSelfie } from '$routes/me/utils';
	import { MenuToggler } from '@/components/index.js';

	const expressions = gameState.wearingTypes
		.filter((type) => type.is_expression)
		.map((type) => type.id);

	let animation = $state<CharacterAnimation>('idle');
	let dressing = $state(false);
	let selfieUrl = $state('');

	let selectedWearingType = $state(gameState.wearingTypes[0].id);
	let selectedWearings: Record<string, string> = $state({});
	let selectedWearingCopy: Record<string, string> = $state({});

	const filteredSelectedWearings = $derived(
		Object.values(selectedWearings).filter((w) => w !== '')
	);

	const modified = $derived(
		JSON.stringify(selectedWearings) !== JSON.stringify(selectedWearingCopy)
	);

	const zoomIn = $derived(expressions.includes(selectedWearingType));

	$effect(() => {
		if (!dressing) selectedWearings = { ...selectedWearingCopy };
	});

	function takeSelfie() {
		const canvas = document.querySelector<HTMLCanvasElement>('#u-model-renderer');
		if (!canvas) return;
		selfieUrl = canvas.toDataURL('image/webp');
	}

	onMount(() => {
		// init selectedWearings
		for (const type of gameState.wearingTypes) {
			selectedWearings[type.id] =
				gameState.equippedWearings.find(({ id }) => {
					const w = gameState.wearings.find((w) => w.id === id);
					return w?.category.id === type.id;
				})?.id || '';
		}
		selectedWearingCopy = { ...selectedWearings };
	});
</script>

<div class="center-content fixed bottom-0 flex-row gap-3">
	{#if !dressing}
		<input bind:checked={dressing} id="toggle-dressroom" type="checkbox" hidden />
		<label for="toggle-dressroom">
			<Icon
				icon="game-icons:clothes"
				class="mb-[9vh] size-16 overflow-visible rounded-full border-b-4 border-r-4 border-black bg-white p-2 text-black"
			/>
		</label>
	{/if}
</div>

{#if gameState.tripStatus.progress === 1}
	<LocalImg
		bucket="regions"
		filename="backgrounds/{gameState.trip?.to}"
		mimetype="image/webp"
		class="full-screen z-[-11] bg-cover"
	/>
{/if}

{#if zoomIn}
	<div class="center-content fixed bottom-32 w-full">
		<button class="size-20 rounded-full border-4 border-white bg-white/60" onclick={takeSelfie}>
		</button>
	</div>
{/if}

<UModel
	class="full-screen z-[-10]"
	wearingIds={filteredSelectedWearings}
	animation={zoomIn ? 'idle' : animation}
	cameraPosition={zoomIn ? [...ZOOM_IN_CAMERA_POS] : dressing ? [-0.41, 1.65, 2.0] : undefined}
	selfRotate={dressing}
/>

{#if selfieUrl !== ''}
	<Dialog
		title="Selfie"
		class="center-content flex-col text-black"
		open={true}
		onclose={() => (selfieUrl = '')}
	>
		<div
			class="size-64 bg-green-500 bg-cover bg-center bg-no-repeat"
			style="background-image:url({selfieUrl})"
		></div>
		you just took a selfie, upload it?
		<button
			onclick={async () => {
				const res = await uploadSelfie(selfieUrl.split('base64,')[1]);
				if (res?.error) {
					sysState.defaultError(res.error.message);
				} else {
					console.log('selfie uploaded');
				}
				sysState.selfieUpdated = true;
				selfieUrl = '';
			}}
		>
			yes
		</button>
	</Dialog>
{/if}

{#if dressing}
	<MenuToggler />
	<div
		transition:fly={{ x: -100, duration: 200 }}
		class="full-screen pointer-events-none flex flex-col items-start gap-1 px-1 *:pointer-events-auto"
	>
		<div class="h-[15vh]"></div>
		<button class="text-rose-700" onclick={() => (dressing = false)}>
			<Icon icon="carbon:previous-filled" class="size-7 rounded-full bg-white/80" />
		</button>
		<div class="flex flex-row justify-start">
			<div
				class="flex h-fit max-h-[50vh] flex-col gap-1 overflow-auto rounded-l-2xl bg-orange-400 px-2 py-3 shadow-inner shadow-white/30"
			>
				<input
					id="wear-none"
					type="radio"
					bind:group={selectedWearings[selectedWearingType]}
					value=""
					hidden
				/>
				<label for="wear-none" class="center-content size-20 text-3xl">
					<Icon
						icon="ion:ban-sharp"
						class="{selectedWearings[selectedWearingType] === '' ? 'text-red-500' : 'text-white'} "
					/>
				</label>
				{#each gameState.wearings
					.filter((w) => w.category.id === selectedWearingType)
					.toSorted((a, b) => {
						return (gameState.owned_wearings.some((w) => w.id === a.id) ? 0 : 1) - (gameState.owned_wearings.some((w) => w.id === b.id) ? 0 : 1);
					}) as { id }}
					{@const owned = gameState.owned_wearings.some((w) => w.id === id)}
					{@const selected = selectedWearings[selectedWearingType] === id}
					{#key selected}
						<input
							{id}
							type="radio"
							bind:group={selectedWearings[selectedWearingType]}
							value={id}
							hidden
						/>
						<label for={id} class={owned ? '' : 'pointer-events-none'}>
							<LocalImg
								bucket="wearings"
								filename="thumbnails/{id}"
								mimetype="image/webp"
								class="size-20 {owned ? '' : 'opacity-30'} {selected
									? 'rounded-full bg-white shadow-inner shadow-black/30'
									: ''}"
							/>
						</label>
					{/key}
				{/each}
			</div>
			<div class="flex h-fit flex-col gap-1 rounded-r-xl text-sm">
				{#each gameState.wearingTypes as { id, name }}
					{@const selected = selectedWearingType === id}
					<input {id} type="radio" value={id} bind:group={selectedWearingType} hidden />
					<label
						for={id}
						class="{selected
							? 'bg-purple-800 px-2 text-white shadow-inner shadow-black/30'
							: 'bg-black/50 px-1 text-white/80'} w-fit rounded-r-md transition-all duration-300"
						>{name}</label
					>
				{/each}
			</div>
		</div>
		{#if modified && !sysState.processing}
			<button
				class="rounded-md bg-white px-2 py-1 text-black shadow-inner shadow-black/30"
				onclick={async () => {
					await sysState.process(async () => {
						const res = await equipWearings(filteredSelectedWearings);
						if (!res?.error) {
							selectedWearingCopy = { ...selectedWearings };
							sysState.defaultSuccess();
						} else {
							sysState.defaultError('OPERATION_FAILED');
						}
					});
				}}
			>
				{sysState.uiTexts.SAVE_MODIFIED}
			</button>
		{/if}
	</div>
{/if}
