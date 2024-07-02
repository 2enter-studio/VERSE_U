<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { App } from '@capacitor/app';
	import { ScreenOrientation } from '@capacitor/screen-orientation';
	import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';
	// import eruda from 'eruda';

	import type { TextCode } from '@/config/ui_texts/types';
	import { db } from '@/db';
	import { fileDownloader, load } from '@/utils';
	import { authState, sysState } from '@/states';
	import { Dialog } from '@/components';
	import { Menu, MyProfile, pages, SideMenu, SystemMessage } from './';

	let loadingProgress = $state(0);

	async function init() {
		console.log('initializing');
		await Promise.all((['locale', 'appVersion', 'maintenance'] as const).map((key) => load[key]()));
		if (sysState.appLocked) return;

		if (!authState.loggedIn) {
			sysState.routeTo('account');
			return;
		}

		await load.regions();

		if (!authState.profile) {
			sysState.routeTo('create_profile');
			return;
		}

		const result = await load.trip();

		if (result?.error) {
			sysState.defaultError(result.error.message as TextCode);
		}

		const keywords = ['peopleNearBy', 'chats', 'wearings', 'ownedWearings'] as const;

		await Promise.all(
			keywords.map(async (key) => {
				console.log(`loading ${key}`);
				const result = await load[key]();
				if (result?.error) {
					sysState.defaultError(result.error.message as TextCode);
				}
				loadingProgress += 1 / keywords.length;
			})
		);
		await fileDownloader.start();
		console.log('initialized');
	}

	onMount(async () => {
		await setUpSafeCSS();

		await App.addListener('resume', init);
		await App.addListener('appUrlOpen', async (event) => {
			const { url } = event;
			const Url = new URL(url);
			await handleOAuthCallback(Url);
		});
	});

	async function setUpSafeCSS() {
		if (sysState.platform !== 'web') {
			await SafeAreaController.injectCSSVariables();
			await ScreenOrientation.lock({ orientation: 'portrait' });
		}
	}

	async function handleOAuthCallback(url: URL) {
		// Catch the token from the URL and set it in the store
		const { access_token, refresh_token } = extractToken(url.hash);
		if (access_token !== '') {
			await db.auth.setSession({ access_token, refresh_token });
			if (url.href.indexOf('/auth/reset-pwd') === -1) window.location.href = '/me';
		}
	}

	function extractToken(hash: string): { access_token: string; refresh_token: string } {
		// url format: http://localhost:5173/#access_token=<>&expires_in=<>&refresh_token=<>&token_type=bearer
		const params = new URLSearchParams(hash.replace('#', '?'));
		const access_token = params.get('access_token') || '';
		const refresh_token = params.get('refresh_token') || '';
		// console.log({ access_token, refresh_token });

		return { access_token, refresh_token };
	}
</script>

<SystemMessage />

{#if window.navigator.onLine}
	{#await init()}
		{@const loadingTexts = [sysState.uiTexts.DATA, sysState.uiTexts.LOADING]}
		<div class="full-screen center-content">
			<div class="center-content flex h-screen w-3 flex-col">
				<div class="w-full bg-red-800" style="height: {100 * sysState.downloadProgress}%"></div>
			</div>
		</div>
		<div
			transition:fade={{ duration: 300 }}
			class="full-screen flex flex-row justify-between bg-black/30 backdrop-blur-sm"
		>
			{#each { length: 2 } as _, i}
				<div
					class="center-content w-full break-all text-center text-8xl transition-all duration-1000"
					style="
					width: {100 * ((1 - loadingProgress) / 2)}%;
					background-color: hsl({~~(Math.random() * 360)}, 60%, 60%);
					color: hsl({~~(Math.random() * 360)}, 30%, 80%);
				"
				>
					{loadingTexts[i].toUpperCase()}
				</div>
			{/each}
		</div>
	{:then _}
		<div class="full-screen layout top-10 flex flex-col items-center">
			<svelte:component this={pages[sysState.route]} />
			{#if authState.profile}
				{#if sysState.showMenu}
					<div class="full-screen pointer-events-none flex flex-col justify-between pt-3">
						<MyProfile />
						<div class="flex flex-row justify-end px-1">
							<SideMenu />
						</div>
						<Menu />
					</div>
				{/if}
			{/if}
		</div>
	{/await}
{:else}
	<Dialog title={sysState.uiTexts.ERROR} closable={false} open={true}>
		{sysState.uiTexts.YOU_ARE_OFFLINE}
		<button onclick={() => window.location.reload()}>refresh</button>
	</Dialog>
{/if}

<style>
	.layout {
		padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom)
			var(--safe-area-inset-left);
	}
</style>
