<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flyAndScale } from '@/utils/shadcn';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	type Props = {
		children: Snippet;
		title: string;
		open: boolean;
		class?: string;
		closable?: boolean;
		onclose?: () => void;
	};
	let {
		children,
		title,
		class: className = 'text-center text-black center-content',
		closable = true,
		open = $bindable<boolean>(),
		onclose
	}: Props = $props();

	function close() {
		if (onclose) onclose();
		open = false;
	}
</script>

{#if open}
	<div transition:fade={{ duration: 50 }} class="full-screen z-[100] bg-black/30 backdrop-blur-sm">
		<div transition:flyAndScale class="center-content h-full w-full flex-col">
			{#if closable}
				<div class="flex w-9/12 justify-start">
					<button
						class="center-content size-6 rounded-full border-b-2 border-r-2 border-rose-800 bg-rose-600"
						onclick={close}
					>
						<Icon icon="iconamoon:close-bold" />
					</button>
				</div>
			{/if}
			<h1 class="rounded-t-xl border-r-4 border-cyan-800 bg-cyan-700 px-3 py-1 font-bold">
				{title}
			</h1>
			<div
				class="z-[110] flex w-9/12 gap-1 rounded-2xl border-b-4 border-r-4 border-black bg-yellow-100 p-2 shadow-inner shadow-yellow-900/30 {className}"
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
