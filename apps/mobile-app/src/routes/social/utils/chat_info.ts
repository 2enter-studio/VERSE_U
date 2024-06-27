import { createError, validate, load } from '@/utils';
import { db } from '@/db';
import { authState, gameState } from '@/states';
import { sendMessage } from './message';

async function startChat(target_user_id: string, firstMessage: string) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('no user found');

	if (!validate.uuid(target_user_id)) return createError('invalid target user id');
	if (firstMessage.trim() === '') return createError('please give a first message');

	const { data, error } = await db.from('chats').insert({}).select('id').single();
	if (error) return { error };
	const new_chat_id = data.id as string;

	{
		const insertSelf = { chat: new_chat_id };
		const insertOther = { ...insertSelf, user: target_user_id };
		const { error } = await db.from('chat_members').insert(insertSelf);
		if (error) return { error };
		{
			const { error } = await db.from('chat_members').insert(insertOther);
			if (error) return { error };
		}

		await load.chats([new_chat_id]);
		// await loadChats([new_chat_id]);
		gameState.chat_id = new_chat_id;
		const result = await sendMessage(firstMessage);
		if ('error' in result) return result;
	}
}

async function agreeFriendShip() {
	const { chat_id } = gameState;
	const user_id = authState.user?.id;
	if (!chat_id || !user_id) return createError('no chat or user found');

	const { error } = await db
		.from('chat_members')
		.update({ agree: true })
		.eq('chat', chat_id)
		.eq('user', user_id);

	if (error) return { error };
}

function getMemberFromChat(chat: Chatroom, target: 'me' | 'other' = 'other') {
	if (target === 'me') {
		return chat.chat_members.find((m) => m.user.user === authState.user?.id);
	} else {
		return chat.chat_members.find((m) => m.user.user !== authState.user?.id);
	}
}

export { startChat, agreeFriendShip, getMemberFromChat };
