<script lang="ts">
	import type { Snippet } from 'svelte';
	import { flyAndScale } from '@/utils/shadcn';
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	type Props = {
		children: Snippet;
		title: string;
		open?: boolean;
		class?: string;
		closable?: boolean;
		onclose?: () => void;
	};

	let {
		children,
		title,
		class: className = 'text-center text-black center-content',
		closable = true,
		open = $bindable<boolean>(true),
		onclose
	}: Props = $props();

	function close() {
		if (onclose) onclose();
		open = false;
	}
</script>

{#if open}
	<div transition:fade={{ duration: 50 }} class="full-screen pointer-events-auto bg-black/20 z-[100] backdrop-blur-[2px]">
		<div transition:flyAndScale class="center-content h-full w-full flex-col text-white">
			{#if closable}
				<div class="flex w-9/12 justify-start">
					<button
						class="center-content size-6 rounded-full border-b-2 border-r-2 border-rose-800 bg-rose-600 shepherd-close-modal"
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
				class="z-[110] flex min-w-[50%] max-w-[90%] rounded-2xl border-b-4 border-r-4 border-black bg-yellow-100 px-3 py-2 text-black shadow-inner shadow-yellow-900/30 shepherd-dialog-content {className}"
			>
				{@render children()}
			</div>
		</div>
	</div>
{/if}
