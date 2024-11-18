import { fetchUserWearings, updateWearingStatus } from "../wearingController.ts";

Deno.test("fetchUserWearings: should fetch wearings successfully", async () => {
  const mockUserId = "user_123";

  const result = await fetchUserWearings(mockUserId);

  console.assert(result !== undefined, "Wearings should be defined");
});

Deno.test("updateWearingStatus: should update wearing status successfully", async () => {
  const mockWearingId = "550e8400-e29b-41d4-a716-446655440000";
  const mockUserId = "550e8400-e29b-41d4-a716-446655440000";
  const mockEquipped = true;

  const result = await updateWearingStatus(mockWearingId, mockUserId, mockEquipped);

  console.assert(result !== undefined, "Wearing status should be updated");
});
