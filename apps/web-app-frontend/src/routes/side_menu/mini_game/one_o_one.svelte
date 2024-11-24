<script lang="ts">
	import { Form, SubmitBtn, UModel } from '@/components';
	import { createError, handleEFResponse } from '@/utils';
	import { authState, gameState, sysState } from '@/states';
	import { HAI_AN_PASSCODE_DIGIT } from '@repo/shared/config';
	import { FRAME_RATE } from '@/config';
	import * as edgeFunctionApi from '@/api/edgeFunction';
	import * as authApi from '@/api/auth';
	import { FunctionsHttpError } from '@supabase/supabase-js';
	import Dialog from '@/components/dialog.svelte';
	import TridimensionalButton from '@/components/tridimensional_button.svelte';
	import { goto } from '$app/navigation';

	let { selectedWearing } = $props();

	let passcode = $state<string>('');
	let success = $state(false);
	let animating = $state(false);
	let cameraPosition = $state<[number, number, number]>([0, 7, 2.5]);

	$effect(() => {
		console.log('selectedWearing', selectedWearing);
	});

	function playAnimation() {
		animating = true;

		let speed = 0.01;
		const interval = setInterval(() => {
			cameraPosition[1] -= speed;
			speed *= 1.35;
			if (cameraPosition[1] < -100) {
				clearInterval(interval);
				animating = false;
			}
		}, 1000 / FRAME_RATE);
		success = true;
	}

	$effect(() => {
		passcode = passcode.toUpperCase();
	});

	async function triggerOneOOne(args: { passcode: string }) {
		const anonKey = authState.profile?.id;
		if (!anonKey) return;
		const res = await authApi.triggerOneOOne(anonKey, args.passcode, selectedWearing);
		if (res.error) {
			// const err = createError(res.error);
			return createError(await handleEFResponse(res.error));
		}
	}

	async function signup() {
		sysState.processing = false;
		sysState.routeTo('account');
		goto('/auth/account');
	}
</script>

<img
	src="/images/tube.png"
	alt="tube"
	class="
		w-screen absolute z-[120] left-0 m-auto rotate-180 transition-all duration-500
		{animating ? 'top-[-20px]' : 'top-[-50vh]'}
	"
/>

{#if animating}
	<UModel
		class="full-screen z-[110] bg-black/50"
		readonly
		{cameraPosition}
		wearingIds={Object.values(selectedWearing)}
	/>
{/if}

<Form submitFunction={triggerOneOOne} afterSubmit={playAnimation} class="w-[60vw]">
	<small class="text-xs text-black/80">{sysState.uiTexts.ONE_O_ONE_TELEPORT_HINT}</small>
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
				<button
					class="size-[30vw] rounded-3xl bg-rose-500 text-[15vw] font-bold text-white shadow-inner shadow-white/50"
					onclick={() => triggerOneOOne({ passcode })}
				>
					GO
				</button>
			</div>
		{:else if success}
			<div class="center-content flex h-full flex-col font-bold">
				<h1 class="h-fit bg-pink-300 p-1">
					{sysState.uiTexts.HAI_AN_SUCCESS}
				</h1>
				<TridimensionalButton
					onClick={signup}
					text={sysState.uiTexts.SIGNUP}
					disabled={false}
					style="mt-2"
				/>
			</div>
		{/if}
	</div>
</Form>
