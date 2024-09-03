<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name: string;
		children: Snippet;
		headMode?: 'heading' | 'subheading' | 'none';
		id?: string;
		useSubheading?: boolean;
		useSpace?: boolean;
		useId?: boolean;
		useToggle?: boolean;
	}

	let {
		name,
		headMode = 'subheading',
		id,
		children,
		useSpace = true,
		useId = true,
		useToggle = false
	}: Props = $props();

	if (!id) id = name.toLowerCase().replaceAll(' ', '-');
	let open = $state(true);
	const prefix = $derived(useToggle ? (open ? '🖐🏻' : '✊🏻') : '');
	function toggle() {
		open = !open || !useToggle;
	}
</script>

<section id={useId ? id : ''} class:mb-16={useSpace}>
	<button
		onclick={toggle}
		class="mb-2"
		class:pointer-events-none={!useToggle}
		class:font-bold={['heading', 'subheading'].includes(headMode)}
		class:text-xl={headMode === 'subheading'}
		class:text-2xl={headMode === 'heading'}
	>
		{prefix}{@html name}
	</button>
	{#if open}
		<div class="pl-8 border-l-2 border-solid border-white/50 flex flex-col gap-2 text-sm">
			{@render children()}
		</div>
	{/if}
</section>
