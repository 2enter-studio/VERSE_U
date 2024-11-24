import { baseUrl } from './utils';

async function getMeshes() {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/meshes`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getWearings() {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/wearings`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getOwnedWearings(userId: string) {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/owned-wearings/${userId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function insertOwnedWearings(userId: string, wearingId: string) {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/owned-wearings/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ wearing_id: wearingId })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function getStarterPack() {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/starter-pack`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function insertStarterPack(userId: string) {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/owned-wearings/${userId}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function equipWearings(userId: string, wearingIds: string[]) {  
  try {
    const res = await fetch(`${baseUrl}/api/wearings/equip-wearings/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ wearing_ids: wearingIds })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

async function unequipWearings(userId: string, wearingIds: string[]) {
  try {
    const res = await fetch(`${baseUrl}/api/wearings/unequip-wearings/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ wearing_ids: wearingIds })
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export { getMeshes, getWearings, getOwnedWearings, getStarterPack, insertStarterPack, insertOwnedWearings, equipWearings, unequipWearings };
