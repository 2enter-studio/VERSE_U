import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getUserWearings, toggleWearingStatus } from "../wearingModel.ts";
import { db as supabase } from "../../utils/supabaseClient.ts";

// Mock data
const mockWearing = {
  id: "123",
  owner: "123e4567-e89b-12d3-a456-426614174000",
  wearing: "456",
  equipped: true
};

// Mock Supabase client
const mockSupabase = {
  from: () => ({
    select: () => ({
      eq: () => Promise.resolve({ data: [mockWearing], error: null })
    }),
    update: () => ({
      eq: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: mockWearing, error: null })
          })
        })
      })
    })
  })
};

// Replace real Supabase client with mock
Object.assign(supabase, mockSupabase);

Deno.test("getUserWearings: should return wearings for a user", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { error } = await getUserWearings(mockUserId);
  assertEquals(error, null);
});

Deno.test("toggleWearingStatus: should toggle wearing status successfully", async () => {
  const mockWearingId = "123";
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const mockEquipped = true;
  
  const { error } = await toggleWearingStatus(mockWearingId, mockUserId, mockEquipped);
  assertEquals(error, null);
});