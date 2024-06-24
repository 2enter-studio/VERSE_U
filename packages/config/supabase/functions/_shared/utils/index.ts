import moment from 'moment';
import sha256 from 'sha256';
import { createClient } from '@supabase/supabase-js';

import type { Tables, TablesInsert } from '@repo/config/supatypes';
import { MAX_TRAVEL_TIME, MIN_STAY_TIME } from '@repo/config';

// General Utilities
function genRandomNumbers(range: number, amount: number): number[] {
  const result: number[] = Array.from(Array(range).keys());
  if (amount < range) {
    for (const i of Array(range - amount).keys()) {
      const index = Math.floor(Math.random() * range - 1);
      result.splice(index, 1);
    }
  }
  return result;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getDuration(dist: number) {
  return MAX_TRAVEL_TIME * dist;
}

function addTime(base: string | Date, add: number) {
  const startTime = typeof base === 'string' ? new Date(base).getTime() : base.getTime();
  const arriveTime = startTime + add;
  return new Date(arriveTime).toISOString();
}

// Hai-An road interactive installation related
function genHaiAnPasscode(key: string) {
  const now = moment.utc().format('YYYY-MM-DD HH');
  return sha256(now + key)
    .slice(0, 5)
    .toUpperCase();
}

// Trip related
function tripReady(trip: Tables<'trips'>) {
  // const now = moment();
  // const arriveAt = moment(trip.arrive_at);
  // const stayTime = now.diff(arriveAt);
  const now = new Date().getTime();
  const arriveAt = new Date(trip.arrive_at).getTime();
  const delta = now - arriveAt;
  return delta > MIN_STAY_TIME;
}

function genNextTrip(
  trip: Tables<'trips'>,
  regions: Tables<'regions'>[],
  option: 0 | 1 = 0
): TablesInsert<'trips'> {
  const { id, user } = trip;
  const from = regions.find((r) => r.id === trip.to) as Tables<'regions'>;
  const to = regions.find((r) => r.id === trip[`next_${option}`]) as Tables<'regions'>;
  const distance = dist(from.x, from.y, to.x, to.y);
  const duration = getDuration(distance);
  const start_at = new Date().toISOString();
  const arrive_at = addTime(start_at, duration);
  const searchRegions = regions.filter((r) => r.id !== to.id);
  const [next_0, next_1] = genRandomNumbers(searchRegions.length, 2).map(
    (num) => searchRegions[num].id
  );
  return {
    id,
    user,
    from: from.id,
    to: to.id,
    next_0,
    next_1,
    start_at,
    arrive_at
  };
}

// DB client
function makeSupaClient(
  role: 'admin' | 'anon',
  getEnv: (key: string) => string = (key: string) => process.env[key] ?? ''
) {
  const developing = getEnv('DEVELOPING') === '1';
  const prefix = developing ? 'LOCAL_' : '';
  const url = getEnv(`${prefix}SUPABASE_URL`);
  const key =
    role === 'admin'
      ? getEnv(`${prefix}SUPABASE_SERVICE_ROLE_KEY`)
      : getEnv(`${prefix}SUPABASE_ANON_KEY`);
  return createClient(url, key);
}

export {
  dist,
  addTime,
  genNextTrip,
  tripReady,
  genHaiAnPasscode,
  makeSupaClient,
  genRandomNumbers
};
