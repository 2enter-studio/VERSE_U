<script lang="ts">
	import { fly } from 'svelte/transition';
	import moment from 'moment';
	import { onMount } from 'svelte';

	import { deleteNotification, notifications } from '@/stores/notification';
	import { NOTIFICATION_LAST_TIME } from '@/config';

	let showDetail = $state<number | null>(null);

	onMount(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			notifications.update((notification) =>
				notification.filter((n) => n.created_at > now - NOTIFICATION_LAST_TIME)
			);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex flex-col">
	{#each $notifications.reverse() as { message, detail, created_at, type }}
		<div transition:fly={{ x: -100 }} class="flex flex-row">
			<button onclick={() => (showDetail = created_at)} class="flex flex-row">
				<span class="bg-white text-black px-1">
					{moment(created_at).format('HH:mm:ss')}
				</span>
				<span class="{type} px-1">{message}</span>
			</button>
			<button onclick={() => deleteNotification(created_at)} class="bg-red-300 text-black">X</button
			>
		</div>

		{#if showDetail === created_at}
			<div class="fixed flex-col full-screen center-content bg-transparent">
				<button onclick={() => (showDetail = null)} class="text-right bg-white text-black">
					X
				</button>
				<div class="center-content size-[30vw] flex-col backdrop-blur-xl rounded-2xl bg-white/10">
					<h2 class="bg-black text-white">{message}</h2>
					<p class="">
						{detail}
					</p>
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	span {
		&.error {
			background-color: red;
		}
		&.success {
			background-color: green;
		}
		&.warning {
			background-color: orange;
		}
	}
</style>
