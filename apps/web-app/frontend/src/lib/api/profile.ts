import { baseUrl } from './utils';

export const createProfile = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(`${baseUrl}/api/profile/${userId}`, {
    method: "POST",
    body: JSON.stringify(value),
  });

  return response.json();
};

export const getProfile = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/profile/${userId}`);

  return response.json();
};

export const updateProfile = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(`${baseUrl}/api/profile/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(value),
  });

  return response.json();
};

export const updateTrip = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(`${baseUrl}/api/profile/trip/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(value),
  });

  return response.json();
};

export const getTrip = async (userId: string) => {
  const response = await fetch(`${baseUrl}/api/profile/trip/${userId}`);

  return response.json();
};
