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
	import { loadPeopleNearby, loadRegions, loadTrip } from '@/utils/map';
	import { loadChats } from '@/utils/chat';
	import { loadWearings } from '@/utils/dress/wearing';
	import { loggedIn, profile, platform, showMenu } from '@/stores';
	import { Menu, Login, MyProfile, Error, SideMenu } from './';
	import { DEFAULT_ROUTE } from '@/config';
	// import { Notifications } from './index.js';

	type Props = { children: Snippet };
	let { children }: Props = $props();

	let loaded = $state(false);

	async function init() {
		if ($loggedIn) {
			await loadRegions();

			if (!$profile && $page.url.pathname !== '/auth/create-profile') {
				console.log('profile not found');
				window.location.assign('/auth/create-profile');
			}

			if ($profile) {
				await loadTrip();
				await loadPeopleNearby();
				await loadChats();
				await loadWearings();
			}
		}

		if ($page.url.pathname !== DEFAULT_ROUTE && !$page.url.pathname.includes('/auth')) {
			window.location.assign(DEFAULT_ROUTE);
		}
	}

	onMount(async () => {
		if ($platform !== 'web') {
			await SafeAreaController.injectCSSVariables();
			await ScreenOrientation.lock({ orientation: 'portrait' });
		}

		[loaded, $showMenu] = [false, false];
		await init();
		[loaded, $showMenu] = [true, true];

		const url = window.location.href;
		const Url = new URL(url);
		await handleOAuthCallback(Url);
	});

	$effect(() => {
		console.log($page.url.href);
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

<!--<div class="fixed top-20">{$page.url.pathname}</div>-->

<div id="layout" class="top-10 flex h-screen w-screen flex-col items-center">
	{#if $loggedIn}
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

		{#if $showMenu}
			<Menu />
			<SideMenu />
		{/if}
	{:else if !['/auth/reset-pwd', '/auth/create-profile'].includes($page.url.pathname)}
		<div class="center-content h-screen flex-col">
			<Login />
		</div>
	{:else}
		<div class="center-content h-screen flex-col">
			{@render children()}
		</div>
	{/if}
</div>

<Error />

<!--<div class="fixed right-1 top-1">-->
<!--	<Notifications />-->
<!--</div>-->

<style>
	#layout {
		padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom)
			var(--safe-area-inset-left);
	}
</style>
