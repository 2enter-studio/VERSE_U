<script lang="ts">
  import type { Props } from '@/components/form/types';

  let { name, data = $bindable(), class: className }: Props<string> = $props();
</script>

<input type="text" bind:value={data} {name} class="{className} " />
