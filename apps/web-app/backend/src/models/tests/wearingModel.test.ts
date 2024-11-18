import { assertEquals } from "https://deno.land/std@0.220.1/testing/asserts.ts";
import { getUserWearings, toggleWearingStatus } from "../wearingModel.ts";

Deno.test("getUserWearings: should return wearings for a user", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { data, error } = await getUserWearings(mockUserId);
  assertEquals(error, null);
});

Deno.test("toggleWearingStatus: should toggle wearing status successfully", async () => {
  const mockWearingId = "123e4567-e89b-12d3-a456-426614174002";
  const mockUpdate = {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    equipped: true
  };
  
  const { data, error } = await toggleWearingStatus(mockWearingId, mockUpdate.userId, mockUpdate.equipped);
  assertEquals(error, null);
});