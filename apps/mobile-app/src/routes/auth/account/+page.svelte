<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	import { authState, sysState } from '@/states';
	import { redirectTo, validate } from '@/utils';
	import { DEFAULT_ROUTE, OAUTH_PROVIDERS } from '@/config';
	import { changePwd, forgotPwd, providerSignIn, pwdSignIn, signUp } from '$routes/auth/utils';
	import { onMount } from 'svelte';

	type FormMode = 'SIGNIN' | 'SIGNUP' | 'FORGOT_PWD' | 'CHANGE_PWD';
	type InputType = 'EMAIL' | 'PASSWORD' | 'CONFIRM_PASSWORD' | 'NEW_PASSWORD';

	const submitMethods: Record<FormMode, Function> = {
		SIGNIN: pwdSignIn,
		SIGNUP: signUp,
		CHANGE_PWD: changePwd,
		FORGOT_PWD: forgotPwd
	} as const;

	const inputClasses =
		'rounded-md text-sm py-0.5 w-full bg-black text-white border-white border-[1px] pl-2';

	let formMode = $state<FormMode>(authState.loggedIn ? 'CHANGE_PWD' : 'SIGNIN');
	let pwd = $state('');
	let pwdConfirm = $state('');
	let pwdNew = $state('');
	let pwdVisible = $state(false);
	let email = $state(authState.user?.email || '');
	let submittable = $state<boolean>(false);
	let formFields = $state.frozen<InputType[]>([]);
	let args = $state.frozen<[string, string] | [string]>();

	const formOptions = $derived(
		authState.loggedIn ? (['CHANGE_PWD', 'FORGOT_PWD'] as const) : (['SIGNIN', 'SIGNUP'] as const)
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
				args = [email, pwd];
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
			redirectTo(DEFAULT_ROUTE);
		}
	}

	onMount(() => {
		sysState.showMenu = false;
		return () => {
			sysState.showMenu = true;
		};
	});
</script>

<div class="center-content h-screen w-[60vw] flex-col gap-1">
	<div class="mb-3 w-full border-black text-2xl font-extrabold text-white">
		{#if authState.loggedIn}
			<div class="flex w-full flex-row justify-between">
				<button class="text-black">
					<Icon icon="carbon:previous-filled" class="size-6 rounded-full bg-white p-[0.5px]" />
				</button>
				<span class="w-full text-center">{sysState.uiTexts.ACCOUNT}</span>
			</div>
		{:else}
			{sysState.uiTexts.WELCOME}
		{/if}
	</div>

	<div
		class="flex w-full flex-row justify-between gap-2 rounded-md bg-black/90 p-1 shadow-inner shadow-white/50"
	>
		{#each formOptions as choice}
			<input id={choice} type="radio" value={choice} hidden bind:group={formMode} />
			<label
				for={choice}
				class="{formMode === choice
					? 'bg-gradient-to-l from-white/80 to-white text-black'
					: 'bg-transparent text-white/90'} rounded-sm px-3 py-0.5 text-xs transition-colors duration-200"
			>
				{sysState.uiTexts[choice]}
			</label>
		{/each}
	</div>

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
						readonly={authState.loggedIn}
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
				{/if}
			</div>
		{/each}
		<button type="submit" class="center-content mt-2" disabled={!submittable}>
			<Icon
				icon="carbon:next-filled"
				class="{submittable ? 'text-red-500' : 'text-red-500/50'}
					 size-8 rounded-full shadow-inner shadow-amber-800"
			/>
		</button>
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
