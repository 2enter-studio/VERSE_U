<script lang="ts">
	type Props = { name: string; value: string };
	let { name, value }: Props = $props();
</script>

<input type="text" hidden readonly {name} {value} />
