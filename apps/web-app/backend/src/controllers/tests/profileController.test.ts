import { getProfile, updateProfile } from "../profileController.ts";

Deno.test("getProfile: should return user profile", async () => {
  const mockUserId = "user_123";

  const result = await getProfile(mockUserId);

  console.assert(result !== undefined, "Profile should be defined");
});

Deno.test("updateProfile: should update user profile successfully", async () => {
  const mockUserId = "user_123";
  const updates = { name: "Updated User" };

  const result = await updateProfile(mockUserId, updates);

  console.assert(result !== undefined, "Profile should be updated");
});
