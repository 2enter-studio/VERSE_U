<script lang="ts">
	import { APP_LINKS } from '@repo/shared/config';
	import { needUpdate } from '@/utils';
	import { DEFAULT_ROUTE } from '@/config';
	import { version } from '$app/environment';
	import { sysState } from '@/states';
	import { Dialog, MenuToggler } from '@/components';

	$effect(() => {
		if (!needUpdate()) sysState.routeTo(DEFAULT_ROUTE);
	});
</script>

<MenuToggler />

{#if sysState.remoteAppVersion}
	<Dialog
		closable={false}
		title={sysState.uiTexts.NEED_UPDATE}
		open
		class="flex-col text-center text-black"
	>
		<div class="flex flex-col items-center text-center">
			<span>{sysState.uiTexts.YOUR_APP_VERSION}: {version}</span>
			<span>{sysState.uiTexts.LATEST_APP_VERSION}: {sysState.remoteAppVersion.value}</span>
			<!--{#if sysState.platform === 'ios'}-->
				<a href={APP_LINKS[sysState.platform]} class="w-fit rounded-md bg-emerald-500 px-2 py-1"> Update </a>
			<!--{/if}-->
		</div>
		<!--		<a href={'d'}>Download the latest version</a>-->
	</Dialog>
{/if}
