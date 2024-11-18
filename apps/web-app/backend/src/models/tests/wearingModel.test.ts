import { getUserWearings, toggleWearingStatus } from "../wearingModel.ts";

Deno.test("getUserWearings: should return wearings for a user", async () => {
  const mockUserId = "user_123";

  const { data, error } = await getUserWearings(mockUserId);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});

Deno.test("toggleWearingStatus: should toggle wearing status successfully", async () => {
  const mockWearingId = "wearing_123";
  const mockUserId = "user_123";
  const mockEquipped = true;

  const { data, error } = await toggleWearingStatus(mockWearingId, mockUserId, mockEquipped);

  console.assert(data !== undefined, "Data should be defined");
  console.assert(error === null, "Error should be null");
});
