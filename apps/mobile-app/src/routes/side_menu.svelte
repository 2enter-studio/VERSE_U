<script lang="ts">
	import moment from 'moment';
	import { triggerHaiAn } from '@/utils/hai_an';
	import { unBlockUser } from '$routes/social/utils';
	import { gameState, sysState } from '@/states';
	import { Dialog, Form, SubmitBtn } from '@/components';
	import Icon from '@iconify/svelte';
	import { Settings } from '$routes';

	const items = [
		{
			id: 0,
			name: 'hai_an',
			icon: 'material-symbols:card-travel-outline-rounded',
			open: false,
			class: ''
		},
		{
			id: 1,
			name: 'social',
			icon: 'material-symbols:card-travel-outline-rounded',
			open: false,
			class: 'bg-cyan-700'
		},
		{ id: 2, name: 'settings', icon: 'mage:settings-fill', class: 'bg-amber-300', open: false }
	] as const;
</script>

<div class="pointer-events-auto flex flex-col gap-1 rounded-full bg-orange-300 p-1">
	{#each items as item}
		{@const { id, icon, class: className, name } = item}
		<input id="side_menu_item_{name}" type="checkbox" bind:checked={items[id].open} hidden />
		<label for="side_menu_item_{name}">
			<Icon {icon} class="size-8 rounded-full bg-red-800 p-1 {className}" />
		</label>
	{/each}
</div>

<Dialog title="Hai An Road" bind:open={items[0].open} class="center-content flex-col text-black">
	<Form submitFunction={triggerHaiAn}>
		<input type="text" name="passcode" />
		<SubmitBtn>Go</SubmitBtn>
	</Form>
</Dialog>

<Dialog title="Block List" bind:open={items[1].open} class="center-content flex-col text-black">
	{#each gameState.block_users as { blocked: id, created_at }}
		<Form submitFunction={unBlockUser}>
			<input id="block_user_{id}" name="blocked" value={id} hidden />
			<label for="block_user_{id}">
				{moment(created_at).format('YY-MM-DD HH:mm A')}
			</label>
			<SubmitBtn>Unblock</SubmitBtn>
		</Form>
	{/each}
</Dialog>
<Dialog
	bind:open={items[2].open}
	title={sysState.uiTexts.SETTINGS}
	class="max-h-1/3 center-content flex-col gap-3 text-sm text-black"
>
	<Settings />
</Dialog>
