<script lang="ts">
	import type { BucketName } from '@/config';
	import { SubmitBtn } from '@/components/index';
	import { onMount } from 'svelte';
	import { setSystemLog } from '@/stores';
	import { makeTableMessage } from '@/index';

	type Props = {
		bucket: BucketName;
		filename: string;
		reloadFile: (input: Blob) => Promise<void>;
		onLoadFail?: Function;
		init?: Function;
		accept: string;
	};
	let { bucket, filename, reloadFile, onLoadFail, init, accept }: Props = $props();
	const fileUrl = `/api/storage/${bucket}/${filename}`;
	let modified = $state(false);

	onMount(async () => {
		const res = await fetch(fileUrl);
		if (res.ok) {
			const blob = await res.blob();
			if (blob) await reloadFile(blob);
			else {
				setSystemLog(
					'error',
					'failed to load file, no blob found',
					makeTableMessage({ file: fileUrl })
				);
				if (onLoadFail) await onLoadFail();
			}
		} else {
			setSystemLog(
				'error',
				'failed to load file, no source found',
				makeTableMessage({ file: fileUrl })
			);
			if (onLoadFail) await onLoadFail();
		}
		if (init) await init();
	});

	async function onchange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const blob = new Blob([file]);
		await reloadFile(blob);

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
