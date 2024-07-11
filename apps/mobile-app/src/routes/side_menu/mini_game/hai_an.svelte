<script lang="ts">
	import { Form, SubmitBtn, UModel } from '@/components';
	import { triggerHaiAn } from '@/utils';
	import { gameState, sysState } from '@/states';
	import { HAI_AN_PASSCODE_DIGIT } from '@repo/shared/config';
	import { FRAME_RATE } from '@/config';

	let passcode = $state<string>('');
	let success = $state(false);
	let animating = $state(false);
	let cameraPosition = $state<[number, number, number]>([0, 7, 2.5]);

	function playAnimation() {
		animating = true;
		success = true;
		let speed = 0.01;
		const interval = setInterval(() => {
			cameraPosition[1] -= speed;
			speed *= 1.35;
			if (cameraPosition[1] < -100) {
				clearInterval(interval);
				animating = false;
			}
		}, 1000 / FRAME_RATE);
	}

	$effect(() => {
		passcode = passcode.toUpperCase();
	});
</script>

<img
	src="/images/tube.png"
	alt="tube"
	class="{animating
		? 'top-[-20px]'
		: 'top-[-50vh]'} absolute z-[120] rotate-180 transition-all duration-500"
/>

{#if animating}
	<UModel
		class="full-screen z-[110] bg-black/50"
		readonly
		{cameraPosition}
		wearingIds={gameState.owned_wearings.filter((w) => w.equipped).map((w) => w.id)}
	/>
{/if}

<Form submitFunction={triggerHaiAn} afterSubmit={playAnimation} class="w-[60vw]">
	<small class="text-xs text-black/80">{sysState.uiTexts.HAI_AN_HINT}</small>
	<div
		class="flex h-[60vw] flex-col items-center bg-black bg-cover bg-center bg-no-repeat"
		style="background-image: url('/images/hai_an_bg.webp')"
	>
		{#if !success}
			<input
				type="text"
				id="passcode"
				name="passcode"
				maxlength={HAI_AN_PASSCODE_DIGIT + 2}
				bind:value={passcode}
				class="w-full bg-purple-900 text-white"
				placeholder="PASSCODE HERE"
			/>
		{/if}
		{#if passcode.trim() !== '' && !sysState.processing && !success}
			<div class="center-content h-full">
				<SubmitBtn
					class="size-[30vw] rounded-3xl bg-rose-500 text-[15vw] text-white shadow-inner shadow-white/50"
				>
					GO
				</SubmitBtn>
			</div>
		{:else if success}
			<div class="center-content h-full font-bold">
				<h1 class="h-fit bg-pink-300 p-1">
					{sysState.uiTexts.HAI_AN_SUCCESS}
				</h1>
			</div>
		{/if}
	</div>
</Form>
