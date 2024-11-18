import * as AuthModel from "../models/authModel.ts";
import * as ProfileModel from "../models/profileModel.ts";

export const login = async (email: string, password: string) => {
  const { data, error } = await AuthModel.signIn(email, password);
  if (error) throw new Error(error.message);

  const { data: profile, error: profileError } = await ProfileModel.getProfileByUserId(data.user.id);
  if (profileError) throw new Error(profileError.message);

  return { user: data.user, profile, session: data.session };
};

export const register = async (email: string, password: string, name: string) => {
  const { data: authData, error: authError } = await AuthModel.signUp(email, password);
  if (authError) throw new Error(authError.message);

  if (authData.user?.id) {
    const { error: profileError } = await ProfileModel.createProfile(authData.user.id, name);
    if (profileError) throw new Error(profileError.message);
  }

  return { user: authData.user, session: authData.session };
};
