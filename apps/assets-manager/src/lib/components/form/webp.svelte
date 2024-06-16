<script lang="ts">
	import type { MetaDataProps } from '@/components/form/types';
	import type { BucketName } from '@/config';

	let { data = $bindable(), name }: MetaDataProps<{ id: string; bucket: BucketName; path: string }> =
		$props();
	const { bucket, path } = data;
	const filepath = `${path}/${data.id}`;
</script>

<input type="file" accept="image/*" bind:value={data} />
