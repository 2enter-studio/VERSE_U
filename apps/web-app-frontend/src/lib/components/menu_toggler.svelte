<script lang="ts">
	import { onMount } from 'svelte';
	import { sysState } from '@/states';

	onMount(() => {
		sysState.showMenu = false;
		return () => {
			sysState.showMenu = true;
		};
	});
</script>
