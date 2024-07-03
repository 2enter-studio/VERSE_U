import { db } from '@/db';
import type { Tables } from '@repo/shared/supatypes';
import { authState, gameState, sysState } from '@/states';
import { createError, load } from '@/utils';

async function reload() {
	await Promise.all([load.peopleNearBy(), load.chats()]);
	gameState.chat_id = null;
}

async function blockUser(args: { blocked: string }) {
	if (!authState.user) return createError('USER_NOT_FOUND');
	if (!confirm(sysState.uiTexts.CONFIRM_EXECUTION)) return;
	const { data, error } = await db
		.from('block_users')
		.insert(args)
		.select()
		.returns<Tables<'block_users'>>();
	if (error) return { error };

	gameState.block_users.push(data);

	await reload();
}

async function unBlockUser(args: { blocked: string }) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');
	if (!confirm(sysState.uiTexts.CONFIRM_EXECUTION)) return;

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

export { blockUser, unBlockUser };
