<script lang="ts">
	import type { BucketName } from '@/config';
	import { getFileUrl } from '@/utils';

	type Props = { bucket: BucketName; filename: string; mimetype?: string; class?: string };
	let { bucket, filename, mimetype = 'text/plain', class: className }: Props = $props();
</script>

{#await getFileUrl(bucket, filename, mimetype) then { data }}
	<div
		class="bg-contain bg-center bg-no-repeat {className}"
		style="
      background-image: url({data})
    "
	></div>
{/await}
