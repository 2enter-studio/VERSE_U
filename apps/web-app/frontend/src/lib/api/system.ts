import { baseUrl } from "./utils";

export async function getMaintenance() {
  try {
    const res = await fetch(`${baseUrl}/api/system/maintenance`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getAppVersion() {
  try {
    const res = await fetch(`${baseUrl}/api/system/app-version`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getSponsors() {
  try {
    const res = await fetch(`${baseUrl}/api/system/sponsors`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getRegions() {
  try {
    const res = await fetch(`${baseUrl}/api/system/regions`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getPeopleNearBy() {
  try {
    const res = await fetch(`${baseUrl}/api/system/people-near-by`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function getBlockUsers() {
  try {
    const res = await fetch(`${baseUrl}/api/system/block-users`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export async function blockUser(args: Record<string, unknown>) {
  try {
    await fetch(`${baseUrl}/api/system/block-users`, {
      method: 'POST',
      body: JSON.stringify(args)
    });
  } catch (err) {
    console.error(err);
  }
}

export async function getMLTexts(row_ids: string[], column_names: string[], locale: string) {
  try {
    const res = await fetch(`${baseUrl}/api/system/ml-texts`, {
      method: 'POST',
      body: JSON.stringify({ row_ids, column_names, locale })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
