import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getUserChats, getChatMessages, sendMessage } from "../chatModel.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";

// Mock data
const mockChat = {
  chat: "123",
  chats: {
    id: "123",
    is_group_chat: false,
    created_at: new Date().toISOString()
  }
};

const mockMessage = {
  id: "456",
  chat: mockChat.chat,
  content: "Test message",
  sender: "123e4567-e89b-12d3-a456-426614174000"
};

// Mock Supabase client
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [mockMessage], error: null })
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: mockMessage, error: null })
      })
    })
  })
};

// Replace real Supabase client with mock
Object.assign(supabase, mockSupabase);

Deno.test("getUserChats: should return chats for a user", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { error } = await getUserChats(mockUserId);
  assertEquals(error, null);
});

Deno.test("getChatMessages: should return messages for a chat", async () => {
  const mockChatId = "123";
  const { error } = await getChatMessages(mockChatId);
  assertEquals(error, null);
});

Deno.test("sendMessage: should send a message successfully", async () => {
  const mockMessage = {
    chat: "123",
    content: "Test message",
    sender: "123e4567-e89b-12d3-a456-426614174000"
  };
  
  const { error } = await sendMessage(mockMessage.chat, mockMessage.content, mockMessage.sender);
  assertEquals(error, null);
});