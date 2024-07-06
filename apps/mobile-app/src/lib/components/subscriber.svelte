<script lang="ts">
	import { subscribe } from '@/utils';
	import { onMount } from 'svelte';

	type Props = { targets: (keyof typeof subscribe)[] };
	let { targets }: Props = $props();

	let instances = targets.map((target) => subscribe[target]());

	onMount(() => {
		for (const instance of instances) {
			if (instance) instance.subscribe();
			else console.error('subscribe failed');
		}
		return () => {
			for (const instance of instances) {
				instance?.unsubscribe();
			}
		};
	});
</script>
