<script lang="ts">
	import { Section } from '@/components/index';

	type FileStruct = { name: string; explain: string; contents?: FileStruct[] };

	let { contents, name, explain, parent }: FileStruct & { parent?: string } = $props();

	const id = `${parent ?? ''}${name}`;
</script>

<Section
	name="{name.endsWith('/') ? '' : '🐛'}{name}"
	headMode="none"
	useSpace={false}
	useSubheading
	useToggle={!!contents}
	{id}
	useId={explain !== ''}
>
	{#if explain}
		<div
			class="w-fit text-left rounded-xl bg-gradient-to-bl from-secondary to-primary to text-black px-2 py-0.5 text-xs"
		>
			{@html explain}
		</div>
	{/if}
	{#if contents}
		{#each contents as content}
			<svelte:self {...content} parent={id} />
		{/each}
	{/if}
</Section>
