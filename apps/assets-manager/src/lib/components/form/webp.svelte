<script lang="ts">
	import type { StorageProps } from '@/components/form/types';
	import { FileViewer } from '@/components/index.js';

	let { bucket, filename }: StorageProps = $props();
	let imageUrl = $state<string>();

	async function onLoadFail() {
		 	const res = await fetch('https://api.thecatapi.com/v1/images/search');
		 	const json = await res.json();
		 	imageUrl = json[0].url;
	}

	async function reloadFile(input: Blob) {
		if (input) imageUrl = URL.createObjectURL(input);
	}
</script>

<div class="flex flex-row justify-end items-end gap-1">
	<label
		for="{bucket}-{filename}"
		class="size-48 bg-white bg-center bg-contain bg-no-repeat cursor-pointer hover:opacity-80"
		style="background-image: url({imageUrl})"
	></label>

	<FileViewer {bucket} {filename} accept="image/webp,image/png,image/jpeg" {reloadFile} {onLoadFail} />
</div>
