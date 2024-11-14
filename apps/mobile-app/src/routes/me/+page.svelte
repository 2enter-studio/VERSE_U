<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { useCoupon } from '$routes/side_menu/others/coupons.svelte';

	import { authState, clockInState, gameState, sysState, localStorageState } from '@/states';
	import {
		DEFAULT_CAMERA_POS,
		// type CharacterAnimation,
		DRESSROOM_CAMERA_POS,
		EXPRESSION_CAMERA_POS,
		SELFIE_CAMERA_POS
	} from '@/config';
	import { Dialog, Form, LocalImg, SubmitBtn, UModel } from '@/components';
	import { equipWearings, uploadSelfie, buyWearing } from '$routes/me/utils';
	import { MenuToggler } from '@/components/index.js';
	import { watch } from 'runed';
	import { ClockIn }from './components';

	const expressions = gameState.wearingTypes
		.filter((type) => type.is_expression)
		.map((type) => type.id);

	// let animation = $state<CharacterAnimation>('idle');
	let dressing = $state(false);
	let takingSelfie = $state(false);
	let selfieUrl = $state('');
	let canvas = $state<HTMLCanvasElement | null>(null);
	let spark = $state(false);

	let showCoupon = $state(false);

	let selectedWearingType = $state(gameState.wearingTypes[0].id);
	let selectedWearings: Record<string, string> = $state({});
	let selectedWearingCopy: Record<string, string> = $state({});

	const focusedWearing = $derived(
		gameState.wearings.find(({ id }) => selectedWearings[selectedWearingType] === id)
	);

	const expressing = $derived(expressions.includes(selectedWearingType));
	const cameraPosition = $derived.by<[number, number, number]>(() => {
		if (dressing) {
			return expressing ? [...EXPRESSION_CAMERA_POS] : [...DRESSROOM_CAMERA_POS];
		} else if (takingSelfie) {
			return [...SELFIE_CAMERA_POS];
		}
		return [...DEFAULT_CAMERA_POS];
	});

	const filteredSelectedWearings = $derived(
		Object.values(selectedWearings).filter((w) => w !== '')
	);

	const modified = $derived(
		JSON.stringify(selectedWearings) !== JSON.stringify(selectedWearingCopy)
	);

	$effect(() => {
		if (!dressing) selectedWearings = { ...selectedWearingCopy };
	});

	watch(
		() => gameState.equippedWearings,
		() => {
			console.log(gameState.equippedWearings);
			const sponsorWearing = gameState.sponsors[0].sponsor_wearings[0].wearing;
			if (gameState.equippedWearings.some((w) => w.id === sponsorWearing)) {
				if (!gameState.sponsors[0].coupons.length) showCoupon = true;
			}
		}
	);

	function takeSelfie() {
		spark = true;
		canvas = document.querySelector<HTMLCanvasElement>('#u-model-renderer');
		if (!canvas) return;
		selfieUrl = canvas.toDataURL('image/webp', 0.1);
		setTimeout(() => (spark = false), 120);
	}

	async function handleUploadSelfie() {
		if (!canvas) return;
		try {
			await uploadSelfie({ canvas });
		} catch (error) {
			console.error(error);
		} finally {
			selfieUrl = '';
			canvas = null;
			takingSelfie = false;
		}
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

{#if !dressing && !takingSelfie}
	<div
		class="full-screen pointer-events-none flex flex-col items-start justify-center gap-2 px-2 *:pointer-events-auto"
	>
		
	{#if clockInState.clockIn && localStorageState.hasCompletedTutorial}
		<ClockIn />
	{/if}
		<button onclick={() => (dressing = true)} class="shepherd-clothes relative">
			<div class="pulsing"></div>
			<Icon
				icon="game-icons:clothes"
				class="size-14 overflow-visible rounded-full border-b-4 border-r-4 border-black bg-white p-2 text-black"
			/>
			
		</button>
		<button onclick={() => (takingSelfie = true)} class="shepherd-selfie relative">
			<div class="pulsing"></div>
			<Icon
				icon="fa-regular:id-badge"
				class="size-14 overflow-visible rounded-full border-b-4 border-r-4 border-black bg-white p-2 text-black"
			/>
		</button>
	</div>
{/if}

{#if takingSelfie}
	<div class="fixed bottom-32 flex w-full justify-evenly">
		<button class="text-rose-700 shepherd-selfie-back" onclick={() => (takingSelfie = false)}>
			<Icon icon="carbon:previous-filled" class="size-10 rounded-full bg-white/80" />
		</button>
		<button class="size-20 rounded-full border-4 border-white bg-white/60 shepherd-selfie-take" onclick={takeSelfie}>
		</button>
		<div class="size-10"></div>
	</div>
{/if}

<UModel
	class="full-screen z-[-10]"
	wearingIds={filteredSelectedWearings}
	selfRotate={dressing && !expressing}
	{cameraPosition}
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
			style="background-image: url({selfieUrl})"
		></div>
		{sysState.uiTexts.YOU_JUST_TOOK_SELFIE}
		<button onclick={handleUploadSelfie} class="rounded-md bg-emerald-500 px-2 py-1 shadow-inner shadow-black/30">
			{sysState.uiTexts.YES}
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
		<button class="text-rose-700 shepherd-clothes-back" onclick={() => (dressing = false)}>
			<Icon icon="carbon:previous-filled" class="size-7 rounded-full bg-white/80" />
		</button>
		<div class="flex flex-row justify-start shepherd-clothes-content">
			<div
				class="flex h-fit max-h-[50vh] flex-col gap-1 overflow-auto rounded-l-2xl rounded-br-2xl bg-orange-400 px-2 py-3 shadow-inner shadow-white/30"
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
						<!--{#if !owned}-->
						<!--	<button-->
						<!--		class="bg-black p-1"-->
						<!--		onclick={() =>  -->
						<!--			buyWearing(id) -->
						<!--		}-->
						<!--	>-->
						<!--		buy-->
						<!--	</button>-->
						<!--{/if}-->
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
		{#if focusedWearing?.description}
			<div class="center-content w-full rounded-sm bg-black/30 p-2 text-center">
				{@html focusedWearing.description}
			</div>
		{/if}
	</div>
{/if}

{#if gameState.tripStatus.progress === 1}
	<LocalImg
		bucket="regions"
		filename="backgrounds/{gameState.trip?.to}"
		mimetype="image/webp"
		class="full-screen z-[-11] bg-cover"
	/>
{/if}

{#if spark}
	<div out:fade={{ duration: 300 }} class="full-screen pointer-events-none bg-white"></div>
{/if}

<Dialog title={sysState.uiTexts.GET_COUPON} bind:open={showCoupon} class="center-content flex-col">
	<div class="text-center">
		{sysState.uiTexts.CONGRATULATION}!{sysState.uiTexts.YOU_CAN_HAVE_COUPON}
		<br />
		{sysState.uiTexts.COUPON_INFO}:{gameState.sponsors[0].coupon_info}
		<br />
		<small>({sysState.uiTexts.HOW_TO_VIEW_COUPON})</small>
	</div>
	<Form submitFunction={useCoupon} afterSubmit={() => (showCoupon = false)}>
		<input type="text" name="sponsor_id" value={gameState.sponsors[0].id} hidden />
		<SubmitBtn class="rounded-lg bg-emerald-700 py-1 px-2 text-white">{sysState.uiTexts.GET}</SubmitBtn>
	</Form>
</Dialog>
