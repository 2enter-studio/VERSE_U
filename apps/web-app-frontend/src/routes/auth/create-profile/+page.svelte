<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { createProfile } from '../utils';
	import { authState, sysState } from '@/states';
	import { Dialog, Form, SubmitBtn, MenuToggler } from '@/components';
	import { DEFAULT_ROUTE } from '@/config';

	let name = $state('');

	onMount(() => {
		if (!authState.loggedIn || authState.profile) {
			sysState.routeTo(DEFAULT_ROUTE);
		}
	});
</script>

<MenuToggler />

<Dialog title="Create Profile" open={true} closable={false}>
	<Form submitFunction={createProfile} class="center-content">
		<input
			type="text"
			name="name"
			bind:value={name}
			class="w-4/5 rounded-lg bg-black py-1 text-white"
			placeholder="enter your name"
		/>
		<SubmitBtn class="p-0" disabled={name.trim() === ''}>
			<Icon icon="carbon:next-outline" class="size-10 text-rose-600" />
		</SubmitBtn>
	</Form>
</Dialog>
