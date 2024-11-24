import { assertEquals } from "https://deno.land/std@0.220.1/testing/asserts.ts";
import { login, register } from "../authController.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";
// Mock data
const mockUser = {
  id: "123",
  email: "test@example.com"
};

const mockProfile = {
  id: "456",
  user: mockUser.id,
  name: "Test User"
};

const mockSession = {
  access_token: "mock_token",
  refresh_token: "mock_refresh",
  expires_in: 3600
};

// Mock Supabase client
const mockSupabase = {
  auth: {
    signInWithPassword: () => Promise.resolve({ 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    }),
    signUp: () => Promise.resolve({ 
      data: { user: mockUser, session: mockSession }, 
      error: null 
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: mockProfile, error: null })
      }),
    }),
    insert: () => Promise.resolve({ error: null })
  })
};

// Replace real Supabase client with mock
Object.assign(supabase, mockSupabase);

Deno.test("login: should succeed with valid credentials", async () => {
  const result = await login("test@example.com", "password123");
  assertEquals(result.user.id, mockUser.id);
  assertEquals(result.session.access_token, mockSession.access_token);
});

Deno.test("register: should register a user successfully", async () => {
  const result = await register("test@example.com", "password123", "Test User");
  assertEquals(result.user?.id, mockUser.id);
  assertEquals(result.session?.access_token, mockSession.access_token);
});