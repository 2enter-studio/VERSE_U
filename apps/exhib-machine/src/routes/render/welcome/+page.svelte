<script lang="ts">
	import { onMount } from 'svelte';
	import validator from 'validator';
	import { page } from '$app/stores';
	import type { Action } from 'svelte/action';
	import { HAI_AN_CALL_TIMEOUT } from '@/config';

	const FRAME_RATE = 30;

	let name = $state<string | null>(null);
	let x = $state(0);

	let client: WebSocket;

	function connect() {
		client = new WebSocket(`ws://${$page.url.host}/ws`);
		client.onmessage = (message) => {
			if (!validator.isJSON(message.data)) return;
			const data = JSON.parse(message.data);
			if (data?.message) {
				console.log(`received message: ${data.message}`);
				return;
			}
			if (data?.avatars) {
				name = data.avatars[0]?.name;
			}
		};
		client.onclose = () => {
			setTimeout(connect, 1000);
		};
		client.onopen = () => {
			console.log(`connected to ws://${$page.url.host}/ws`);
		};
	}

	const showName: Action = (node) => {
		const speed = (window.innerWidth * 1000) / FRAME_RATE / HAI_AN_CALL_TIMEOUT;
		x = -node.clientWidth;
		const interval = setInterval(() => {
			x += speed;
			if (x > window.innerWidth) {
				name = null;
				x = 0;
			}
		}, FRAME_RATE);
		return {
			destroy() {
				console.log('destroy');
				clearInterval(interval);
			}
		};
	};

	onMount(() => {
		connect();
		setTimeout(() => {
			name = 'hello';
		}, 1000);
	});
</script>

<div class=" w-screen h-screen bg-black">
	{#if name}
		<span
			use:showName
			class="fixed top-0 flex w-fit h-screen justify-end items-center text-white text-2xl font-bold whitespace-nowrap"
			style="right: {x}px"
		>
			～耶耶耶～歡迎玩家{name}登陸 Verse U 窗！耶耶耶～
		</span>
	{/if}
</div>
