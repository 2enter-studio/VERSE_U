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

export const getMeshes = async () => {
  const { data, error } = await WearingModel.getMeshes();
  if (error) throw new Error(error.message);
  return data;
};

export const getWearings = async () => {
  const { data, error } = await WearingModel.getWearings();
  if (error) throw new Error(error.message);
  return data;
};

export const getOwnedWearings = async (user_id: string) => {
  const { data, error } = await WearingModel.getOwnedWearings(user_id);
  if (error) throw new Error(error.message);
  return data;
};

export const insertStarterPack = async (data: { id: string }[]) => {
  const { error } = await WearingModel.insertStarterPack(data);
  if (error) throw new Error(error.message);
  return data;
};

export const getStarterPack = async () => {
  const { data, error } = await WearingModel.getStarterPack();
  if (error) throw new Error(error.message);
  return data;
};

export const insertOwnedWearings = async (userId: string, wearingId: string) => {
  const { error } = await WearingModel.insertOwnedWearings(userId, wearingId);
  if (error) throw new Error(error.message);
  return data;
};

export const equipWearings = async (userId: string, wearingIds: string[]) => {
  const { error } = await WearingModel.equipWearings(userId,  wearingIds);
  if (error) throw new Error(error.message);
  return wearingIds;
};
