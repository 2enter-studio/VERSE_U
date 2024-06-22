import { MAX_STAY_TIME } from '@repo/config';
import { admin } from '@repo/utils/db';
import { genNextTrip } from '@repo/config/utils';
import type { Tables, TablesInsert } from '@repo/config/supatypes';

function getMinArriveAt() {
  return new Date(new Date().getTime() - MAX_STAY_TIME).toISOString();
}

async function getRegions() {
  const { data, error } = await admin
    .from('regions')
    .select('id,x,y')
    .eq('enabled', true)
    .returns<Tables<'regions'>[]>();

  if (error) return [];
  return data;
}

async function getExpiredTrips() {
  const minimalArriveAt = getMinArriveAt();
  const { data, error } = await admin
    .from('trips')
    .select('*')
    .lt('arrive_at', minimalArriveAt)
    .returns<Tables<'trips'>[]>();

  if (error) return { error };
  return data;
}

async function upsertTrips(trips: Tables<'trips'>[]) {
  if (trips.length === 0) return [];
  const regions = await getRegions();
  if (regions.length === 0) return { error: 'failed to load regions' };

  const submitData = trips.map((trip) => genNextTrip(trip, regions));
  console.log(submitData);

  const { data, error } = await admin
    .from('trips')
    .upsert(submitData, { onConflict: 'id' })
    .select('*')
    .returns<Tables<'trips'>[]>();

  if (error) return { error };

  return data;
}

export { getExpiredTrips, upsertTrips };
