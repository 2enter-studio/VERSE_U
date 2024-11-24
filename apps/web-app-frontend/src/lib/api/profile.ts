import { apiUrl } from './apiUrl';

const createProfile = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(apiUrl('profile', userId), {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value),
  });

  return response.json();
};

const getProfile = async (userId: string) => {
  const response = await fetch(apiUrl('profile', userId));

  return response.json();
};

const updateProfile = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(apiUrl('profile', userId), {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value),
  });

  return response.json();
};

const updateTrip = async (userId: string, value: Record<string, unknown>) => {
  const response = await fetch(apiUrl('profile', 'trip', userId), {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value),
  });

  return response.json();
};

const getTrip = async (userId: string) => {
  const response = await fetch(apiUrl('profile', 'trip', userId));

  return response.json();
};

export { createProfile, getProfile, updateProfile, updateTrip, getTrip };