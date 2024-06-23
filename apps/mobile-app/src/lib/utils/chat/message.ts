import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { db } from '@/db';
import { auth, gameState } from '@/states';
import { createError } from '@/utils/error';
import { getCurrentYearMonth } from '@/utils/time';
import { loadChats } from './chat_info';
import type { Tables } from '@repo/config/supatypes';

async function sendMessage(content: string, reply_to?: string) {
	const { chat_id } = gameState;
	const user_id = auth.user?.id;
	if (!chat_id || !user_id) return createError('no chat found');

	const insertData = {
		chat: chat_id,
		content,
		reply_to
	};

	const { data, error } = await db
		.from('chat_messages')
		.insert(insertData)
		.select()
		.returns<Tables<'chat_messages'>[]>()
		.single();

	if (error) return { error };

	gameState.chats.find((chat) => chat.id === chat_id)?.chat_messages.push(data);

	// chats.update((chats) => {
	// 	return chats.map((c) => {
	// 		if (c.id === chat_id) {
	// 			c.chat_messages.push(data);
	// 			return c;
	// 		}
	// 		return c;
	// 	});
	// });
	return data;
}

function subscribeToMessages() {
	const tableName = `chat_messages_${getCurrentYearMonth()}`;
	db.channel(`chat_messages_${getCurrentYearMonth()}`)
		.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: tableName,
				filter: `sender=neq.${auth.user?.id}`
			},
			async (payload: RealtimePostgresInsertPayload<Tables<'chat_messages'>>) => {
				console.log('received new message', payload);
				const newMessage = payload.new;
				const messageChatId = newMessage.chat;
				if (!gameState.chats.some((c) => c.id === messageChatId)) {
					await loadChats([messageChatId]);
				}

				gameState.chats.find((chat) => chat.id === messageChatId)?.chat_messages.push(newMessage);

				// chats.update((chats) => {
				// 	return chats.map((c) => {
				// 		if (c.id === messageChatId) {
				// 			c.chat_messages.push(newMessage);
				// 			return c;
				// 		}
				// 		return c;
				// 	});
				// });
			}
		)
		.subscribe();
}

export { sendMessage, subscribeToMessages };
