import { getUserChats, getChatMessages, sendMessage } from "../chatModel.ts";

Deno.test("getUserChats: should return chats for a user", async () => {
  const mockUserId = "user_123";

  const { data, error } = await getUserChats(mockUserId);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});

Deno.test("getChatMessages: should return messages for a chat", async () => {
  const mockChatId = "chat_123";

  const { data, error } = await getChatMessages(mockChatId);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});

Deno.test("sendMessage: should send a message successfully", async () => {
  const mockChatId = "chat_123";
  const mockContent = "Hello, World!";
  const mockSender = "user_123";

  const { data, error } = await sendMessage(mockChatId, mockContent, mockSender);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});
