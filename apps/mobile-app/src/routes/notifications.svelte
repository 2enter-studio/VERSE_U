<script lang="ts">
	import { notifications } from '@/stores';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	onMount(() => {
		setInterval(() => {
			$notifications = [...$notifications, `${~~(Math.random() * 1000)}`];
		}, 3000);

		setInterval(() => {
			// $notifications = $notifications.slice(1);
			$notifications.shift();
			$notifications = $notifications;
		}, 5000);
	});
	$effect(() => {
		console.log($notifications);
	});
</script>

<div class="flex w-[20vw] flex-col gap-1 transition-all">
	{#each $notifications.reverse() as notification}
		<div class="rounded-sm bg-white px-1 text-black transition-all duration-300">
			{notification}
		</div>
	{/each}
</div>
