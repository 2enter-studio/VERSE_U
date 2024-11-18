import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";
import { getProfileByUserId, updateProfileByUserId } from "../profileModel.ts";

Deno.test("getProfileByUserId: should return user profile", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const { data, error } = await getProfileByUserId(mockUserId);
  assertEquals(error, null);
});

Deno.test("updateProfileByUserId: should update user profile successfully", async () => {
  const mockUserId = "123e4567-e89b-12d3-a456-426614174000";
  const mockUpdate = {
    name: "Updated Name"
  };
  
  const { data, error } = await updateProfileByUserId(mockUserId, mockUpdate);
  assertEquals(error, null);
});