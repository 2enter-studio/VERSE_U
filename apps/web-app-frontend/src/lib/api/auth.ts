import { apiUrl } from "./apiUrl";

const login = async (email: string, password: string) => {
  const response = await fetch(apiUrl('auth', 'login'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return response.json();
};

const logout = async () => {
	return await fetch(apiUrl('auth', 'logout'), {
		method: "POST",
	});
};

const register = async (email: string, password: string, anon_key: string) => {
  const response = await fetch(apiUrl('auth', 'register'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ email, password, anon_key }),
  });

  return response.json();
};

const anonymousLogin = async () => {
  const response = await fetch(apiUrl('auth', 'anonymous'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
  });
  const data = await response.json();
  return data;
};

const getSession = async (access_token?: string, refresh_token?: string) => {
  const response = await fetch(apiUrl('auth', 'session'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ access_token, refresh_token }),
  });

  return response.json();
};

const setPassword = async (password: string) => {
  const response = await fetch(apiUrl('auth', 'set-password'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ password }),
  });

  return response.json();
};

const changePassword = async (old_password: string, new_password: string) => {
  const response = await fetch(apiUrl('auth', 'change-password'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ old_password, new_password }),
  });

  return response.json();
};

const forgetPassword = async (email: string) => {
  const response = await fetch(apiUrl('auth', 'forget-password'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ email }),
  });

  return response.json();
};

const signInWithOAuth = async (provider: OAuthProvider, options?: { redirectTo?: string }) => {
  const response = await fetch(apiUrl('auth', 'signin'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ provider, options }),
  });

  return response.json();
};


const triggerOneOOne = async (anon_key: string, passcode: string, wearings) => {
  const response = await fetch(apiUrl('auth', 'trigger-one-o-one'), {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({ anon_key, passcode, wearings }),
  });

  return response.json();
};

export { login, logout, register, anonymousLogin, getSession, setPassword, changePassword, forgetPassword, signInWithOAuth, triggerOneOOne };