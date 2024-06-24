<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';

	import { getWearingsByUserId } from '$routes/me/utils';
	import { UModel } from '@/components';
	import { generalState } from '@/states';
	import { CHARACTER_ANIMATIONS } from '@/config';

	type Props = {
		user_id: string;
		close: () => void;
		next: () => void;
		previous: () => void;
		startChat: () => void;
	};

	let { user_id, close, next, previous, startChat }: Props = $props();

	async function loading() {
		const res = await getWearingsByUserId(user_id);
		if ('error' in res) {
			console.error(res.error);
			return [];
		} else {
			return res;
		}
	}

	onMount(() => {
		generalState.showMenu = false;
		return () => {
			generalState.showMenu = true;
		};
	});
</script>

<div class="full-screen flex flex-col items-center justify-between bg-green-400">
	{#await loading() then wearingIds}
		<div class="w-full px-3 text-right">
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
			animation={CHARACTER_ANIMATIONS[0]}
			{wearingIds}
			readonly
		></UModel>
	{/await}
</div>
