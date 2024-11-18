import { db as supabase } from "../utils/supabaseClient.ts";

export const getProfileByUserId = async (userId: string) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user", userId)
    .single();
};

export const updateProfileByUserId = async (userId: string, updates: Record<string, unknown>) => {
  return await supabase
    .from("profiles")
    .update(updates)
    .eq("user", userId)
    .select()
    .single();
};

export const createProfile = async (userId: string, name: string) => {
  return await supabase
    .from("profiles")
    .insert([{ user: userId, name }]);
};
