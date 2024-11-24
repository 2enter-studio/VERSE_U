<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';
	import type { TextCode } from '@/config/ui_texts/types';

	type Props = {
		children: Snippet;
		submitFunction: Function;
		afterSubmit?: Function;
		class?: string;
		confirmMessage?: TextCode;
	};
	let { children, submitFunction, afterSubmit, class: className, confirmMessage }: Props = $props();
	let form = $state<HTMLFormElement>();

	async function onsubmit(e: SubmitEvent) {
		e.preventDefault();
		if (confirmMessage) {
			if (!confirm(sysState.uiTexts[confirmMessage])) return;
		}
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

<form bind:this={form} {onsubmit} class={className} enctype="multipart/form-data">
	{@render children()}
</form>
