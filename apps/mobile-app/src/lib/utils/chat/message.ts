import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';
import { get } from 'svelte/store';

import { db } from '@/db';
import { chat, chatId, chats, user } from '@/stores';
import { createError } from '@/utils/error';
import { getCurrentYearMonth } from '@/utils/time';
import { loadChats } from './chat_info';
import type { Tables } from '@repo/config/supatypes';

async function getMessages() {
	const chat_id = get(chat)?.id;
	if (!chat_id) return createError('no chat found');

	const { data, error } = await db
		.from('chat_messages')
		.select('*')
		.eq('chat', chat_id)
		.returns<Tables<'chat_messages'>[]>();
	if (error) return { error };
	return data;
}

async function sendMessage(content: string, reply_to?: string) {
	const chat_id = get(chatId);
	const user_id = get(user)?.id;
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

	chats.update((chats) => {
		return chats.map((c) => {
			if (c.id === chat_id) {
				c.chat_messages.push(data);
				return c;
			}
			return c;
		});
	});
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
				filter: `sender=neq.${get(user)?.id}`
			},
			async (payload: RealtimePostgresInsertPayload<Tables<'chat_messages'>>) => {
				console.log('received new message', payload);
				const newMessage = payload.new;
				const messageChatId = newMessage.chat;
				if (!get(chats).some((c) => c.id === messageChatId)) {
					await loadChats([messageChatId]);
				}
				chats.update((chats) => {
					return chats.map((c) => {
						if (c.id === messageChatId) {
							c.chat_messages.push(newMessage);
							return c;
						}
						return c;
					});
				});
			}
		)
		.subscribe();
}

export { getMessages, sendMessage, subscribeToMessages };
