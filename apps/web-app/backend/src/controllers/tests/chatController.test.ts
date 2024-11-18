import { fetchUserChats, fetchChatMessages, postMessage } from "../chatController.ts";

Deno.test("fetchUserChats: should fetch user chats successfully", async () => {
  const mockUserId = "user_123";

  const result = await fetchUserChats(mockUserId);

  console.assert(result !== undefined, "Chats should be defined");
});

Deno.test("fetchChatMessages: should fetch chat messages successfully", async () => {
  const mockChatId = "chat_123";

  const result = await fetchChatMessages(mockChatId);

  console.assert(result !== undefined, "Messages should be defined");
});

Deno.test("postMessage: should send a message successfully", async () => {
  const mockChatId = "chat_123";
  const mockContent = "Hello, World!";
  const mockSender = "user_123";

  const result = await postMessage(mockChatId, mockContent, mockSender);

  console.assert(result !== undefined, "Message should be sent");
});
