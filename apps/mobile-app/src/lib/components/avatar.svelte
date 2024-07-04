<script lang="ts">
	import { onMount } from 'svelte';
	import { getFilePublicUrl } from '@/utils';
	import { authState, gameState, sysState } from '@/states';
	import type { Tables } from '@repo/shared/supatypes';
	import { Dialog, Form, SubmitBtn } from '@/components';
	import { blockUser } from '$routes/social/utils';
	import Icon from '@iconify/svelte';

	type Props = {
		profile: Tables<'profiles'>;
		class?: string;
		readonly?: boolean;
		noInfo?: boolean;
	};
	let { profile, class: className = 'size-12', readonly = false, noInfo = false }: Props = $props();

	let selfieUrl = $state<string>('');
	let selfieAvailable = $state(false);
	let openInfo = $state(false);
	const relation = $derived.by(() => {
		if (
			gameState.friendChats.some((chat) =>
				chat.chat_members.some((member) => member.user.user === profile.user)
			)
		) {
			return 'friend';
		} else if (
			gameState.strangerChats.some((chat) =>
				chat.chat_members.some((member) => member.user.user === profile.user)
			)
		) {
			return 'stranger';
		} else return 'nothing';
	});

	async function reloadSelfie() {
		if (profile)
			selfieUrl =
				getFilePublicUrl('user_data', `${profile?.user}/selfie`) + `?t=${new Date().getTime()}`;
		// const res = await fetch(selfieUrl);
		// if (!res.ok) {
		// 	selfieAvailable = false;
		// }
	}

	if (!readonly) {
		$effect(() => {
			if (sysState.selfieUpdated) {
				setTimeout(() => {
					reloadSelfie();
					sysState.selfieUpdated = false;
				}, 1000);
			}
		});
	}

	onMount(reloadSelfie);
</script>

{#if selfieUrl}
	<button
		class="center-content rounded-full border-2 border-amber-500 bg-amber-300 bg-cover bg-center bg-no-repeat text-black {className}"
		style="background-image: url({selfieUrl})"
		onclick={() => {
			if (!noInfo) openInfo = true;
		}}
	>
		{#if !selfieAvailable}
			{profile?.name.slice(0, 1).toUpperCase()}
		{/if}
	</button>
{/if}

<Dialog title="Player Info" bind:open={openInfo} class="flex-col items-center text-black">
	<span>name: {profile.name}</span>
	<div class="flex flex-row gap-2">
		<span>Public ID</span>
		<div class="flex w-fit flex-row items-center rounded-sm bg-gray-600 px-1 text-xs text-white/80">
			{profile.public_id}
			<button onclick={() => navigator.clipboard.writeText(profile.public_id || '')}>
				<Icon icon="ph:copy-fill" />
			</button>
		</div>
	</div>
	<span>your relation: {relation}</span>
	{#if profile.user !== authState.user?.id}
		<Form submitFunction={blockUser}>
			<input type="text" name="blocked" value={profile.user} hidden />
			<SubmitBtn
				class="center-content flex-row rounded-xl bg-rose-600 px-2 py-1 text-sm text-white"
			>
				<Icon icon="charm:block" />
				{sysState.uiTexts.BLOCK}
			</SubmitBtn>
		</Form>
	{/if}
</Dialog>
