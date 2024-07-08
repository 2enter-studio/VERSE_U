<script lang="ts">
	import Icon from '@iconify/svelte';
	import { version } from '$app/environment';
	import { LOCALES } from '@repo/shared/config';

	import { sysState } from '@/states';
	import { signOut } from '$routes/auth/utils';
	import { preferences } from '@/utils';

	import { APP_STORE_LINK, UI_TEXTS } from '@/config';
	import { Form, SubmitBtn } from '@/components';
	import { watch } from 'runed';

	const volumeKeys = ['music_volume', 'sound_volume'] as const;

	watch(
		() => sysState.pref,
		() => {
			preferences.locale.set(sysState.pref.locale);
			preferences.music_volume.set(sysState.pref.music_volume);
			preferences.sound_volume.set(sysState.pref.sound_volume);
		}
	);
</script>

{sysState.uiTexts.VERSION}: {version}
{#if sysState.remoteAppVersion?.value === version}
	(latest)
{:else}
	<a href={APP_STORE_LINK}>
		(↑{sysState.remoteAppVersion?.value})
	</a>
{/if}

<div
	class="center-content flex-row flex-wrap gap-1 *:rounded-md *:px-1.5 *:py-0.5 *:text-white *:shadow-inner *:shadow-black/30"
>
	<button class="bg-rose-800" onclick={() => sysState.routeTo('account')}>
		{sysState.uiTexts.ACCOUNT}
	</button>
	<Form submitFunction={signOut} class="bg-purple-700">
		<SubmitBtn class="flex flex-row">
			{sysState.uiTexts.SIGNOUT}
			<Icon icon="mdi:exit-run" class="text-xl" />
		</SubmitBtn>
	</Form>
</div>

<div class="center-content flex-col gap-1">
	<!--	<h2>{sysState.uiTexts.SYSTEM}</h2>-->
	<div class="flex flex-row gap-1">
		<h3>{sysState.uiTexts.LANGUAGE}</h3>
		{#each LOCALES as lang}
			{@const selected = lang === sysState.pref.locale}
			<input
				id="{lang}-option"
				type="radio"
				value={lang}
				bind:group={sysState.pref.locale}
				hidden
			/>
			<label for="{lang}-option" class="{selected ? 'bg-black text-white' : ''} px-1">
				{UI_TEXTS[lang].LOCALE}
			</label>
		{/each}
	</div>
	{#each volumeKeys as volumeKey}
		<span>{sysState.uiTexts[volumeKey.toUpperCase()]}</span>
		<div class="flex flex-row items-center gap-1">
			<input type="range" min="0" max="100" step="1" bind:value={sysState.pref[volumeKey]} />
			{sysState.pref[volumeKey]}
		</div>
	{/each}
</div>
