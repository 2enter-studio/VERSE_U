import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getUserChats, getChatMessages, sendMessage } from "../chatModel.ts";

Deno.test("getUserChats: should return chats for a user", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { data, error } = await getUserChats(mockUserId);
  assertEquals(error, null);
});

Deno.test("getChatMessages: should return messages for a chat", async () => {
  const mockChatId = "123e4567-e89b-12d3-a456-426614174001";
  const { data, error } = await getChatMessages(mockChatId);
  assertEquals(error, null);
});

Deno.test("sendMessage: should send a message successfully", async () => {
  const mockMessage = {
    chat: "123e4567-e89b-12d3-a456-426614174001",
    content: "Test message",
    sender: "123e4567-e89b-12d3-a456-426614174000"
  };
  
  const { data, error } = await sendMessage(mockMessage.chat, mockMessage.content, mockMessage.sender);
  assertEquals(error, null);
});