import { db as supabase } from "../utils/supabaseClient.ts";

export const getProfileByUserId = async (userId: string) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user", userId)
    .returns<Tables<'profiles'>[]>()
    .single();
};

export const updateProfileByUserId = async (userId: string, updates: Record<string, unknown>) => {
  return await supabase
    .from("profiles")
    .update(updates)
    .eq("user", userId)
    .select()
    .returns<Tables<'profiles'>[]>()
    .single();
};

export const createProfile = async (userId: string, name: string, options?: Record<string, unknown>) => {
  return await supabase
    .from("profiles")
    .insert({ user: userId, name, ...options })
    .select("*")
    .returns<Tables<'profiles'>[]>()
    .single();
};

export const updateTrip = async (userId: string, value: Record<string, unknown>) => {
  return await supabase
    .from("trips")
    .update(value)
    .eq("user", userId)
    .select()
    .single();
};

export const getTrip = async (userId: string) => {
  return await supabase
    .from("trips")
    .select()
    .eq("user", userId)
    .single();
};

export const setTrip = async (value: Record<string, unknown>) => {
  return await supabase.functions.invoke('set-trip', {
    body: value
  });
};
