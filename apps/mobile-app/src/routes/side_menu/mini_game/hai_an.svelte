<script lang="ts">
	import { Form, SubmitBtn } from '@/components';
	import { triggerHaiAn } from '@/utils';
	import { sysState } from '@/states';
	import { HAI_AN_PASSCODE_DIGIT } from '@repo/shared/config';

	let passcode = $state<string>('');
	let success = $state(false);

	$effect(() => {
		passcode = passcode.toUpperCase();
	});
</script>

<Form
	submitFunction={triggerHaiAn}
	afterSubmit={(args) => {
		if (!args) {
			success = true;
			sysState.defaultSuccess('SUCCESS');
			return;
		}
		if ('error' in args) sysState.defaultError('OPERATION_FAILED');
	}}
	class="w-[60vw]"
>
	<small class="text-xs text-black/80">{sysState.uiTexts.HAI_AN_HINT}</small>
	<div
		class="flex h-[60vw] flex-col items-center bg-black bg-cover bg-center bg-no-repeat"
		style="background-image: url('/images/hai_an_bg.webp')"
	>
		<input
			type="text"
			id="passcode"
			name="passcode"
			maxlength={HAI_AN_PASSCODE_DIGIT}
			bind:value={passcode}
			class="w-full bg-purple-900 text-white"
			placeholder="PASSCODE HERE"
		/>
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
