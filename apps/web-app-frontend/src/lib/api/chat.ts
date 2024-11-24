import { apiUrl } from './apiUrl';

async function getChats(userId: string, chatIds?: string[]) {
  try {
    const res = await fetch(apiUrl('chats', userId, chatIds));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export { getChats };