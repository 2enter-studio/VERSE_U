import { baseUrl } from './utils';

async function getChats(userId: string, chatIds?: string[]) {
  try {
    const res = await fetch(`${baseUrl}/api/chats/${userId}?chatIds=${chatIds}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export { getChats };