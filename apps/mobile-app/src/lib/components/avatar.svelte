<script lang="ts">
	import { onMount } from 'svelte';
	import { getFilePublicUrl } from '@/utils';
	import { authState, sysState } from '@/states';
	import type { Tables } from '@repo/shared/supatypes';
	import { Dialog, Form, SubmitBtn } from '@/components';
	import { blockUser } from '$routes/social/utils';

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

	onMount(async () => {
		await reloadSelfie();
	});
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
	<span>{profile.name}</span>
	<span>{profile.public_id}</span>
	{#if profile.user !== authState.user?.id}
		<Form submitFunction={blockUser}>
			<input type="text" name="blocked" value={profile.user} hidden />
			<SubmitBtn>Block</SubmitBtn>
		</Form>
	{/if}
</Dialog>
