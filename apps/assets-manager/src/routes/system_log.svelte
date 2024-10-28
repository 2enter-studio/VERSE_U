<script lang="ts">
	import moment from 'moment';

	import { systemLogs } from '@/stores/system_log';
	import Icon from '@iconify/svelte';

	type Props = { class?: string };
	let { class: className }: Props = $props();

	let showDetail = $state<number | null>(null);
</script>

{#if $systemLogs.length > 0}
	<div class="flex flex-col text-sm {className}">
		{#each $systemLogs.sort((a, b) => b.created_at - a.created_at) as { message, created_at, type }}
			<button
				onclick={() => (showDetail = created_at)}
				class="flex flex-row justify-end hover:before:content-['->'] border-black/0 border-2 whitespace-nowrap"
			>
				<span class="{type} rounded-l-lg px-2 text-white">{message}</span>
				<span class="bg-white text-black px-2 rounded-r-lg">
					{moment(created_at).format('HH:mm:ss')}
				</span>
			</button>
		{/each}
	</div>

	{#if showDetail}
		{@const data = $systemLogs.find((log) => log.created_at === showDetail)}
		{#if data}
			{@const { type, message, detail, created_at } = data}
			<div class="flex-col full-screen center-content bg-transparent pointer-events-none">
				<div
					class="w-[60vw] max-h-[30vw] flex-col justify-between items-start backdrop-blur-2xl rounded-md bg-white/10 overflow-y-auto overflow-x-hidden"
				>
					<div class="flex flex-row w-full justify-between items-center pl-3 pointer-events-auto">
						<span class="text-sm">
							{type.toUpperCase()}
							{moment(created_at).format('YY/MM/DD HH:mm:ss')}
						</span>
						<button onclick={() => (showDetail = null)}>
							<Icon
								icon="mdi:close"
								class="rounded-tr-md p-1 text-3xl bg-rose-500 text-white hover:bg-rose-800"
							/>
						</button>
					</div>
					<h2 class="bg-white/20 text-white px-3">{message}</h2>
					<p class="px-3 bg-white/40">{@html detail ?? 'no detail found'}</p>
				</div>
			</div>
		{/if}
	{/if}
{/if}

<style>
	span {
		&.error {
			background-color: red;
		}
		&.success {
			background-color: green;
		}
		&.warning {
			background-color: orange;
		}
	}
</style>
