<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import moment from 'moment';

	type Props = { data: PageData };
	let { data }: Props = $props();
	const { passcode } = data;
	onMount(() => {
		const interval = setInterval(() => {
			if (moment.utc().format('mm:ss') === '00:00') {
				window.location.reload();
			}
		}, 500);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="flex w-screen h-screen flex-row bg-violet-900 font-bold justify-center items-center">
	{#each { length: 2 } as _}
		<div class="text-3xl text-center w-[50vw] text-white">
			{passcode}
		</div>
	{/each}
</div>
