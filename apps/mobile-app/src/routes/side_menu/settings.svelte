<script lang="ts">
	import Icon from '@iconify/svelte';
	import { LOCALES } from '@repo/shared/config';
	import { version } from '$app/environment';

	import type { TextCode } from '@/config/ui_texts/types';
	import { authState, sysState } from '@/states';
	import { modifyProfile, signOut } from '$routes/auth/utils';
	import { preferences } from '@/utils';

	import { UI_TEXTS } from '@/config';
	import { Form, SubmitBtn } from '@/components';

	let values = $state({
		profile: $state.snapshot(authState.profile),
		locale: $state.snapshot(sysState.locale)
	});

	const submittable = $derived(
		JSON.stringify({ profile: authState.profile, locale: sysState.locale }) !==
			JSON.stringify(values) && values.profile?.name.trim() !== ''
	);

	async function save() {
		if (!submittable) return;
		const localeChanged = values.locale !== sysState.locale;
		const profileChanged = JSON.stringify(authState.profile) !== JSON.stringify(values.profile);

		if (values.profile && profileChanged) {
			const res = await modifyProfile({ name: values.profile.name });
			if (res?.error) {
				sysState.defaultError(res.error.message as TextCode);
			}
		}

		if (localeChanged) {
			await preferences.locale.set(values.locale);
			window.location.reload();
		}
	}
</script>

{sysState.uiTexts.VERSION}: {version}
{#if sysState.remoteAppVersion?.value === version}
	(latest)
{:else}
	(↑{sysState.remoteAppVersion?.value})
{/if}

<div
	class="center-content flex-row flex-wrap gap-1 *:rounded-md *:px-1.5 *:py-0.5 *:text-white *:shadow-inner *:shadow-black/30"
>
	<button class="bg-rose-800" onclick={() => sysState.routeTo('account')}>
		{sysState.uiTexts.ACCOUNT}
	</button>
	{#if !sysState.processing}
		<button onclick={() => sysState.process(signOut)} class="flex flex-row bg-purple-700">
			{sysState.uiTexts.SIGNOUT}
			<Icon icon="mdi:exit-run" class="text-xl" />
		</button>
	{/if}
</div>

<div class="flex flex-col gap-1 text-center text-black">
	<h2>{sysState.uiTexts.PROFILE}</h2>
	{#if values.profile}
		<Form submitFunction={modifyProfile} class="flex flex-row">
			<span class="rounded-l-lg bg-red-600 px-3 text-white shadow-inner shadow-red-900">
				{sysState.uiTexts.NAME}
			</span>
			<input
				maxlength="10"
				minlength="1"
				type="text"
				bind:value={values.profile.name}
				class="rounded-r-lg border-y-[1px] border-r-2 border-red-600 bg-yellow-100 text-black"
			/>
			<SubmitBtn>
				<Icon icon="zondicons:save-disk" class="ml-1 text-cyan-800" />
			</SubmitBtn>
		</Form>
	{/if}
</div>
<div class="center-content flex-col">
	<h2>{sysState.uiTexts.SYSTEM}</h2>
	<div class="flex flex-row gap-1">
		<h3>{sysState.uiTexts.LANGUAGE}</h3>
		{#each LOCALES as lang}
			{@const selected = lang === values.locale}
			<input id="{lang}-option" type="radio" value={lang} bind:group={values.locale} hidden />
			<label for="{lang}-option" class="{selected ? 'bg-black text-white' : ''} px-1">
				{UI_TEXTS[lang].LOCALE}
			</label>
		{/each}
	</div>
</div>
{#if submittable}
	<button class="center-content w-full" onclick={save}>
		<Icon icon="zondicons:save-disk" class="size-5 text-cyan-800" />
	</button>
{/if}
