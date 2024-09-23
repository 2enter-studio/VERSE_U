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
	import { submitting, setSystemLog, setTable, setMlTexts, removeTable } from '@/stores';
	import Icon from '@iconify/svelte';
	import { onMount, type Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { HiddenInput } from '@/components/index';
	import type { TableName } from '@/config';

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
	let form = $state<HTMLFormElement>();

	onMount(() => {
		if (!btn) return;
		if (['?/update', '?/storage', '?/junction'].includes(action)) {
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

	const handleSubmit = (e: Event) => {
		if (confirmMessage && !confirm(confirmMessage)) return e.preventDefault();
	};

	const enhanceHandler: SubmitFunction = () => {
		return async ({ update, result }) => {
			$submitting = true;
			await update({ reset: false, invalidateAll: reload });
			$submitting = false;

			if (result.type !== 'success') return;

			const resp = result.data as FormDataResponse;
			if (!resp) return;

			const { type, message, detail } = resp;

			if (type === 'error') {
				return setSystemLog('error', message, detail);
			} else if (type === 'success') {
				setSystemLog('success', message, detail);
				if (afterSubmit) {
					if (resp.data) afterSubmit(resp.data ?? {});
					else afterSubmit();
				}
			}

			if (action.includes('?/remove')) {
				removeTable(data);
				return;
			}

			if (data.table === 'ml_texts') {
				setMlTexts(resp.data.result, action.includes('?/create'));
			} else {
				setTable(data.table as TableName, resp.data.result, action.includes('?/create'));
			}
		};
	};
</script>

<form {action} method="POST" use:enhance={enhanceHandler} {enctype} bind:this={form}>
	{#if dataMap.length > 0}
		{#each dataMap as [key, value]}
			<HiddenInput name={key} {value} />
		{/each}
	{/if}
	<button
		type="submit"
		bind:this={btn}
		{disabled}
		class={className}
		onclick={(e) => handleSubmit(e)}
	>
		{#if children}
			{@render children()}
		{/if}
		{#if icon}
			<Icon {icon} class="text-2xl center-content" />
		{/if}
	</button>
</form>
