import * as SystemModel from "../models/systemModal.ts";

export const getPreference = async () => {
  return await SystemModel.getPreference();
};

export const getMaintenance = async () => {
  const { data, error } = await SystemModel.getMaintenance();
  if (error) throw new Error(error.message);
  return data;
};

export const getAppVersion = async () => {
  const { data, error } = await SystemModel.getAppVersion();
  if (error) throw new Error(error.message);

  return data;
};

export const getSponsors = async (user_id?: string) => {
  const { data, error } = await SystemModel.getSponsors(user_id);
  if (error) throw new Error(error.message);
  return data;
};

export const getRegions = async () => {
  const { data, error } = await SystemModel.getRegions();
  if (error) throw new Error(error.message);
  return data;
};

export const getPeopleNearBy = async (user_id: string, trip: Trip) => {
  const { data, error } = await SystemModel.getPeopleNearBy(user_id, trip);
  if (error) throw new Error(error.message);
  return data.map((row) => row.user).filter(Boolean);
};

export const getBlockUsers = async () => {
  const { data, error } = await SystemModel.getBlockUsers();
  if (error) throw new Error(error.message);
  return data;
};

export const blockUser = async (args: Record<string, unknown>) => {
  const { error } = await SystemModel.blockUser(args);
  if (error) throw new Error(error.message);
  return true;
};

export const getMLTexts = async (row_ids: string[], column_names: string[], locale: string) => {
  const { data, error } = await SystemModel.getMLTexts(row_ids, column_names, locale);
  if (error) throw new Error(error.message);
  return data;
};
