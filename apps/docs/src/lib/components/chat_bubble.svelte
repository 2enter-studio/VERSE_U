<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
	}
	let { children, class: className }: Props = $props();
</script>

<div class="chat-start {className}">
	<div class="chat-bubble bg-white/35 text-black/80 rounded-xl text-sm max-w-[50vw] break-all">
		🤨 {@render children()}
	</div>
</div>
