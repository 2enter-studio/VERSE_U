<script lang="ts">
	import { onMount } from 'svelte';
	import type { StorageProps } from '@/components/form/types';
	import { FileViewer } from '@/components/index.js';
	import { encode } from 'base64-arraybuffer';

	let { bucket, filename }: StorageProps = $props();
	let imageUrl = $state<string>();

	onMount(async () => {
		const res = await fetch(`/api/storage/${bucket}/${filename}`);
		if (res.ok) {
			const buffer = await res.arrayBuffer();
			await reloadFile(buffer);
		}

		if (!imageUrl) {
			const res = await fetch('https://api.thecatapi.com/v1/images/search');
			const json = await res.json();
			imageUrl = json[0].url;
		}
	});

	async function reloadFile(input: ArrayBuffer) {
		const base64 = encode(input);

		imageUrl = `data:image/png;base64,${base64}`;
	}
</script>

<div class="flex flex-row justify-end items-end gap-1">
	<label
		for="{bucket}-{filename}"
		class="size-48 bg-white bg-center bg-contain bg-no-repeat cursor-pointer hover:opacity-80"
		style="background-image: url({imageUrl})"
	></label>

	<FileViewer {bucket} {filename} accept="image/webp,image/png,image/jpeg" {reloadFile} />
</div>
