import { get } from 'svelte/store';
import { loadChats } from '@/utils/chat';
import { setAuth, loggedIn } from '@/stores';

// export const load = async () => {
// 	if (!get(loggedIn)) await setAuth();
// 	console.log(chats);
// 	if ('error' in chats) {
// 		console.error(chats.error);
// 		return { chats: [] };
// 	}
// 	return { chats };
// };
