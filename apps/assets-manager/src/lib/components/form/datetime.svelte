<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';
	import { onMount } from 'svelte';

	let { name, data = $bindable(), class: className }: MetaDataProps<string> = $props();

	let datetime = $state<string>();

	onMount(() => {
		let utcDate = $state(new Date(data));
		const TIMEZONE_OFFSET = utcDate.getTimezoneOffset() * 60000;
		const localDate = new Date(new Date(utcDate.getTime() - TIMEZONE_OFFSET));

		datetime = localDate.toISOString().slice(0, 16);
	});

	$effect(() => {
		console.table({ data, datetime });

		if (!datetime) return;
		data = new Date(datetime).toISOString();
	});
</script>

<input type="datetime-local" bind:value={datetime} class={className} />
