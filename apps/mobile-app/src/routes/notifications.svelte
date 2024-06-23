<script lang="ts">
	import { onMount } from 'svelte';
	import { general } from '@/states';

	onMount(() => {
		setInterval(() => {
			general.notifications = [...general.notifications, `${~~(Math.random() * 1000)}`];
		}, 3000);

		setInterval(() => {
			// general.notifications = general.notifications.slice(1);
			general.notifications.shift();
			general.notifications = general.notifications;
		}, 5000);
	});
	$effect(() => {
		console.log(general.notifications);
	});
</script>

<div class="flex w-[20vw] flex-col gap-1 transition-all">
	{#each general.notifications.reverse() as notification}
		<div class="rounded-sm bg-white px-1 text-black transition-all duration-300">
			{notification}
		</div>
	{/each}
</div>
