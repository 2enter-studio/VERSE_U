<script lang="ts">
	import { notifications } from '@/stores/notification';
	import moment from 'moment';
	import { NOTIFICATION_LAST_TIME } from '@/config';
	import { onMount } from 'svelte';
	let showDetail = $state(true);
	onMount(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			notifications.update((notification) =>
				notification.filter((n) => n.created_at > now - NOTIFICATION_LAST_TIME)
			);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex flex-col">
	{#each $notifications as { message, detail, created_at, type }}
		<button onclick={() => (showDetail = true)}>
			{moment(created_at).format('hh:mm:ss A')} -
			{message}
		</button>

		{#if showDetail}
			<div class="fixed flex-col full-screen center-content bg-transparent {type}">
				<button onclick={() => (showDetail = false)} class="text-right bg-white text-black">
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
	button.success {
		background-color: green;
	}

	.error {
		background-color: red;
	}
</style>
