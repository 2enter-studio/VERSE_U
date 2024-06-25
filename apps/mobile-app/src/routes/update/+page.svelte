<script lang="ts">
	import { needUpdate } from '@/utils';
	import { DEFAULT_ROUTE } from '@/config';
	import { version } from '$app/environment';
	import { sysState } from '@/states';
	import { Dialog } from '@/components';

	$effect(() => {
		if (!needUpdate()) window.location.assign(DEFAULT_ROUTE);
	});
</script>

{#if sysState.remoteAppVersion}
	<Dialog
		closable={false}
		title="You need to update the app"
		open
		class="flex-col text-center text-black"
	>
		<div class="flex flex-row">
			<span>Your Version: {version}</span>
			<span>Latest Version: {sysState.remoteAppVersion.value}</span>
		</div>
		<a href={'d'}>Download the latest version</a>
	</Dialog>
{/if}
