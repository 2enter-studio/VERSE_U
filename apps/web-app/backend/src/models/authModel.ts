import { db as supabase } from "../utils/supabaseClient.ts";

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const getSession = async (access_token?: string, refresh_token?: string) => {
  return await supabase.auth.getSession({ access_token, refresh_token });
};

export const signInAnonymous = async () => {
  return await supabase.auth.signInAnonymously()
};

export const setPassword = async (password: string) => {
  return await supabase.auth.updateUser({ password });
};

export const changePassword = async (old_password: string, new_password: string) => {
  return await supabase.auth.updateUser({ password: old_password, password: new_password });
};

export const forgetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.PUBLIC_URL}/reset-password`,
  });
};

export const signInWithOAuth = async (provider: OAuthProvider, options?: { redirectTo?: string }) => {
  return await supabase.auth.signInWithOAuth({ provider, options });
};

export const logout = async () => {
  return await supabase.auth.signOut();
};

export const removeOneOOnePlayer = async (anon_key: string ) => {
  return await supabase.from('one_o_one_player').delete().eq('anon_key', anon_key);
};

export const insertOneOOnePlayer = async (anon_key: string, wearings) => {
  console.log('insertOneOOnePlayer', anon_key, wearings);
  return await supabase.from('one_o_one_player').insert({ anon_key, wearings });
};

export const getOneOOnePlayerById = async (anon_key: string, allowNotExisting = false) => {
  // allow not existing
  const { data, error } = await supabase.from('one_o_one_player').select('*').eq('anon_key', anon_key).single();
  if (error && !allowNotExisting) throw error;
  return data || null;
};
