import { createError, validate, load } from '@/utils';
import { db } from '@/db';
import { authState, gameState } from '@/states';

async function startNewChat(target_user_id: string, firstMessage: string) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	if (!validate.uuid(target_user_id)) return createError('USER_NOT_FOUND');
	if (firstMessage.trim() === '') return createError('OPERATION_FAILED');

	const { data, error } = await db
		.rpc('start_new_chat', {
			target_user_id,
			first_message: firstMessage
		})
		.returns<string>();

	if (error) {
		console.error(error);
		return createError('OPERATION_FAILED');
	}
	console.log(data);
	await load.chats([data]);
	// await loadChats([new_chat_id]);
	gameState.chat_id = data;
}

async function agreeFriendShip() {
	const { chat_id } = gameState;
	const user_id = authState.user?.id;
	if (!chat_id || !user_id) return createError('USER_NOT_FOUND');

	const { error } = await db.rpc('agree_friendship', { chat_id });

	if (error) {
		console.error(error);
		return createError('OPERATION_FAILED');
	}
	await load.chats([chat_id]);
}

function getMemberFromChat(chat: Chatroom, target: 'me' | 'other' = 'other') {
	if (target === 'me') {
		return chat.chat_members.find((m) => m.user.user === authState.user?.id);
	} else {
		return chat.chat_members.find((m) => m.user.user !== authState.user?.id);
	}
}

async function clearExpiredChats() {
	const user_id = authState.user?.id;
	if (!user_id || gameState.chats.length === 0) {
		console.error('user or chats not found');
		return createError('USER_NOT_FOUND');
	}

	const deleteIds = gameState.chats
		.filter((chat) => chat.chat_members.some((member) => !member.agree))
		.map((c) => c.id);

	const { error } = await db.from('chats').delete().in('id', deleteIds);
	if (error) {
		console.error(error);
	}
	await load.chats();
}
export { startNewChat, agreeFriendShip, getMemberFromChat, clearExpiredChats };
