<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import { LOCALES } from '@repo/shared/config';
	import { UI_TEXTS } from '@/config';
	import { authState, sysState } from '@/states';
	import { validate } from '@/utils';
	import { DEFAULT_ROUTE, OAUTH_PROVIDERS } from '@/config';
	import {
		changePwd,
		createAnonymousProfile,
		forgotPwd,
		providerSignIn,
		pwdSignIn,
		signUp
	} from '$routes/auth/utils';
	import { MenuToggler } from '@/components';
	import { TridimensionalButton } from '@/components';
	import { CurrentConfigSetting } from '@/config/system';
	import * as authApi from '@/api/auth';
	import type { TextCode } from '@/config/ui_texts/types';
	import { goto } from '$app/navigation';
	type FormMode =
		| 'SIGNIN'
		| 'SIGNUP'
		| 'FORGOT_PWD'
		| 'CHANGE_PWD'
		| 'DELETE_ACCOUNT'
		| 'ONE_O_ONE';
	type InputType =
		| 'EMAIL'
		| 'PASSWORD'
		| 'CONFIRM_PASSWORD'
		| 'NEW_PASSWORD'
		| 'ANONYMOUS_LOGIN'
		| 'SELECT_LOCALE'
		| 'CAPTCHA';

	const submitMethods: Record<FormMode, Function> = {
		SIGNIN: pwdSignIn,
		SIGNUP: signUp,
		CHANGE_PWD: changePwd,
		FORGOT_PWD: forgotPwd,
		DELETE_ACCOUNT: () => {
			window.open('https://verseu.app/account/delete');
		},
		ONE_O_ONE: async (locale: 'en' | 'zh') => {
			const { data, error } = await authApi.anonymousLogin();
			if (error) {
				sysState.defaultError(error.message as TextCode);
				return;
			}
			await createAnonymousProfile(data.user.id, data);
			console.log('submit sysState.pref.locale', sysState.pref.locale);
			sysState.routeTo(DEFAULT_ROUTE);
			goto(`/`);
		}
	} as const;

	const inputClasses =
		'rounded-md text-sm py-0.5 w-full bg-black text-white border-white border-[1px] pl-2';

	const isOneOOne = CurrentConfigSetting === 'one_o_one';
	const anonymousKey = authState.isAnonymous && authState.profile?.id;
	const anonymousSignup = isOneOOne && anonymousKey;

	let formMode = $state<FormMode>(
		anonymousSignup
			? 'SIGNUP'
			: isOneOOne
				? 'ONE_O_ONE'
				: authState.loggedIn
					? 'CHANGE_PWD'
					: 'SIGNIN'
	);
	let pwd = $state('');
	let pwdConfirm = $state('');
	let pwdNew = $state('');
	let pwdVisible = $state(false);
	let email = $state(authState.user?.email || '');
	let submittable = $state<boolean>(false);
	let formFields = $state.raw<InputType[]>([]);
	let args = $state.raw<[string, string, string] | [string, string] | [string]>();

	const formOptions = $derived(
		authState.loggedIn
			? (['CHANGE_PWD', 'DELETE_ACCOUNT'] as const)
			: (['SIGNIN', 'SIGNUP'] as const)
	);

	$effect(() => {
		switch (formMode) {
			case 'SIGNIN':
				submittable = pwd.length > 0 && validate.email(email);
				formFields = ['EMAIL', 'PASSWORD'] as const;
				args = [email, pwd];
				break;
			case 'SIGNUP':
				submittable = pwd === pwdConfirm && validate.password(pwd);
				formFields = ['EMAIL', 'PASSWORD', 'CONFIRM_PASSWORD'] as const;
				args = [email, pwd, anonymousKey || ''];
				break;
			case 'FORGOT_PWD':
				submittable = validate.email(email);
				formFields = ['EMAIL'];
				args = [email];
				break;
			case 'CHANGE_PWD':
				submittable = pwdNew === pwdConfirm && validate.password(pwdNew) && pwdNew !== pwd;
				formFields = ['PASSWORD', 'NEW_PASSWORD', 'CONFIRM_PASSWORD'] as const;
				args = [pwd, pwdNew];
				break;
			case 'DELETE_ACCOUNT':
				submittable = true;
				formFields = [];
				break;
			case 'ONE_O_ONE':
				submittable = true;
				formFields = ['SELECT_LOCALE', 'ANONYMOUS_LOGIN'] as const;
				break;
			default:
				submittable = false;
				formFields = [];
		}
	});

	async function onsubmit() {
		if (!args) return;
		const res = await submitMethods[formMode](...(args as [string, string]));

		if (res?.error) {
			sysState.defaultError(res.error.message);
		} else {
			sysState.routeTo(DEFAULT_ROUTE);
		}
	}
</script>

<MenuToggler />

<div class="center-content h-screen w-full flex-col gap-1">
	<div class="mb-3 border-black text-2xl font-extrabold text-white">
		{#if authState.loggedIn}
			<div class="flex w-full flex-row justify-between">
				<button class="text-black" onclick={() => sysState.routeTo(DEFAULT_ROUTE)}>
					<Icon icon="carbon:previous-filled" class="size-6 rounded-full bg-white p-[0.5px]" />
				</button>
				<span class="w-full text-center">{sysState.uiTexts.ACCOUNT}</span>
			</div>
		{:else}
			{sysState.uiTexts.WELCOME}
		{/if}
	</div>
	{#if CurrentConfigSetting !== 'one_o_one'}
		<div
			class="flex w-full flex-row justify-between gap-2 rounded-md bg-black/90 p-1 shadow-inner shadow-white/50"
		>
			{#each formOptions as choice}
				<input
					id={choice}
					type="radio"
					value={choice}
					hidden
					bind:group={formMode}
					class="hidden"
				/>
				<label
					for={choice}
					class="{formMode === choice
						? 'bg-gradient-to-l from-white/80 to-white text-black'
						: 'bg-transparent text-white/90'} rounded-sm px-3 py-0.5 text-center text-xs transition-colors duration-200"
				>
					{sysState.uiTexts[choice]}
				</label>
			{/each}
		</div>
	{/if}

	<form
		{onsubmit}
		class="flex w-full flex-col items-end rounded-lg bg-white p-3 text-black shadow-inner shadow-black/40"
	>
		{#each formFields as field}
			<div transition:slide={{ duration: 500 }} class="flex w-full flex-col">
				<div class="flex w-full items-end text-left">
					<span class="py-0.5 pl-0.5">
						{sysState.uiTexts[field]}
					</span>
				</div>
				{#if field === 'EMAIL'}
					<input
						id="email"
						type="email"
						class={inputClasses}
						bind:value={email}
						readonly={authState.loggedIn && !anonymousSignup}
						required
					/>
				{/if}
				{#if field === 'PASSWORD'}
					<div class="flex w-full flex-row items-center gap-1">
						<input
							type={pwdVisible ? 'text' : 'password'}
							class={inputClasses}
							bind:value={pwd}
							required
						/>
						<label for="pwd-visible">
							<Icon icon={pwdVisible ? 'mdi:eye-off' : 'mdi:eye'} />
						</label>
						<input type="checkbox" id="pwd-visible" bind:checked={pwdVisible} hidden />
					</div>
				{/if}
				{#if field === 'NEW_PASSWORD'}
					<input
						type={pwdVisible ? 'text' : 'password'}
						class={inputClasses}
						bind:value={pwdNew}
						required
					/>
				{/if}
				{#if field === 'CONFIRM_PASSWORD'}
					<input
						type={pwdVisible ? 'text' : 'password'}
						class={inputClasses}
						bind:value={pwdConfirm}
						required
					/>
					<small class="text-red-900">{sysState.uiTexts.PASSWORD_LIMIT}</small>
				{/if}
				{#if field === 'ANONYMOUS_LOGIN'}
					<div class="flex w-full justify-center">
						<TridimensionalButton
							onClick={() => {
								submitMethods.ONE_O_ONE();
							}}
							text={sysState.uiTexts.START_EXPERIENCE}
							style="w-full"
							disabled={false}
						/>
					</div>
				{/if}
				{#if field === 'SELECT_LOCALE'}
					<div class="flex w-full justify-center">
						<div class="grid w-full grid-cols-2 gap-2 rounded-xl bg-gray-200 p-2">
							{#each LOCALES as lang}
								{@const selected = lang === sysState.pref.locale}
								<div>
									<input
										type="radio"
										name="lang"
										id="{lang}-option"
										value={lang}
										bind:group={sysState.pref.locale}
										class="peer hidden"
										checked={selected}
									/>
									<label
										for="{lang}-option"
										class="block cursor-pointer select-none rounded-xl p-2 text-center transition-colors duration-200 peer-checked:bg-[#fb7475] peer-checked:font-bold peer-checked:text-white"
										>{UI_TEXTS[lang].LOCALE}</label
									>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/each}
		{#if !sysState.processing && formMode !== 'ONE_O_ONE'}
			<button type="submit" class="center-content mt-2" disabled={!submittable}>
				<Icon
					icon="carbon:next-filled"
					class="{submittable ? 'text-red-500' : 'text-red-500/50'}
					 size-8 rounded-full shadow-inner shadow-amber-800"
				/>
			</button>
		{/if}
	</form>
	{#if !authState.loggedIn && OAUTH_PROVIDERS.length > 0}
		<div
			class="mt-2 flex flex-row justify-around gap-5 rounded-full bg-red-500 p-1 shadow-inner shadow-red-800/80"
		>
			{#each OAUTH_PROVIDERS as provider}
				<button
					onclick={async () => {
						await providerSignIn(provider);
					}}
				>
					<Icon
						icon="mdi:{provider}"
						class="center-content size-9 rounded-full bg-white p-2 text-black shadow-inner shadow-black/20"
					/>
				</button>
			{/each}
		</div>
	{/if}
</div>
