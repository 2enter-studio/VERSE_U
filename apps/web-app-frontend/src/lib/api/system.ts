import { apiUrl } from "./apiUrl";

async function getMaintenance() {
  try {
    const res = await fetch(apiUrl('system', 'maintenance'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getAppVersion() {
  try {
    const res = await fetch(apiUrl('system', 'app-version'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getSponsors() {
  try {
    const res = await fetch(apiUrl('system', 'sponsors'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getRegions() {
  try {
    const res = await fetch(apiUrl('system', 'regions'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getPeopleNearBy() {
  try {
    const res = await fetch(apiUrl('system', 'people-near-by'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getBlockUsers() {
  try {
    const res = await fetch(apiUrl('system', 'block-users'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function blockUser(args: Record<string, unknown>) {
  try {
    await fetch(apiUrl('system', 'block-users'), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(args)
    });
  } catch (err) {
    console.error(err);
  }
}

async function getMLTexts(row_ids: string[], column_names: string[], locale: string) {
  try {
    const res = await fetch(apiUrl('system', 'ml-texts'), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ row_ids, column_names, locale })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export { getMaintenance, getAppVersion, getSponsors, getRegions, getPeopleNearBy, getBlockUsers, blockUser, getMLTexts };
