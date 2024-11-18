import { getProfileByUserId, updateProfileByUserId } from "../profileModel.ts";

Deno.test("getProfileByUserId: should return user profile", async () => {
  const mockUserId = "user_123";

  const { data, error } = await getProfileByUserId(mockUserId);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});

Deno.test("updateProfileByUserId: should update user profile successfully", async () => {
  const mockUserId = "user_123";
  const updates = { name: "Updated User" };

  const { data, error } = await updateProfileByUserId(mockUserId, updates);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});
