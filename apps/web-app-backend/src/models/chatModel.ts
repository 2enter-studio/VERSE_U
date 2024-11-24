import { db as supabase } from "../utils/supabaseClient.ts";

export const getUserChats = async (userId: string) => {
  return await supabase
    .from("chat_members")
    .select(`
      chat_id,
      chats (
        id,
        is_group_chat,
        created_at
      )
    `)
    .eq("user", userId);
};

export const getChatMessages = async (chatId: string) => {
  return await supabase
    .from("chat_messages")
    .select(`
      *,
      sender:profiles!chat_messages_sender_fkey (
        name,
        public_id
      )
    `)
    .eq("chat", chatId)
    .order("created_at", { ascending: false })
    .limit(50);
};

export const sendMessage = async (chatId: string, content: string, sender: string) => {
  return await supabase
    .from("chat_messages")
    .insert([{ chat: chatId, content, sender }])
    .select()
    .single();
};

export const getReloadChats = async (user_id: string, chat_ids?: string[]) => {
  return await supabase
    .from('chats')
    .select('*, chat_members(*, user(*)), chat_messages(*)');
};

export const getChatsWithoutIds = async (user_id: string) => {
  return await supabase
    .from('chats')
    .select('*, chat_members(*, user(*)), chat_messages(*)')
    .in('id', chat_ids);
};

export const getChats = async (user_id: string, chat_ids?: string[]) => {
  return await supabase
    .from('chats')
    .select('*, chat_members(*, user(*)), chat_messages(*)')
    .in('id', chat_ids);
};

export const getChatWithoutIds = async () => {
  return await supabase
    .from('chats')
    .select('*, chat_members(*, user(*)), chat_messages(*)')
};
