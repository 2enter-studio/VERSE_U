<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { App } from '@capacitor/app';
	import { ScreenOrientation } from '@capacitor/screen-orientation';
	import Account from '$routes/auth/account/+page.svelte';
	import CreateProfile from '$routes/auth/create-profile/+page.svelte';
	import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';
	// import eruda from 'eruda';

	import { db } from '@/db';
	import { load as loadData, load } from '@/utils';
	import { authState, sysState } from '@/states';
	import { Menu, MyProfile, SideMenu, SystemMessage } from './';
	import type { TextCode } from '@/config/ui_texts/types';
	import type { PageData } from './$types';

	type Props = { children: Snippet; data: PageData };
	let { children }: Props = $props();
	let loadingProgress = $state(0);

	async function init() {
		console.log('initializing');
		await load.locale();
		await loadData.appVersion();
		await loadData.maintenance();

		if (sysState.maintaining) return;
		if (authState.loggedIn) {
			await load.regions();

			if (authState.profile) {
				const keywords = ['trip', 'peopleNearBy', 'chats', 'wearings', 'ownedWearings'] as const;

				for (const key of keywords) {
					const result = await load[key]();
					console.log(`loading ${key}`);
					if (result && result?.error) {
						sysState.defaultError(result.error.message as TextCode);
					}
					loadingProgress += 1 / keywords.length;
				}
			}
		}
	}

	onMount(async () => {
		await setUpSafeCSS();

		// eruda.init();

		await App.addListener('resume', async () => {
			await init();
		});

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

{#await init()}
	{@const loadingTexts = [sysState.uiTexts.DATA, sysState.uiTexts.LOADING]}
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
				<!--				<Icon icon="mingcute:loading-fill" class="size-8 animate-spin"></Icon>-->
			</div>
		{/each}
	</div>
{:then _}
	<div id="layout" class="top-10 flex h-screen w-screen flex-col items-center">
		{#if authState.loggedIn}
			{#if authState.profile}
				{@render children()}
				{#if sysState.showMenu}
					<Menu />
					<SideMenu />
					<div class="flex w-full">
						<MyProfile
							class="fixed left-[var(--safe-area-inset-left)] top-3 mt-[var(--safe-area-inset-top)]"
						/>
					</div>
				{/if}
			{:else}
				{#await authState.set() then _}
					<CreateProfile />
				{/await}
			{/if}
		{:else}
			<Account />
		{/if}
	</div>
{/await}

<style>
	#layout {
		padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom)
			var(--safe-area-inset-left);
	}
</style>
