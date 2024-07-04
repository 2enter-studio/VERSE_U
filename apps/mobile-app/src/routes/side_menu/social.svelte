<script>
	import moment from 'moment';
	import { gameState, sysState } from '@/states';
	import { unBlockUser } from '$routes/social/utils';
	import { Form, SubmitBtn } from '@/components';
</script>

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
