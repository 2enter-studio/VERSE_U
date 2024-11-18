import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getProfile, updateProfile } from "../profileController.ts";

Deno.test("getProfile: should return user profile", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const result = await getProfile(mockUserId);
  assertEquals(result.error, null);
});

Deno.test("updateProfile: should update user profile successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const mockUpdate = {
    name: "Updated Name"
  };
  
  const result = await updateProfile(mockUserId, mockUpdate);
  assertEquals(result.error, null);
});