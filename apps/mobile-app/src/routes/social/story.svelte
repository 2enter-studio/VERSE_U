<script lang="ts">
	import Icon from '@iconify/svelte';

	import { getWearingsByUserId } from '$routes/me/utils';
	import { Avatar, UModel, MenuToggler } from '@/components';
	import { CHARACTER_ANIMATIONS } from '@/config';
	import randomItem from 'random-item';
	import type { Tables } from '@repo/shared/supatypes';

	type Props = {
		person: Tables<'profiles'>;
		close: () => void;
		next: () => void;
		previous: () => void;
		startChat: () => void;
	};

	let { close, next, previous, startChat, person }: Props = $props();

	async function loading() {
		const res = await getWearingsByUserId(person.user);
		if ('error' in res) {
			console.error(res.error);
			return [];
		} else {
			return res;
		}
	}
</script>

<MenuToggler />

<div class="full-screen z-20 flex flex-col items-center justify-between bg-green-400">
	{#await loading() then wearingIds}
		<div class="flex w-full flex-row justify-between px-1 text-right">
			<div class="my-1 flex flex-row items-center gap-2">
				<Avatar profile={person} />
				{person.name}
			</div>
			<button onclick={close} class="mt-[var(--safe-area-inset-top)]">
				<Icon icon="iconamoon:close-bold" class="size-8" />
			</button>
		</div>
		<div class="flex h-full w-full flex-row items-center justify-between">
			<button onclick={previous} class="h-4/5 w-1/2"></button>
			<button onclick={next} class="h-4/5 w-1/2"></button>
		</div>
		<button class="mb-10 flex flex-row" onclick={startChat}>
			<Icon icon="solar:chat-dots-bold" class="size-14 rounded-full bg-rose-600 p-3" />
		</button>
		<UModel
			class="full-screen z-[-10] text-black"
			animation={randomItem(CHARACTER_ANIMATIONS)}
			{wearingIds}
			readonly
		></UModel>
	{/await}
</div>
