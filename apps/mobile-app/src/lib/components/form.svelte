<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';

	type Props = { children: Snippet; submitFunction: Function };
	let { children, submitFunction }: Props = $props();
	let form = $state<HTMLFormElement>();

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(form);
		const args = Object.fromEntries(formData);
		await sysState.process(async () => await submitFunction(args));
	}
</script>

<form bind:this={form} {onsubmit}>
	{@render children()}
</form>
