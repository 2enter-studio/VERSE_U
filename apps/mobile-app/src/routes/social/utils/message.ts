import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js';

import { db } from '@/db';
import { authState, gameState } from '@/states';
import { createError } from '@/utils';
import type { Tables } from '@repo/shared/supatypes';

async function sendMessage(content: string, reply_to?: string) {
	const { chat_id } = gameState;
	const user_id = authState.user?.id;
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

export { sendMessage };
