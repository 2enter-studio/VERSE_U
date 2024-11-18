import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { fetchUserChats, fetchChatMessages, postMessage } from "../chatController.ts";

Deno.test("fetchUserChats: should fetch user chats successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const result = await fetchUserChats(mockUserId);
  assertEquals(Array.isArray(result), true);
});

Deno.test("fetchChatMessages: should fetch chat messages successfully", async () => {
  const mockChatId = "123e4567-e89b-12d3-a456-426614174001";
  const result = await fetchChatMessages(mockChatId);
  assertEquals(Array.isArray(result), true);
});

Deno.test("postMessage: should send a message successfully", async () => {
  const mockMessage = {
    chat: "123e4567-e89b-12d3-a456-426614174001",
    content: "Test message",
    sender: "123e4567-e89b-12d3-a456-426614174000"
  };
  
  const result = await postMessage(mockMessage.chat, mockMessage.content, mockMessage.sender);
  assertEquals(result.content, mockMessage.content);
});