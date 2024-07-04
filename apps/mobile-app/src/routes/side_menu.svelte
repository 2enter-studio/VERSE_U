<script lang="ts">
	import moment from 'moment';
	import { triggerHaiAn } from '@/utils';
	import { unBlockUser } from '$routes/social/utils';
	import { gameState, sysState } from '@/states';
	import { Dialog, Form, SubmitBtn } from '@/components';
	import Icon from '@iconify/svelte';
	import { Settings } from '$routes';

	const items = [
		{
			id: 0,
			name: 'social',
			icon: 'fluent:people-48-filled',
			open: false,
			class: 'bg-cyan-700'
		},
		{ id: 1, name: 'settings', icon: 'mage:settings-fill', class: 'bg-gray-300', open: false },
		// {
		// 	id: 2,
		// 	name: 'hai_an',
		// 	icon: 'material-symbols:card-travel-outline-rounded',
		// 	open: false,
		// 	class: 'bg-rose-700'
		// },
	] as const;
</script>

<div
	class="pointer-events-auto z-[10] flex flex-col gap-1 rounded-full bg-gray-100 p-1 shadow-inner shadow-black/30"
>
	{#each items as item}
		{@const { id, icon, class: className, name } = item}
		<input id="side_menu_item_{name}" type="checkbox" bind:checked={items[id].open} hidden />
		<label for="side_menu_item_{name}">
			<Icon {icon} class="size-10 rounded-full p-1.5 shadow-inner shadow-black/40 {className}" />
		</label>
	{/each}
</div>

<!--<Dialog title="Hi" bind:open={items[2].open} class="center-content flex-col text-black">-->
<!--	<Form submitFunction={triggerHaiAn}>-->
<!--		<input type="text" name="passcode" />-->
<!--		<SubmitBtn>Go</SubmitBtn>-->
<!--	</Form>-->
<!--</Dialog>-->

<Dialog
	title={sysState.uiTexts.BLOCK_LIST}
	bind:open={items[0].open}
	class="center-content flex-col text-black"
>
	{#if gameState.block_users.length !== 0}
		{#each gameState.block_users as { blocked: id, created_at }}
			<Form submitFunction={unBlockUser}>
				<input id="block_user_{id}" name="blocked" value={id} hidden />
				<label for="block_user_{id}">
					{moment(created_at).format('YY-MM-DD HH:mm A')}
				</label>
				<SubmitBtn>Unblock</SubmitBtn>
			</Form>
		{/each}
	{:else}
		{sysState.uiTexts.BLOCK_LIST_EMPTY}
	{/if}
</Dialog>

<Dialog
	bind:open={items[1].open}
	title={sysState.uiTexts.SETTINGS}
	class="max-h-1/3 center-content flex-col gap-3 text-sm text-black"
>
	<Settings />
</Dialog>
