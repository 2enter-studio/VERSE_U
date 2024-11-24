<script lang="ts">
	// import { NativeAudio } from '@capacitor-community/native-audio';
	import { sysState } from '@/states';
	import { onMount } from 'svelte';

	const audios = [{ name: 'bg', path: 'bg_music_0.mp3' }] as const;
	const usingWeb = $derived(sysState.platform === 'web');
	// const usingWeb = true;
	let touched = $state(sysState.platform !== 'web');

	// onMount(() => {
	// 	Promise.all(
	// 		audios.map(({ name, path }) =>
	// 			(async () => {
	// 				const volume = name === 'bg' ? sysState.pref.music_volume : sysState.pref.sound_volume;
	// 				await NativeAudio.preload({
	// 					assetId: name,
	// 					assetPath: usingWeb ? `audios/${path}` : `public/audios/${path}`,
	// 					volume: volume / 100,
	// 					isUrl: usingWeb
	// 				});
	// 			})()
	// 		)
	// 	).then(() => {
	// 		if (touched) NativeAudio.loop({ assetId: 'bg' });
	// 	});
	// });
</script>

{#if !touched}
	<!-- <button
		class="full-screen z-[300]"
		onclick={() => {
			NativeAudio.loop({ assetId: 'bg' });
			touched = true;
		}}
	></button> -->
{/if}
