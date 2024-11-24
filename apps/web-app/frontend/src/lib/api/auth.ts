// deno-lint-ignore-file no-explicit-any
import type { Wearing } from "$routes/shop/components";
import { baseUrl } from "./utils";

export const login = async (email: string, password: string) => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return response.json();
};

export const logout = async () => {
	return await fetch(`${baseUrl}/api/auth/logout`, {
		method: "POST",
	});
};

export const register = async (email: string, password: string, anon_key: string) => {
  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, anon_key }),
  });

  return response.json();
};

export const anonymousLogin = async () => {
  const response = await fetch(`${baseUrl}/api/auth/anonymous`, {
    method: "POST",
  });
  const data = await response.json();
  return data;
};

export const getSession = async (access_token?: string, refresh_token?: string) => {
  const response = await fetch(`${baseUrl}/api/auth/session`, {
    method: "POST",
    body: JSON.stringify({ access_token, refresh_token }),
  });

  return response.json();
};

export const setPassword = async (password: string) => {
  const response = await fetch(`${baseUrl}/api/auth/set-password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  return response.json();
};

export const changePassword = async (old_password: string, new_password: string) => {
  const response = await fetch(`${baseUrl}/api/auth/change-password`, {
    method: "POST",
    body: JSON.stringify({ old_password, new_password }),
  });

  return response.json();
};

export const forgetPassword = async (email: string) => {
  const response = await fetch(`${baseUrl}/api/auth/forget-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  return response.json();
};

export const signInWithOAuth = async (provider: OAuthProvider, options?: { redirectTo?: string }) => {
  const response = await fetch(`${baseUrl}/api/auth/signin`, {
    method: "POST",
    body: JSON.stringify({ provider, options }),
  });

  return response.json();
};


export const triggerOneOOne = async (anon_key: string, passcode: string, wearings) => {
  const response = await fetch(`${baseUrl}/api/auth/trigger-one-o-one`, {
    method: "POST",
    body: JSON.stringify({ anon_key, passcode, wearings }),
  });

  return response.json();
};