<script lang="ts">
	import { Dialog } from '@/components';
	import { sysState } from '@/states';
	import { onMount } from 'svelte';
	import { SYS_MSG_LIFE_TIME } from '@/config';

	// $inspect(sysState.systemMessage);

	onMount(() => {
		const interval = setInterval(() => {
			for (const { id, created_at } of sysState.systemMessage.filter(
				(m) => m.display !== 'popout' && m.type !== 'PROCESSING'
			)) {
				const now = new Date().getTime();
				if (created_at.getTime() < now - SYS_MSG_LIFE_TIME) {
					sysState.delSysMsg(id);
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	function getStyle(type: 'SUCCESS' | 'PROCESSING' | 'WARNING' | 'ERROR') {
		switch (type) {
			case 'SUCCESS':
				return 'bg-green-500';
			case 'WARNING':
				return 'bg-amber-500';
			case 'ERROR':
				return 'bg-rose-500';
			case 'PROCESSING':
				return 'bg-cyan-500';
			default:
				return '';
		}
	}
</script>

{#each sysState.systemMessage as { id, created_at, message, type, display, callback } (created_at)}
	{#if display === 'popout'}
		<Dialog
			title={sysState.uiTexts[type]}
			open
			onclose={() => {
				sysState.delSysMsg(id);
			}}
			class="center-content flex-col text-black"
		>
			{message}
			{#if type === 'WARNING'}
				<button
					class="bg-red-800 px-1 text-sm text-white"
					onclick={async () => {
						if (callback) await sysState.process(callback);
						sysState.delSysMsg(id);
					}}
				>
					{sysState.uiTexts.CONFIRM_EXECUTION}
				</button>
			{/if}
		</Dialog>
	{:else if display === 'side'}
		<div class="fixed left-0 top-0 w-screen bg-black px-1 text-center text-white {getStyle(type)}">
			{message}
		</div>
	{/if}
{/each}
