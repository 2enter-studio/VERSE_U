<script context="module" lang="ts">
	import { browser } from '$app/environment';

	const updateBtns = $state(new Set<HTMLButtonElement>());

	if (browser) {
		window.addEventListener('keydown', (e) => {
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault();
				updateBtns.forEach((btn) => btn.click());
			}
		});
	}
</script>

<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { submitting, setSystemLog } from '@/stores';
	import Icon from '@iconify/svelte';
	import { onMount, type Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { HiddenInput } from '@/components/index';

	type Props = {
		action: string;
		data?: Record<string, string>;
		confirmMessage?: string;
		afterSubmit?: Function;
		class?: string;
		icon?: string;
		enctype?: string;
		reload?: boolean;
		children?: Snippet;
		disabled?: boolean;
	};

	let {
		action,
		data = {},
		confirmMessage,
		afterSubmit,
		class: className,
		icon,
		children,
		reload = false,
		enctype = 'text',
		disabled = false
	}: Props = $props();

	const dataMap = $derived(Object.entries(data));
	let btn = $state<HTMLButtonElement>();

	onMount(() => {
		if (!btn) return;
		if (['?/update', '?/storage'].includes(action)) {
			if (!disabled) updateBtns.add(btn);
			$effect(() => {
				if (!btn) return;
				if (!disabled) updateBtns.add(btn);
				else updateBtns.delete(btn);
			});
		}

		return () => {
			if (!btn) return;
			updateBtns.delete(btn);
		};
	});

	const enhanceHandler: SubmitFunction = () => {
		if (confirmMessage) {
			if (!window.confirm(confirmMessage)) return;
		}

		return async ({ update, result }) => {
			$submitting = true;
			await update({ reset: false, invalidateAll: reload });
			$submitting = false;

			if (result.type !== 'success') return;

			const data = result.data as FormDataResponse;
			if (!data) return;

			const { type, message, detail } = data;

			if (type === 'error') {
				setSystemLog('error', message, detail);
			} else if (type === 'success') {
				setSystemLog('success', message, detail);
				if (afterSubmit) {
					if (data.data) afterSubmit(data.data ?? {});
					else afterSubmit();
				}
			}
		};
	};
</script>

<form {action} method="POST" use:enhance={enhanceHandler} class={className} {enctype}>
	{#if dataMap.length > 0}
		{#each dataMap as [key, value]}
			<HiddenInput name={key} {value} />
		{/each}
	{/if}
	{#if children}
		{@render children()}
	{/if}
	<button type="submit" bind:this={btn} {disabled}>
		{#if icon}
			<Icon {icon} class="text-2xl center-content" />
		{/if}
	</button>
</form>
