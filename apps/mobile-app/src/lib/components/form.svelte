<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';

	type Props<T = any, K = any> = {
		children: Snippet;
		submitFunction: Function;
		afterSubmit?: Function;
		class?: string;
	};
	let { children, submitFunction, afterSubmit, class: className }: Props = $props();
	let form = $state<HTMLFormElement>();

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		const formData = new FormData(form);
		const args = Object.fromEntries(formData);
		await sysState.process(async () => {
			let result: any;
			if (JSON.stringify(args) === '{}') {
				result = await submitFunction();
			} else {
				result = await submitFunction(args);
			}

			await afterSubmit?.(result);
		});
	}
</script>

<form bind:this={form} {onsubmit} class={className}>
	{@render children()}
</form>
