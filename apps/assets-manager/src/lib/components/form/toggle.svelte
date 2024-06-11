<script lang="ts">
  type Props = { value: boolean }
  let { value = $bindable() }: Props = $props();
</script>


<input type="checkbox" bind:checked={value}>
