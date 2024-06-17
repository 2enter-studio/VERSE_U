<script lang="ts">
	import type { BucketName } from '@/config';
	import { SubmitBtn } from '@/components/index.js';
	import { onMount } from 'svelte';
	import { blobToBase64 } from '@/index';

	type Props = { bucket: BucketName; filename: string };
	let { bucket, filename }: Props = $props();
	console.log(filename);

	let modified = $state(false);
	let imageUrl = $state<string>();

	onMount(async () => {
		const res = await fetch(`/api/storage/${bucket}/${filename}`);
		console.log(res);
		const blob = await res.blob();
		imageUrl = await blobToBase64(blob);
	});

	function onFileChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async () => {
				imageUrl = reader.result as string;
			};
			reader.readAsDataURL(file);
			modified = true;
		}
	}
</script>

<div class="flex flex-row justify-end items-end gap-1">
	<label
		for="image-{bucket}-{filename}"
		class="size-48 bg-white bg-center bg-contain bg-no-repeat"
		style="background-image: url({imageUrl})"
	></label>

	<SubmitBtn
		action="?/storage"
		data={{ bucket, filename }}
		icon="icomoon-free:upload"
		class="{modified
			? 'pointer-events-auto hover:bg-pink-400'
			: 'pointer-events-none text-white/10'} center-content text-2xl"
	>
		<input
			id="image-{bucket}-{filename}"
			type="file"
			accept="image/jpeg,image/png,image/webp"
			onchange={onFileChange}
			hidden
		/>
	</SubmitBtn>
</div>
