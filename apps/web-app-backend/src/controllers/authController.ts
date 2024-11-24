import * as AuthModel from "../models/authModel";
import * as ProfileModel from "../models/profileModel";
import { config } from "dotenv";
import { genPasscode } from "../utils/genKey";

const { HAI_AN_KEY } = config().parsed;

export const login = async (email: string, password: string) => {
  const { data, error } = await AuthModel.signIn(email, password);
  if (error) throw new Error(error.message);

  const { data: profile, error: profileError } = await ProfileModel.getProfileByUserId(data.user.id);
  if (profileError) throw new Error(profileError.message);

  return { user: data.user, profile, session: data.session };
};

export const anonymousLogin = async () => {
  return await AuthModel.signInAnonymous();
};

export const getSession = async (access_token?: string, refresh_token?: string) => {
  return await AuthModel.getSession(access_token, refresh_token);
};

export const register = async (email: string, password: string, anon_key: string) => {
  const { data: authData, error: authError } = await AuthModel.signUp(email, password, anon_key);
  if (authError) throw new Error(authError.message);

  if (authData.user?.id && anon_key) {
    const { error: profileError } = await ProfileModel.createProfile(authData.user.id, anon_key, { unergy: 300});
    if (profileError) throw new Error(profileError.message);
  }

  return { user: authData.user, session: authData.session };
};

export const setPassword = async (password: string) => {
  return await AuthModel.setPassword(password);
};

export const changePassword = async (old_password: string, new_password: string) => {
  return await AuthModel.changePassword(old_password, new_password);
};

export const forgetPassword = async (email: string) => {
  return await AuthModel.forgetPassword(email);
};

export const signInWithOAuth = async (provider: OAuthProvider, options?: { redirectTo?: string }) => {
  return await AuthModel.signInWithOAuth(provider, options);
};

export const logout = async () => {
  return await AuthModel.logout();
};

export const triggerOneOOne = async (anon_key: string, passcode: string, wearingIds: string[]) => {
  const correctCode = genPasscode(HAI_AN_KEY);
  console.log('correctCode', correctCode);
  if (passcode !== correctCode) throw new Error("wrong passcode");
  // find if anon_key exists

  const player = await AuthModel.getOneOOnePlayerById(anon_key, true);
  // if exists, delete
  console.log('player', player);
  if (player) {
    await AuthModel.removeOneOOnePlayer(anon_key);
  }
  // insert
  return await AuthModel.insertOneOOnePlayer(anon_key, wearingIds);
};


