<script lang="ts">
  import type { MetaDataProps } from '@/components/form/types';

  let { name, data = $bindable(), class: className }: MetaDataProps<string> = $props();
</script>

<input type="text" bind:value={data} class="{className} " />
