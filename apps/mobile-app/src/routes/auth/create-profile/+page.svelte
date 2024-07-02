<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { authState, sysState } from '@/states';
	import { createProfile } from '$routes/auth/utils';
	import { Dialog } from '@/components';
	import { DEFAULT_ROUTE } from '@/config';

	let name = $state('');

	onMount(() => {
		if (!authState.loggedIn || authState.profile) {
			console.log(authState.loggedIn, authState.profile);
			sysState.routeTo(DEFAULT_ROUTE);
		}
	});

	async function submit() {
		await sysState.process(async () => {
			const response = await createProfile({ name });
			if (response?.error) {
				sysState.defaultError('OPERATION_FAILED');
				return;
			}
		});

		sysState.routeTo(DEFAULT_ROUTE);
	}
</script>

<MenuToggler />

<Dialog title="Create Profile" open={true} closable={false} class="center-content">
	<input
		type="text"
		bind:value={name}
		class="w-4/5 rounded-lg bg-black py-1 text-white"
		placeholder="enter your name"
	/>

	{#if !sysState.processing}
		<button class="p-0" disabled={name.trim() === ''} onclick={submit}>
			<Icon icon="carbon:next-outline" class="size-[10vw] text-rose-500/80" />
		</button>
	{/if}
</Dialog>
