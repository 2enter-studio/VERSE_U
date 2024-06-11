<script lang="ts">
  type Props = { value: number }
  let { value = $bindable() }: Props = $props();
</script>


<input type="number" bind:value>
