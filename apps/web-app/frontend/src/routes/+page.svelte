<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { ScreenOrientation } from '@capacitor/screen-orientation';
	import { SafeAreaController } from '@aashu-dubey/capacitor-statusbar-safe-area';

	import type { TextCode } from '@/config/ui_texts/types';
	import { load } from '@/utils';
	import { authState, clockInState, gameState, sysState, unergyState } from '@/states';
	import { AudioLoader, Dialog } from '@/components';
	import { Menu, MyProfile, pages, SideMenu, SystemMessage } from './';
	import { Subscriber } from '@/components';
	import * as authApi from '@/api/auth';
	import { goto } from '$app/navigation';

	let loadingProgress = $state(0);

	async function init() {
		console.log('initializing');
		await Promise.all(
			(['preference', 'app_version', 'maintenance'] as const).map((key) => load[key]())
		);
		if (sysState.appLocked) return;
		console.log('authState.profile', authState.profile);
		if (!authState.profile) {
			sysState.routeTo('account');
			goto('/auth/account');
			return;
		}

		await load.regions();

		if (!authState.profile) {
			console.log('!authState.profile');
			sysState.routeTo('create_profile');
			return;
		}

		if (!authState.isAnonymous) {
			unergyState.setUnergy(authState.profile.unergy);
			clockInState.initClockIn();
			const result = await load.trip();

			if (result?.error) {
				sysState.defaultError(result.error.message as TextCode);
			}
		}

		const anonymousKeywords = ['wearings', 'meshes'] as const;
		const authKeywords = [
			'peopleNearBy',
			'chats',
			'wearings',
			'meshes',
			'owned_wearings',
			'block_users',
			'sponsors'
		] as const;

		const keywords = authState.isAnonymous ? anonymousKeywords : authKeywords;

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
		await gameState.checkAssetUpdates();
		console.log('initialized');
	}

	onMount(async () => {
		// eruda.init();
		await setUpSafeCSS();
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
			const { data, error } = await authApi.getSession(access_token, refresh_token);
			if (error) {
				sysState.defaultError(error.message as TextCode);
			}
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
			<div class="center-content h-screen w-3 flex-col">
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
		<!-- <AudioLoader />
		<Subscriber
			targets={['chat_members', 'leaver', 'chat_messages', 'newTrip', 'owned_wearings']}
		/> -->
		<div class="full-screen layout top-10 flex flex-col items-center">
			<svelte:component this={pages[sysState.route]} />
			{#if authState.profile && sysState.showMenu}
				<div
					class="full-screen pointer-events-none flex flex-col justify-between pt-[var(--safe-area-inset-top)]"
				>
					<MyProfile />
					<div class="flex flex-row justify-end">
						<SideMenu />
					</div>
					<Menu />
				</div>
			{/if}
		</div>
	{/await}
{:else}
	<Dialog
		title={sysState.uiTexts.ERROR}
		closable={false}
		class="center-content flex-col text-center"
	>
		{sysState.uiTexts.YOU_ARE_OFFLINE}
		<button
			onclick={() => window.location.reload()}
			class="w-fit rounded-xl bg-emerald-500 px-2 py-1 shadow-inner shadow-black/30"
		>
			{sysState.uiTexts.REFRESH}
		</button>
	</Dialog>
{/if}

<style>
	.layout {
		padding: var(--safe-area-inset-top) var(--safe-area-inset-right) var(--safe-area-inset-bottom)
			var(--safe-area-inset-left);
	}
</style>
