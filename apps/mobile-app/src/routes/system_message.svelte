<script lang="ts">
	import { Dialog } from '@/components';
	import { generalState } from '@/states';
	import { onMount } from 'svelte';
	import { SYS_MSG_LIFE_TIME } from '@/config';

	$inspect(generalState.systemMessage);

	onMount(() => {
		const interval = setInterval(() => {
			for (const { id, created_at } of generalState.systemMessage.filter(
				(m) => m.display !== 'popout'
			)) {
				const now = new Date().getTime();
				if (created_at.getTime() < now - SYS_MSG_LIFE_TIME) {
					generalState.delSysMsg(id);
				}
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

{#each generalState.systemMessage as { id, created_at, message, type, display, callback } (created_at)}
	{#if display === 'popout'}
		<Dialog
			title={generalState.uiTexts[type]}
			open
			onclose={() => {
				generalState.delSysMsg(id);
			}}
			class="center-content flex-col text-black"
		>
			{message}
			{#if type === 'WARNING'}
				<button
					class="bg-red-800 px-1 text-sm text-white"
					onclick={async () => {
						if (callback) await generalState.process(callback)
						generalState.delSysMsg(id);
					}}
				>
					{generalState.uiTexts.CONFIRM_EXECUTION}
				</button>
			{/if}
		</Dialog>
	{:else if display === 'side'}
		{message}
	{/if}
{/each}
