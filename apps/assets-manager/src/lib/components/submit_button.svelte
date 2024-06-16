<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { submitting, setSystemLog } from '@/stores';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { HiddenInput } from '@/components/index';

	type Props = {
		action: string;
		data?: Record<string, string>;
		confirmMessage?: string;
		afterSubmit?: Function;
		class?: string;
		icon?: string;
		children?: Snippet;
	};

	let {
		action,
		data = {},
		confirmMessage,
		afterSubmit,
		class: className,
		icon,
		children
	}: Props = $props();

	const dataMap = Object.entries(data);

	const enhanceHandler: SubmitFunction = () => {
		if (confirmMessage) {
			const confirm = window.confirm(confirmMessage);
			if (!confirm) return;
		}

		return async ({ update, result }) => {
			$submitting = true;
			await update({ reset: false });
			$submitting = false;

			console.log(result);
			if (result.type !== 'success') return;
			const data = result.data;
			if (!data) return;
			const { type, message, detail } = data;
			if (type === 'error') {
				setSystemLog('error', message, detail);
			} else if (type === 'success') {
				setSystemLog('success', message, detail);
				if (afterSubmit) afterSubmit();
			}
		};
	};
</script>

<form {action} method="post" use:enhance={enhanceHandler} class={className}>
	{#if dataMap.length > 0}
		{#each dataMap as [key, value]}
			<HiddenInput name={key} {value} />
		{/each}
	{/if}
	<button type="submit">
		{#if icon}
			<Icon {icon} class="text-2xl center-content" />
		{:else if children}
			{@render children()}
		{/if}
	</button>
</form>
