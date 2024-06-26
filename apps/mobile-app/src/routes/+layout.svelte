<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { App } from '@capacitor/app';
	import { ScreenOrientation } from '@capacitor/screen-orientation';
	import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';
	import Icon from '@iconify/svelte';

	import { db } from '@/db';
	import { load, redirectTo } from '@/utils';
	import { authState, sysState } from '@/states';
	import { Menu, MyProfile, SideMenu, SystemMessage } from './';
	import type { TextCode } from '@/config/ui_texts/types';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	let loaded = $state(false);

	async function init() {
		await load.locale();
		if (sysState.maintaining) return;

		if (authState.loggedIn) {
			await load.regions();

			if (authState.profile) {
				const keywords = ['trip', 'peopleNearBy', 'chats', 'wearings', 'ownedWearings'] as const;

				for (const key of keywords) {
					const result = await load[key]();
					if (result && result?.error) {
						sysState.defaultError(result.error.message as TextCode);
					}
				}
			} else {
				redirectTo('/auth/create-profile');
			}
		} else {
			redirectTo('/auth/account');
		}
	}

	onMount(async () => {
		if (sysState.platform !== 'web') {
			await SafeAreaController.injectCSSVariables();
			await ScreenOrientation.lock({ orientation: 'portrait' });
		}

		[loaded, sysState.showMenu] = [false, false];
		await init();
		[loaded, sysState.showMenu] = [true, true];

		const url = $page.url.href;
		const Url = new URL(url);
		await handleOAuthCallback(Url);
	});

	App.addListener('appUrlOpen', async (event) => {
		const { url } = event;
		const Url = new URL(url);
		await handleOAuthCallback(Url);
	});

	App.addListener('resume', async () => {
		await init();
	});

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
		console.log({ access_token, refresh_token });

		return { access_token, refresh_token };
	}
</script>

<SystemMessage />

<div id="layout" class="top-10 flex h-screen w-screen flex-col items-center">
	{#if authState.loggedIn}
		{#if loaded}
			<div class="flex w-full">
				<MyProfile
					class="fixed left-[var(--safe-area-inset-left)] top-3 mt-[var(--safe-area-inset-top)]"
				/>
			</div>
			{@render children()}
		{:else}
			<div
				transition:fade={{ duration: 1000 }}
				class="full-screen center-content bg-black/30 backdrop-blur-lg"
			>
				<Icon icon="mingcute:loading-fill" class="size-20 animate-spin"></Icon>
			</div>
		{/if}

		{#if sysState.showMenu}
			<Menu />
			<SideMenu />
		{/if}
	{:else}
		<div class="center-content h-screen flex-col">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	#layout {
		padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom)
			var(--safe-area-inset-left);
	}
</style>
