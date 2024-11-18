import { assertEquals } from "https://deno.land/std@0.220.1/testing/asserts.ts";
import { fetchUserWearings, updateWearingStatus } from "../wearingController.ts";

Deno.test("fetchUserWearings should fetch wearings successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const result = await fetchUserWearings(mockUserId);
  assertEquals(Array.isArray(result), true);
});

Deno.test("updateWearingStatus should update wearing status successfully", async () => {
  const mockWearingId = "123e4567-e89b-12d3-a456-426614174002";
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const mockEquipped = true;
  
  const result = await updateWearingStatus(mockWearingId, mockUserId, mockEquipped);
  assertEquals(result.equipped, mockEquipped);
});