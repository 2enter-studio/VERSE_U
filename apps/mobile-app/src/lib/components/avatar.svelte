<script lang="ts">
	import { onMount } from 'svelte';
	import { getFileUrl } from '@/utils/storage/download';
	import { selfieUpdated } from '@/stores';
	import type { Tables } from '@repo/config/supatypes';

	type Props = { profile?: Tables<'profiles'>; class?: string; readonly?: boolean };
	let { profile, class: className = 'size-12', readonly = false }: Props = $props();

	let selfieUrl = $state<string>();
	function reloadSelfie() {
		if (profile)
			selfieUrl = getFileUrl('user_data', `${profile?.user}/selfie`) + `?t=${new Date().getTime()}`;
	}

	if (!readonly) {
		$effect(() => {
			if ($selfieUpdated) {
				setTimeout(() => {
					reloadSelfie();
					$selfieUpdated = false;
				}, 1000);
			}
		});
	}

	onMount(() => {
		reloadSelfie();
	});
</script>

{#if selfieUrl}
	<div
		class="center-content rounded-full border-2 border-amber-500 bg-amber-300 bg-cover bg-center bg-no-repeat text-xs text-white {className}"
		style="background-image: url({selfieUrl})"
	></div>
{/if}
