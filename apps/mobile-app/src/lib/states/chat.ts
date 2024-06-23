import { derived, writable } from 'svelte/store';
import { auth } from './auth.svelte';

// const chat = writable<Chatroom | null>(null);
const chats = writable<Chatroom[]>([]);
const chatIds = derived(chats, ($chats) => $chats.map((c) => c.id));
const chatId = writable<string | null>(null);
const chat = derived([chats, chatId], ([$chats, $chat_id]) => {
	return $chats.find((c) => c.id === $chat_id) ?? null;
});

const strangers = derived(chats, ($chats) => {
	return $chats.filter((c) => c.chat_members.some((m) => !m.agree));
});

const friends = derived(chats, ($chats) => {
	return $chats.filter((c) => c.chat_members.every((m) => m.agree));
});

function getMemberFromChat(chat: Chatroom, target: 'me' | 'other' = 'other') {
	if (target === 'me') {
		return chat.chat_members.find((m) => m.profiles.user === auth.user?.id);
	} else {
		return chat.chat_members.find((m) => m.profiles.user !== auth.user?.id);
	}
}

export { chat, chats, chatId, chatIds, strangers, friends, getMemberFromChat };
