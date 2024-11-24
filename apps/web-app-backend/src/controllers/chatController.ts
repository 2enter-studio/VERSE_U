import * as ChatModel from "../models/chatModel.ts";

export const fetchUserChats = async (userId: string) => {
  const { data, error } = await ChatModel.getUserChats(userId);
  if (error) throw new Error(error.message);
  return data;
};

export const fetchChatMessages = async (chatId: string) => {
  const { data, error } = await ChatModel.getChatMessages(chatId);
  if (error) throw new Error(error.message);
  return data;
};

export const postMessage = async (chatId: string, content: string, sender: string) => {
  const { data, error } = await ChatModel.sendMessage(chatId, content, sender);
  if (error) throw new Error(error.message);
  return data;
};


export const fetchChats = async (user_id: string, chat_ids?: string[]) => { 
  if (!user_id) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!chat_ids) {
    const { data, error } = await ChatModel.getChatWithoutIds(user_id, chat_ids);
    if (error) throw new Error(error.message);
    return data;
  } else {
    // validate chat ids
    if (chat_ids.some((id) => !validate.uuid(id))) throw new Error('CHAT_NOT_FOUND');


    const { data, error } = await ChatModel.getChatWithIds(user_id, chat_ids);
    if (error) throw new Error(error.message);
    const result = data.filter((row) => row.chat_members.every((member) => member.user));

    return result;
  }
}


//   export const getChats = async (user_id: string, chat_ids?: string[]) => {
//   // const user_id = authState.user?.id;
//   // if (!user_id) return createError('USER_NOT_FOUND');

//   // const reload = chat_ids === undefined;

//   // if (reload) {
//     const { data, error } = await supabase
//       .from('chats')
//       .select('*, chat_members(*, user(*)), chat_messages(*)');

//     if (error) return createError('FAILED_TO_LOAD_DATA');

//     gameState.chats = data.filter((row) => row.chat_members.every((member) => member.user));
//   } else {
//     // validate chat ids
//     if (chat_ids.some((id) => !validate.uuid(id))) return createError('CHAT_NOT_FOUND');

//     const { data, error } = await supabase
//       .from('chats')
//       .select('*, chat_members(*, user(*)), chat_messages(*)')
//       .in('id', chat_ids);

//     if (error) return createError('FAILED_TO_LOAD_DATA');

//     const result = data.filter((row) => row.chat_members.every((member) => member.user));

//     for (const d of result) {
//       const chat = gameState.chats.find((c) => c.id === d.id);
//       if (chat) {
//         Object.assign(chat, d);
//       } else {
//         gameState.chats.push(d);
//       }
//     }
//   }
// };

