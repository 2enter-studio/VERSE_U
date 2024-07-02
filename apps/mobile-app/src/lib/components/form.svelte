<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';

	type Props = { children: Snippet; submitFunction: Function; class?: string };
	let { children, submitFunction, class: className }: Props = $props();
	let form = $state<HTMLFormElement>();

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(form);
		const args = Object.fromEntries(formData);
		await sysState.process(async () => await submitFunction(args));
	}
</script>

<form bind:this={form} {onsubmit} class={className}>
	{@render children()}
</form>
