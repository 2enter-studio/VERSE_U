<script lang="ts" context="module">
	import { load, createError } from '@/utils';
	import { authState } from '@/states';
	import * as systemApi from '@/api/system';

	async function reload() {
		await Promise.all([load.peopleNearBy(), load.chats()]);
		gameState.chat_id = null;
	}

	async function blockUser(args: { blocked: string }) {
		if (!authState.user) return createError('USER_NOT_FOUND');
		const resp = await systemApi.blockUser(args);
		if (!resp.ok) return createError('FAILED_TO_BLOCK_USER');
		const data = await resp.json();
		gameState.block_users.push(data);

		await reload();
	}

	async function unBlockUser(args: { blocked: string }) {
		const user_id = authState.user?.id;
		if (!user_id) return createError('USER_NOT_FOUND');

		const { blocked } = args;

		const { error } = await db
			.from('block_users')
			.delete()
			.eq('blocker', user_id)
			.eq('blocked', blocked);
		if (error) return { error };

		gameState.block_users = gameState.block_users.filter((u) => u.blocked !== blocked);

		await reload();
	}

	export { blockUser };
</script>

<script lang="ts">
	import moment from 'moment';
	import { gameState, sysState } from '@/states';
	import { Form, SubmitBtn } from '@/components';
</script>

{#if gameState.block_users.length !== 0}
	{#each gameState.block_users as { blocked: id, created_at }}
		<Form submitFunction={unBlockUser} confirmMessage="CONFIRM_EXECUTION">
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
