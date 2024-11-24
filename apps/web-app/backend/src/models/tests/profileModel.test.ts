import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getProfileByUserId, updateProfileByUserId } from "../profileModel.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";
// Mock data
const mockProfile = {
  id: "123",
  name: "Test User",
  user: "123e4567-e89b-12d3-a456-426614174000"
};

// Mock Supabase client
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({ data: mockProfile, error: null })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          maybeSingle: () => Promise.resolve({ data: mockProfile, error: null })
        })
      })
    })
  })
};

// Replace real Supabase client with mock
Object.assign(supabase, mockSupabase);

Deno.test("getProfileByUserId: should return user profile", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { error } = await getProfileByUserId(mockUserId);
  assertEquals(error, null);
});

Deno.test("updateProfileByUserId: should update user profile successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const mockUpdate = {
    name: "Updated Name"
  };
  
  const { error } = await updateProfileByUserId(mockUserId, mockUpdate);
  assertEquals(error, null);
});