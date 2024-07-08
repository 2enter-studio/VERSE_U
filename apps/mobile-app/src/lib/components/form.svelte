<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';

	type Props = {
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

			if (result?.error) {
				sysState.defaultError();
			} else {
				sysState.defaultSuccess();
				await afterSubmit?.(result);
			}
		});
	}
</script>

<form bind:this={form} {onsubmit} class={className}>
	{@render children()}
</form>
