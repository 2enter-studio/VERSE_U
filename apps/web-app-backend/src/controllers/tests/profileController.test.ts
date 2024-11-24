import { assertEquals } from "https://deno.land/std@0.220.1/testing/asserts.ts";
import { getProfile, updateProfile } from "../profileController.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";

// Mock data
const mockProfile = {
  id: "123",
  name: "Test User",
  user: "123e4567-e89b-12d3-a456-426614174000"
};

const mockUpdate = {
  name: "Updated Name"
};

// Mock Supabase client
const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        maybeSingle: () => Promise.resolve({
          data: table === "profiles" ? mockProfile : null,
          error: null
        })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          maybeSingle: () => Promise.resolve({
            data: { ...mockProfile, ...mockUpdate },
            error: null
          })
        })
      })
    })
  })
};

const originalSupabase = { ...supabase };
Object.assign(supabase, mockSupabase);

Deno.test("getProfile: should return user profile", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const data = await getProfile(mockUserId);
  assertEquals(data.id, mockProfile.id);
  assertEquals(data.name, mockProfile.name);
});

Deno.test("updateProfile: should update user profile successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

  const data = await updateProfile(mockUserId, mockUpdate);
  assertEquals(data.id, mockProfile.id);
  assertEquals(data.name, mockUpdate.name);
});

// 還原 Supabase 客戶端
Object.assign(supabase, originalSupabase);
