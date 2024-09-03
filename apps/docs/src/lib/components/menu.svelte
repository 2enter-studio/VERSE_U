<script lang="ts">
	import { navigating, page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Subheading } from '@/components/index';

	interface Props {
		class?: string;
	}
	let { class: className }: Props = $props();

	let elements = $state<HTMLElement[]>();
	let show = $state(false);

	onMount(() => {
		elements = [...document.getElementsByTagName('section')];
	});

	$effect(() => {
		if ($navigating) {
			setTimeout(() => {
				elements = [...document.getElementsByTagName('section')];
			});
		}
	});

	$effect(() => {
		const hash = $page.url.hash;
		if (!hash) return;
		const sectionId = hash.split('#')[1];
		if (!elements) return;
		const target = elements.find((e) => e.id === sectionId);
		if (!target) return;
		setTimeout(() => {
			target.scrollIntoView({ behavior: 'smooth' });
		}, 100);
	});
</script>

<div class="{className} ">
	{#if show}
		{#if elements?.length}
			<div
				role="menu"
				tabindex="0"
				onmouseleave={() => (show = false)}
				class="flex flex-col items-end rounded-lg bg-white/50 text-black p-3 w-fit gap-0.5 max-w-[50vw] overflow-y-auto max-h-[80vh] backdrop-blur-sm"
			>
				<Subheading>Menu</Subheading>
				{#each elements.filter((e) => e.id !== '') as element}
					{@const heading = element.getElementsByTagName('button')[0].innerText}
					<a href="#{element.id}" class="btn btn-xs link-hover link-black rounded-none text-left">
						{heading ?? element.id ?? '??'}
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<button
			onmouseover={() => (show = true)}
			onfocus={() => (show = true)}
			class="btn btn-primary w-fit"
		>
			{'<'}
		</button>
	{/if}
</div>
