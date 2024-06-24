<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';

	import { auth, general } from '@/states';
	import { changePwd, forgotPwd, providerSignIn, pwdSignIn, signUp } from '@/utils/auth';
	import { validate } from '@/utils';
	import { OAUTH_PROVIDERS } from '@/config';

	type FormMode = 'signin' | 'signup' | 'forgot_pwd' | 'change_pwd';
	type InputType = 'email' | 'password' | 'confirm_password' | 'new_password';

	let { formMode = 'signin' }: { formMode?: FormMode } = $props();

	const submitMethods: Record<FormMode, Function> = {
		signin: pwdSignIn,
		signup: signUp,
		change_pwd: changePwd,
		forgot_pwd: forgotPwd
	} as const;

	let pwd = $state('');
	let pwdConfirm = $state('');
	let pwdNew = $state('');
	let pwdVisible = $state(false);
	let email = $state(auth.user?.email || '');

	// const formChoices = $derived(auth.loggedIn ? (['change_pwd', 'forgot_pwd'] as const) : (['signin', 'signup', 'forgot_pwd'] as const));
	const formChoices = $derived(
		auth.loggedIn ? (['change_pwd', 'forgot_pwd'] as const) : (['signin'] as const)
	);

	const submittable = $derived(
		(pwd === pwdConfirm && validate.password(pwd) && formMode === 'signup') ||
			(pwd.length > 0 && validate.email(email) && formMode === 'signin') ||
			(pwdNew === pwdConfirm &&
				validate.password(pwdNew) &&
				pwdNew !== pwd &&
				formMode === 'change_pwd') ||
			(validate.email(email) && formMode === 'forgot_pwd')
	);

	const formFields = $derived.by<InputType[]>(() => {
		if (formMode === 'signin') return ['email', 'password'] as const;
		else if (formMode === 'signup') return ['email', 'password', 'confirm_password'] as const;
		else if (formMode === 'forgot_pwd') return ['email'] as const;
		else if (formMode === 'change_pwd')
			return ['password', 'new_password', 'confirm_password'] as const;
		return [];
	});

	async function handleSubmit() {
		let args: [string] | [string, string];
		if (formMode === 'signin') args = [email, pwd];
		else if (formMode === 'signup') args = [email, pwd];
		else if (formMode === 'forgot_pwd') args = [email];
		else if (formMode === 'change_pwd') args = [pwd, pwdNew];
		else return;

		const res = await submitMethods[formMode](...(args as [string, string]));
		if (res?.error) {
			console.error(res.error);
			general.errorMessage = res.error.message;
			return;
		}
		window.location.assign('/map');
	}

	const inputClasses =
		'rounded-md text-sm py-0.5 w-full bg-black text-white border-white border-[1px] pl-2';
</script>

<div class="center-content w-[60vw] flex-col gap-1">
	<h1 class="mb-3 border-black text-2xl font-extrabold text-black">
		{#if auth.loggedIn}
			Account Center
		{:else}
			{general.uiTexts.welcome}
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
				{general.uiTexts[choice]}
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
						{general.uiTexts[field]}
					</span>
				</div>
				{#if field === 'email'}
					<input
						id="email"
						type="email"
						class={inputClasses}
						bind:value={email}
						readonly={auth.loggedIn}
						required
					/>
				{/if}
				{#if field === 'password'}
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
				{#if field === 'new_password'}
					<input
						type={pwdVisible ? 'text' : 'password'}
						class={inputClasses}
						bind:value={pwdNew}
						required
					/>
				{/if}
				{#if field === 'confirm_password'}
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
	{#if !auth.loggedIn && OAUTH_PROVIDERS.length > 0}
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
