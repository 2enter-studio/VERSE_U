<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	import { authState, sysState } from '@/states';
	import { changePwd, forgotPwd, providerSignIn, pwdSignIn, signUp } from '$routes/auth/utils';
	import { validate } from '@/utils';
	import { OAUTH_PROVIDERS } from '@/config';

	type FormMode = 'SIGNIN' | 'SIGNUP' | 'FORGOT_PWD' | 'CHANGE_PWD';
	type InputType = 'EMAIL' | 'PASSWORD' | 'CONFIRM_PASSWORD' | 'NEW_PASSWORD';

	let { formMode = 'SIGNIN' }: { formMode?: FormMode } = $props();

	const submitMethods: Record<FormMode, Function> = {
		SIGNIN: pwdSignIn,
		SIGNUP: signUp,
		CHANGE_PWD: changePwd,
		FORGOT_PWD: forgotPwd
	} as const;

	let pwd = $state('');
	let pwdConfirm = $state('');
	let pwdNew = $state('');
	let pwdVisible = $state(false);
	let email = $state(authState.user?.email || '');

	// const formChoices = $derived(auth.loggedIn ? (['change_pwd', 'forgot_pwd'] as const) : (['signin', 'signup', 'forgot_pwd'] as const));
	const formChoices = $derived(
		authState.loggedIn ? (['CHANGE_PWD', 'FORGOT_PWD'] as const) : (['SIGNIN', 'SIGNUP'] as const)
	);

	const submittable = $derived(
		(pwd === pwdConfirm && validate.password(pwd) && formMode === 'SIGNUP') ||
			(pwd.length > 0 && validate.email(email) && formMode === 'SIGNIN') ||
			(pwdNew === pwdConfirm &&
				validate.password(pwdNew) &&
				pwdNew !== pwd &&
				formMode === 'CHANGE_PWD') ||
			(validate.email(email) && formMode === 'FORGOT_PWD')
	);

	const formFields = $derived.by<InputType[]>(() => {
		if (formMode === 'SIGNIN') return ['EMAIL', 'PASSWORD'] as const;
		else if (formMode === 'SIGNUP') return ['EMAIL', 'PASSWORD', 'CONFIRM_PASSWORD'] as const;
		else if (formMode === 'FORGOT_PWD') return ['EMAIL'] as const;
		else if (formMode === 'CHANGE_PWD')
			return ['PASSWORD', 'NEW_PASSWORD', 'CONFIRM_PASSWORD'] as const;
		return [];
	});

	async function handleSubmit() {
		let args: [string] | [string, string];
		if (formMode === 'SIGNIN') args = [email, pwd];
		else if (formMode === 'SIGNUP') args = [email, pwd];
		else if (formMode === 'FORGOT_PWD') args = [email];
		else if (formMode === 'CHANGE_PWD') args = [pwd, pwdNew];
		else return;

		const res = await submitMethods[formMode](...(args as [string, string]));
		if (res?.error) {
			console.error(res.error);
			sysState.defaultError(res.error.message);
			return;
		}
		window.location.assign('/map');
	}

	const inputClasses =
		'rounded-md text-sm py-0.5 w-full bg-black text-white border-white border-[1px] pl-2';
</script>

<div class="center-content w-[60vw] flex-col gap-1">
	<h1 class="mb-3 border-black text-2xl font-extrabold text-black">
		{#if authState.loggedIn}
			Account Center
		{:else}
			{sysState.uiTexts.WELCOME}
		{/if}
	</h1>

	<div
		class="flex w-full flex-row justify-between gap-2 rounded-md bg-black/90 p-1 shadow-inner shadow-white/50"
	>
		{#each formChoices as choice}
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
		onsubmit={handleSubmit}
		class="flex w-full flex-col items-end rounded-lg bg-white px-3 py-3 text-black shadow-inner shadow-black/40"
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
		<!--{#if submittable}-->
		<button type="submit" class="center-content mt-2" disabled={!submittable}>
			<Icon
				icon="carbon:next-filled"
				class="size-8 rounded-full p-0 {submittable
					? 'text-red-500'
					: 'text-red-500/50'} shadow-inner shadow-amber-800"
			/>
		</button>
		<!--{/if}-->
		<div class="center-content mt-3 w-full">
			<div
				class="flex w-fit flex-col justify-start rounded-lg bg-green-800 px-3 py-1 text-xs text-white"
			>
				<h5>Demo Account</h5>
				<span>email: demo@2enter.art</span>
				<span>password: 2enter2enter</span>
			</div>
		</div>
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
