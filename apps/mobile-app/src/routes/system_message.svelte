<script lang="ts">
	import { Dialog } from '@/components';
	import { sysState } from '@/states';
	import { onMount } from 'svelte';
	import { SYS_MSG_LIFE_TIME } from '@/config';

	$inspect(sysState.systemMessage);

	onMount(() => {
		const interval = setInterval(() => {
			for (const { id, created_at } of sysState.systemMessage.filter(
				(m) => m.display !== 'popout'
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
		<div class="fixed right-0 top-0 bg-black text-white px-1">
			{message}
		</div>
	{/if}
{/each}
