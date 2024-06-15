<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { submitting } from '@/stores';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { HiddenInput } from '@/components/index';

	type Props = {
		action: string;
		data?: Record<string, string>;
		needConfirm?: boolean;
		afterSubmit?: () => {};
		class?: string;
		icon?: string;
		children?: Snippet;
	};

	let {
		action,
		data = {},
		needConfirm,
		afterSubmit,
		class: className,
		icon,
		children
	}: Props = $props();

	const dataMap = Object.entries(data);

	const enhanceHandler: SubmitFunction = () => {
		if (needConfirm) {
			const confirm = window.confirm('Are you sure?');
			if (!confirm) return;
		}

		return async ({ update, result }) => {
			$submitting = true;
			await update({ reset: false });
			$submitting = false;

			if (result.type === 'success') {
				if (afterSubmit) afterSubmit();
			} else {
				return;
			}
		};
	};
</script>

<form
	action="?/{action}"
	method="post"
	use:enhance={enhanceHandler}
	class="center-content {className}"
>
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
