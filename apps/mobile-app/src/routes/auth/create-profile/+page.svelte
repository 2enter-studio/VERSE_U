<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { auth, general } from '../../../lib/states';
	import { createProfile } from '@/utils/auth/profile';
	import { Dialog } from '@/components';
	import { DEFAULT_ROUTE } from '@/config';

	let name = $state('');

	onMount(() => {
		if (!auth.loggedIn || auth.profile) {
			console.log(auth.loggedIn, auth.profile);
			window.location.assign(DEFAULT_ROUTE);
		}
		general.showMenu = false;

		return () => {
			general.showMenu = true;
		};
	});

	async function submit() {
		const response = await createProfile(name);
		console.log(response);
		if (response?.error) {
			console.error(response.error);
			return;
		}

		window.location.assign(DEFAULT_ROUTE);
	}
</script>

<Dialog title="Create Profile" open={true} closable={false} class="center-content">
	<input
		type="text"
		bind:value={name}
		class="rounded-lg bg-black py-1 text-white"
		placeholder="enter your name"
	/>

	<button class="p-0" disabled={name.trim() === ''} onclick={submit}>
		<Icon icon="carbon:next-outline" class="size-[10vw] text-rose-500/80" />
	</button>
</Dialog>
