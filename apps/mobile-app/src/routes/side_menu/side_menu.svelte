<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	import { sysState } from '@/states';
	import { Dialog } from '@/components';
	import { elements } from './config';
	import { elements as games } from './mini_game/config';

	let gameSelected = $state<keyof typeof games | null>(null);

	type Item = {
		name: keyof typeof elements;
		icon: string;
		open: boolean;
		class: string;
		dialogClass: string;
	};

	let items = $state<Item[]>([
		{
			name: 'MINI_GAME',
			icon: 'fluent-emoji-high-contrast:joystick',
			class: 'bg-purple-700',
			open: false,
			dialogClass: 'flex-col text-center p-0'
		},
		{
			name: 'TRIP_INFO',
			icon: 'material-symbols:trip-outline-sharp',
			class: 'bg-amber-700',
			open: false,
			dialogClass: 'flex-col text-center'
		},
		{
			name: 'SOCIAL',
			icon: 'fluent:people-48-filled',
			class: 'bg-cyan-700',
			open: false,
			dialogClass: 'flex-col text-center'
		},
		{
			name: 'SETTINGS',
			icon: 'mage:settings-fill',
			class: 'bg-gray-400',
			open: false,
			dialogClass: 'center-content flex-col text-center text-sm gap-1'
		}
	]);
</script>

<div
	transition:fly={{ x: 100 }}
	class="pointer-events-auto z-[10] flex flex-col gap-1 rounded-l-3xl bg-gray-200 p-1.5 shadow-inner shadow-black/40"
>
	{#each items as item, i}
		{@const { icon, class: className, name, dialogClass } = item}
		{@const textCode = gameSelected
			? `MINI_GAME_${gameSelected ?? name}_TITLE`
			: `SIDE_MENU_${name}_TITLE`}
		{@const title = sysState.uiTexts[textCode]}
		<input id="side_menu_item_{name}" type="checkbox" bind:checked={items[i].open} hidden />
		<label for="side_menu_item_{name}">
			<Icon {icon} class="size-10 rounded-full p-1.5 shadow-inner shadow-black/40 {className}" />
		</label>
		<Dialog {title} bind:open={items[i].open} class="{dialogClass} ">
			{#if name === 'MINI_GAME'}
				<svelte:component this={elements.MINI_GAME} bind:selected={gameSelected} />
			{:else}
				<svelte:component this={elements[name]} />
			{/if}
		</Dialog>
	{/each}
</div>
