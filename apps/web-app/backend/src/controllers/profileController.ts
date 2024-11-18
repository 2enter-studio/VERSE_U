import * as ProfileModel from "../models/profileModel.ts";

export const getProfile = async (userId: string) => {
  const { data, error } = await ProfileModel.getProfileByUserId(userId);
  if (error) throw new Error(error.message);
  return data;
};

export const updateProfile = async (userId: string, updates: Record<string, unknown>) => {
  const { data, error } = await ProfileModel.updateProfileByUserId(userId, updates);
  if (error) throw new Error(error.message);
  return data;
};
