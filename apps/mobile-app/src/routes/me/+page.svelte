<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { gameState, general } from '@/states';
	import { type CharacterAnimation, CHARACTER_ANIMATIONS, ZOOM_IN_CAMERA_POS } from '@/config';
	import { Dialog, UModel } from '@/components';
	import DressRoom from './dressroom.svelte';
	import { getFileUrl } from '@/utils';
	import { uploadSelfie } from '@/utils/dress/selfie';
	// import randomItem from 'random-item';

	const expressions = gameState.wearingTypes
		.filter((type) => type.is_expression)
		.map((type) => type.id);

	let animation = $state<CharacterAnimation>('idle');
	let dressing = $state(false);
	let selectedWearingType = $state(gameState.wearingTypes[0].id);
	let selectedWearings: Record<string, string> = $state({});
	let selfieUrl = $state('');

	const filteredSelectedWearings = $derived(
		Object.values(selectedWearings).filter((w) => w !== '')
	);
	const zoomIn = $derived(expressions.includes(selectedWearingType));

	function takeSelfie() {
		const canvas = document.querySelector<HTMLCanvasElement>('#u-model-renderer');
		if (!canvas) return;
		selfieUrl = canvas.toDataURL('image/webp');
		// window.open(url);
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

		// const animationSwitcher = setInterval(() => {
		// 	animation = randomItem(CHARACTER_ANIMATIONS);
		// }, 10000);
		//
		// return () => {
		// 	clearInterval(animationSwitcher);
		// };
	});
</script>

<link rel="prefetch" href={getFileUrl('regions', `backgrounds/${gameState.trip?.to}`)} />

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
	{@const regionBgUrl = getFileUrl('regions', `backgrounds/${gameState.trip?.to}`)}
	<div
		class="full-screen z-[-11] bg-cover bg-center bg-no-repeat"
		style="background-image: url({regionBgUrl})"
	></div>
{/if}

{#if dressing}
	<DressRoom bind:selectedWearingType bind:open={dressing} bind:selectedWearings />
{/if}

{#if zoomIn}
	<div class="center-content fixed bottom-32 w-full">
		<button class="size-20 rounded-full border-4 border-white bg-white/60" onclick={takeSelfie}
		></button>
	</div>
{/if}

<UModel
	class="full-screen z-[-10]"
	wearingIds={filteredSelectedWearings}
	animation={zoomIn ? 'idle' : animation}
	cameraPosition={zoomIn ? [...ZOOM_IN_CAMERA_POS] : undefined}
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
				if (res?.error) general.errorMessage = res.error.message;
				else {
					console.log('selfie uploaded');
				}
				general.selfieUpdated = true;
				selfieUrl = '';
			}}
		>
			yes
		</button>
	</Dialog>
{/if}
