<script lang="ts">
	import { onMount } from 'svelte';
	import { generalState } from '@/states';

	onMount(() => {
		setInterval(() => {
			generalState.notifications = [...generalState.notifications, `${~~(Math.random() * 1000)}`];
		}, 3000);

		setInterval(() => {
			// general.notifications = general.notifications.slice(1);
			generalState.notifications.shift();
			generalState.notifications = generalState.notifications;
		}, 5000);
	});
	$effect(() => {
		console.log(generalState.notifications);
	});
</script>

<div class="flex w-[20vw] flex-col gap-1 transition-all">
	{#each generalState.notifications.reverse() as notification}
		<div class="rounded-sm bg-white px-1 text-black transition-all duration-300">
			{notification}
		</div>
	{/each}
</div>
