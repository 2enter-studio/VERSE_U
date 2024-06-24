import { createError, validate } from '@/utils';
import { db } from '@/db';
import { auth, gameState } from '@/states';
import { sendMessage } from '@/utils/chat/message';

async function loadChats(chat_ids?: string[]) {
	const user_id = auth.user?.id;
	if (!user_id) return createError('no user found');

	const setAll = !!chat_ids;

	// fetch chat ids from profile if not provided
	if (!chat_ids) {
		const { data, error } = await db
			.from('profiles')
			.select('chats(id)')
			.eq('user', user_id)
			.single();

		if (error) {
			console.error(error);
			// chats.set([]);
			return { error };
		}
		chat_ids = data.chats.map((c) => c.id);
	}

	// validate chat ids
	if (chat_ids.some((id) => !validate.uuid(id))) return createError('invalid chat id');

	{
		const { data, error } = await db
			.from('chats')
			.select('*, chat_members(agree, user(*)), chat_messages(*)')
			// .gt('chat_messages.created_at', 'now() - interval "1 days"')
			.in('id', chat_ids)
			.returns<Chatroom[]>();

		if (error) {
			console.error(error);
			// chats.set([]);
			return { error };
		}

		// for (const chat of data as unknown as Chatroom[]) {
		// 	if (chat.chat_messages.length === 0) {
		// 		// lookupTime -= 1000 * 60 * 60 * 24 * 30;
		// 		const { data, error } = await db
		// 			.from('chat_messages')
		// 			.select('*')
		// 			.eq('chat', chat.id)
		// 			.gt('created_at', targetDate);
		// 	}
		// }

		if (setAll) {
			gameState.chats = data;
		} else {
			for (const d of data) {
				const chat = gameState.chats.find((c) => c.id === d.id);
				if (chat) {
					Object.assign(chat, d);
				} else {
					gameState.chats.push(d);
					// chats.set([...get(chats), d]);
				}
			}
		}
	}
}

async function startChat(target_user_id: string, firstMessage: string) {
	const user_id = auth.user?.id;
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

		await loadChats([new_chat_id]);
		gameState.chat_id = new_chat_id;
		const result = await sendMessage(firstMessage);
		if ('error' in result) return result;
	}
}

async function agreeFriendShip() {
	const { chat_id } = gameState;
	const user_id = auth.user?.id;
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
		return chat.chat_members.find((m) => m.user.user === auth.user?.id);
	} else {
		return chat.chat_members.find((m) => m.user.user !== auth.user?.id);
	}
}

function subscribeToAgree() {
	db.channel('chat_members')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'chat_members'
			},
			async (payload) => {
				console.log('received new agree', payload);
				const { agree, chat } = payload.new;

				await loadChats([chat]);
			}
		)
		.subscribe();
}

export { loadChats, startChat, agreeFriendShip, subscribeToAgree, getMemberFromChat };
