<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { authState, gameState, sysState } from '@/states';
	import { Clipboard } from '@capacitor/clipboard';
	import type { Tables } from '@repo/shared/supatypes';
	import { Dialog, Form, SubmitBtn } from '@/components';
	import { blockUser } from '$routes/social/utils';
	import { db } from '@/db';
	import { modifyProfile } from '$routes/auth/utils';

	type Props = {
		profile: Tables<'profiles'>;
		class?: string;
		readonly?: boolean;
		noInfo?: boolean;
	};
	let { profile, class: className = 'size-12', readonly = true, noInfo = false }: Props = $props();

	let selfieUrl = $state<string>('');
	let selfieAvailable = $state(false);
	let openInfo = $state(false);
	let idCopied = $state(false);
	let nameCopy = $state(profile.name);

	const isMe = $derived(profile.user === authState.user?.id);

	const relation = $derived.by(() => {
		if (
			gameState.friendChats.some((chat) =>
				chat.chat_members.some((member) => member.user.user === profile.user)
			)
		) {
			return 'FRIENDS';
		} else if (
			gameState.strangerChats.some((chat) =>
				chat.chat_members.some((member) => member.user.user === profile.user)
			)
		) {
			return 'STRANGERS';
		} else return 'NOTHING';
	});

	async function reloadSelfie() {
		if (profile) {
			const { data, error } = await db.storage
				.from('user_data')
				.download(`${profile?.user}/selfie`);
			if (error) {
				selfieAvailable = false;
				return;
			}
			selfieUrl = URL.createObjectURL(data);
			selfieAvailable = true;
		}
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

<button
	class="avatar bg-amber-300 shadow-inner shadow-rose-800/40 {className}"
	style="background-image: url({selfieUrl})"
	onclick={() => (openInfo = !noInfo)}
>
	{#if !selfieAvailable}
		{profile?.name.slice(0, 1).toUpperCase()}
	{/if}
</button>

<Dialog
	title={sysState.uiTexts.PLAYER_INFO}
	onclose={() => (idCopied = false)}
	bind:open={openInfo}
	class="flex-col items-center gap-2 text-black"
>
	<div
		class="avatar size-16 rounded-full bg-amber-300 shadow-inner shadow-rose-800/40"
		style="background-image: url({selfieUrl})"
	>
		{#if !selfieAvailable}
			{profile?.name.slice(0, 1).toUpperCase()}
		{/if}
	</div>
	<div class="flex flex-row gap-2">
		<span>{sysState.uiTexts.NAME}:</span>
		{#if isMe}
			<Form submitFunction={modifyProfile}>
				<input type="text" name="name" bind:value={nameCopy} minlength="1" maxlength="10" />
				{#if nameCopy !== authState.profile?.name}
					<SubmitBtn>
						<Icon icon="zondicons:save-disk" class="ml-1 text-cyan-800" />
					</SubmitBtn>
				{/if}
			</Form>
		{:else}
			{profile.name}
		{/if}
	</div>
	<div class="flex flex-row gap-2">
		<span>Public ID</span>
		<div class="center-content w-fit gap-1 rounded-sm bg-gray-600 px-1 text-xs text-white/80">
			{profile.public_id}
			<button
				onclick={() => {
					Clipboard.write({ string: profile.public_id }).then(() => {
						idCopied = true;
					});
				}}
			>
				{#if idCopied}
					Copied
				{:else}
					<Icon icon="ph:copy-fill" />
				{/if}
			</button>
		</div>
	</div>
	{#if !isMe}
		<span>{sysState.uiTexts.RELATIONSHIP}: {sysState.uiTexts[relation]}</span>
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

<style>
	.avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
		border-radius: 9999px;
		color: black;
	}
</style>
