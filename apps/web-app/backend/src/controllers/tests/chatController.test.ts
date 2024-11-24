import { assertEquals } from "https://deno.land/std@0.220.1/testing/asserts.ts";
import { fetchUserChats, fetchChatMessages, postMessage } from "../chatController.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";

// Mock data
const mockChat = {
  chat_id: "123",
  chats: {
    id: "123",
    is_group_chat: false,
    created_at: new Date().toISOString()
  }
};

const mockMessage = {
  id: "456",
  chat: mockChat.chat_id,
  content: "Test message",
  sender: "123e4567-e89b-12d3-a456-426614174000"
};

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          limit: () => Promise.resolve(
            table === "chat_members"
              ? [mockChat]
              : [mockMessage]
          )
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve(mockMessage)
      })
    })
  })
};

const originalSupabase = { ...supabase };
Object.assign(supabase, mockSupabase);

Deno.test("fetchUserChats: should fetch user chats successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const result = await fetchUserChats(mockUserId);
  assertEquals(Array.isArray(result), true);
});

Deno.test("fetchChatMessages: should fetch chat messages successfully", async () => {
  const mockChatId = "123";
  const result = await fetchChatMessages(mockChatId);
  assertEquals(Array.isArray(result), true);
});

Deno.test("postMessage: should send a message successfully", async () => {
  const mockMessage = {
    chat: "123",
    content: "Test message",
    sender: "123e4567-e89b-12d3-a456-426614174000"
  };
  
  const result = await postMessage(mockMessage.chat, mockMessage.content, mockMessage.sender);
  assertEquals(result.content, mockMessage.content);
});

Object.assign(supabase, originalSupabase);
