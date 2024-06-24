import type { TablesInsert, Tables } from '../../types.ts';
import { MIN_STAY_TIME } from '../../config.ts';
import { dist, getDuration, addTime, genRandomNumbers } from './general.ts';

// Trip related
function tripReady(trip: Tables<'trips'>) {
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

export { tripReady, genNextTrip };
