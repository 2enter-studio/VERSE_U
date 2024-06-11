<script lang="ts">
  import type { StorageInfo } from '@/config';

  type Props = { id: string, value: boolean, info: StorageInfo }
  let { id, value = $bindable(), info }: Props = $props();
  const { bucket, path } = info;
  const filepath = `${path}/${id}`;
</script>


<input type="file" accept="image/*" bind:value>
