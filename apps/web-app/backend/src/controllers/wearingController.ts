import * as WearingModel from "../models/wearingModel.ts";

export const fetchUserWearings = async (userId: string) => {
  const { data, error } = await WearingModel.getUserWearings(userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateWearingStatus = async (wearingId: string, userId: string, equipped: boolean) => {
  const { data, error } = await WearingModel.toggleWearingStatus(wearingId, userId, equipped);
  if (error) throw new Error(error.message);
  return data;
};
