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
