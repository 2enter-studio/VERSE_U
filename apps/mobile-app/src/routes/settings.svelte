<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deepClone } from '@repo/utils';
	import { page } from '$app/stores';
	import { version } from '$app/environment';

	import { Dialog } from '@/components';
	import { auth, general } from '../lib/states';
	import { modifyProfile, signOut } from '@/utils/auth';
	import preferences from '@/utils/preferences';

	import { LOCALES, UI_TEXTS } from '@/config';

	type Props = { open: boolean };
	let { open = $bindable() }: Props = $props();

	let values = $state({
		profile: deepClone(auth.profile),
		locale: general.locale
	});
	const submittable = $derived(
		JSON.stringify({ profile: auth.profile, locale: general.locale }) !== JSON.stringify(values) &&
			values.profile?.name.trim() !== ''
	);

	$effect(() => {
		console.log('applying settings');
		preferences.locale.set(values.locale);
	});
	async function save() {
		if (!submittable) return;
		const localeChanged = values.locale !== general.locale;
		const profileChanged = JSON.stringify(auth.profile) !== JSON.stringify(values.profile);

		if (localeChanged) {
			await preferences.locale.set(values.locale);
		}

		if (values.profile && profileChanged) {
			const res = await modifyProfile({ name: values.profile.name });
			if (res?.error) general.errorMessage = res.error.message;
		}

		if (localeChanged) {
			// const confirmed = confirm('sure!');
			// if (confirmed) {
			window.location.reload();
			// }
		}
	}
</script>

<Dialog
	bind:open
	title={general.uiTexts.settings}
	class="max-h-1/3 center-content flex-col gap-3 text-sm text-black"
>
	current url: {$page.url.href}
	<div class="flex flex-row gap-2">
		{general.uiTexts.version}: {version}
		<button onclick={signOut} class="flex flex-row bg-black text-white">
			{general.uiTexts.signout}
			<Icon icon="mdi:exit-run" class="text-xl" />
		</button>
	</div>
	<div class="flex flex-col text-black">
		<div class="center-content flex-row gap-2">
			<h2>{general.uiTexts.profile}</h2>
			<div class="flex w-fit flex-row rounded-sm bg-gray-600 px-1 text-xs text-white/80">
				{auth.profile?.public_id}
				<button
					onclick={() => {
						navigator.clipboard.writeText(auth.profile?.public_id || '');
					}}
				>
					<Icon icon="ph:copy-fill" />
				</button>
			</div>
		</div>
		{#if values.profile}
			<div class="flex flex-row">
				<label
					for="my-name"
					class="rounded-l-lg bg-red-600 px-3 text-white shadow-inner shadow-red-900"
				>
					{general.uiTexts.name}
				</label>
				<input
					id="my-name"
					maxlength="12"
					minlength="1"
					type="text"
					bind:value={values.profile.name}
					class="rounded-r-lg border-y-[1px] border-r-2 border-red-600 bg-yellow-100 text-black"
				/>
			</div>
		{/if}
	</div>
	<div class="center-content flex-col">
		<h2>{general.uiTexts.system}</h2>
		<div class="flex flex-row">
			<h3>{general.uiTexts.language}</h3>
			{#each LOCALES as lang}
				{@const selected = lang === values.locale}
				<input id="{lang}-option" type="radio" value={lang} bind:group={values.locale} hidden />
				<label for="{lang}-option" class="{selected ? 'bg-black text-white' : ''} px-1"
					>{UI_TEXTS[lang].locale}</label
				>
			{/each}
		</div>
	</div>
	{#if submittable}
		<button class="center-content w-full" onclick={save}>
			<Icon icon="zondicons:save-disk" class="size-5 text-cyan-800" />
		</button>
	{/if}
</Dialog>
