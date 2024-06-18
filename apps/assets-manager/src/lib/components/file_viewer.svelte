<script lang="ts">
	import type { BucketName } from '@/config';
	import { SubmitBtn } from '@/components/index';

	type Props = {
		bucket: BucketName;
		filename: string;
		reloadFile: (input: ArrayBuffer) => Promise<void>;
		accept: string;
	};
	let { bucket, filename, reloadFile, accept }: Props = $props();
	let modified = $state(false);

	async function onchange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const buffer = await file.arrayBuffer();
		await reloadFile(buffer);

		modified = true;
	}
</script>

<SubmitBtn
	action="?/storage"
	data={{ bucket, filename }}
	icon="icomoon-free:upload"
	class="{modified
		? 'pointer-events-auto hover:bg-pink-400'
		: 'pointer-events-none text-white/10'} center-content text-2xl"
	enctype="multipart/form-data"
>
	<input id="{bucket}-{filename}" name="file" type="file" {accept} {onchange} hidden />
</SubmitBtn>
