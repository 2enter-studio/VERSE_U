<script lang="ts">
	import { needUpdate } from '@/utils';
	import { DEFAULT_ROUTE } from '@/config';
	import { version } from '$app/environment';
	import { sysState } from '@/states';
	import { Dialog } from '@/components';
	import { onMount } from 'svelte';

	onMount(() => {
		sysState.showMenu = false;
		return () => {
			sysState.showMenu = true;
		};
	});
	$effect(() => {
		if (!needUpdate()) window.location.assign(DEFAULT_ROUTE);
	});
</script>

{#if sysState.remoteAppVersion}
	<Dialog
		closable={false}
		title={sysState.uiTexts.NEED_UPDATE}
		open
		class="flex-col text-center text-black"
	>
		<div class="flex flex-col text-center">
			<span>{sysState.uiTexts.YOUR_APP_VERSION}: {version}</span>
			<span>{sysState.uiTexts.LATEST_APP_VERSION}: {sysState.remoteAppVersion.value}</span>
		</div>
		<!--		<a href={'d'}>Download the latest version</a>-->
	</Dialog>
{/if}
