import { apiUrl } from './apiUrl';

async function getMeshes() {
  try {
    const res = await fetch(apiUrl('wearings', 'meshes'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getWearings() {
  try {
    const res = await fetch(apiUrl('wearings', 'wearings'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getOwnedWearings(userId: string) {
  try {
    const res = await fetch(apiUrl('wearings', 'owned-wearings', userId));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function insertOwnedWearings(userId: string, wearingId: string) {
  try {
    const res = await fetch(apiUrl('wearings', 'owned-wearings', userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wearing_id: wearingId })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getStarterPack() {
  try {
    const res = await fetch(apiUrl('wearings', 'starter-pack'));
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function insertStarterPack(userId: string) {
  try {
    const res = await fetch(apiUrl('wearings', 'owned-wearings', userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function equipWearings(userId: string, wearingIds: string[]) {  
  try {
    const res = await fetch(apiUrl('wearings', 'equip-wearings', userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wearing_ids: wearingIds })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function unequipWearings(userId: string, wearingIds: string[]) {
  try {
    const res = await fetch(apiUrl('wearings', 'unequip-wearings', userId), {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ wearing_ids: wearingIds })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export { getMeshes, getWearings, getOwnedWearings, getStarterPack, insertStarterPack, insertOwnedWearings, equipWearings, unequipWearings };
