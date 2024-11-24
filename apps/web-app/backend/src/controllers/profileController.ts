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

export const createProfile = async (value: Record<string, unknown>) => {
  const { data, error } = await ProfileModel.createProfile(value);
  if (error) throw new Error(error.message);
  return data;
};

export const updateTrip = async (userId: string, value: Record<string, unknown>) => {
  const { data, error } = await ProfileModel.updateTrip(userId, value);
  if (error) throw new Error(error.message);
  return data;
};

export const getTrip = async (userId: string) => {
  const { data, error } = await ProfileModel.getTrip(userId);
  if (error) throw new Error(error.message);
  return data;
};

export const setTrip = async (value: Record<string, unknown>) => {
  const { data, error } = await ProfileModel.setTrip(value);
  if (error) throw new Error(error.message);
  return data;
};
