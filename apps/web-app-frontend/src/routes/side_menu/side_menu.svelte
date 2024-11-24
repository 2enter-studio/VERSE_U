<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';

	import { sysState } from '@/states';
	import { Dialog } from '@/components';
	import { elements } from './config';
	import { elements as games } from './mini_game/config';
	import { elements as others } from './others/config';

	let gameSelected = $state<keyof typeof games | null>(null);
	let otherSelected = $state<keyof typeof others | null>(null);

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
			name: 'OTHERS',
			icon: 'pepicons-pop:dots-y-circle-filled',
			class: 'bg-gray-700',
			open: false,
			dialogClass: 'flex-col text-center p-0'
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
		{@const textCode = `SIDE_MENU_${gameSelected ?? otherSelected ?? name}_TITLE`}
		{@const title = sysState.uiTexts[textCode]}
		<input id="side_menu_item_{name}" type="checkbox" bind:checked={item.open} hidden class="hidden" />
		<label for="side_menu_item_{name}">
			<Icon {icon} class="text-white size-10 rounded-full p-1.5 shadow-inner shadow-black/40 {className} shepherd-side-menu-{name}" />
		</label>
		<Dialog {title} bind:open={item.open} class="{dialogClass} ">
			{#if name === 'MINI_GAME'}
				<svelte:component this={elements.MINI_GAME} bind:selected={gameSelected} />
			{:else if name === 'OTHERS'}
				<svelte:component this={elements.OTHERS} bind:selected={otherSelected} bind:open={item.open} />
			{:else}
				<svelte:component this={elements[name]} />
			{/if}
		</Dialog>
	{/each}
</div>
