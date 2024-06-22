import type { Tables, TablesInsert } from '../types.ts';
import { MAX_TRAVEL_TIME, MIN_STAY_TIME } from '../config.ts';
import moment from 'moment';

function getDist(x1: number, y1: number, x2: number, y2: number) {
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

function tripReady(trip: Tables<'trips'>) {
	const now = moment();
	const arriveAt = moment(trip.arrive_at);
	const stayTime = now.diff(arriveAt);
	return stayTime > MIN_STAY_TIME;
}

function genRegionOptions(regions: Tables<'regions'>[]) {
	let searchRegions = regions.map((r) => r.id);

	const num_0 = Math.floor(Math.random() * searchRegions.length);
	const next_0 = searchRegions[num_0];

	searchRegions = searchRegions.filter((r) => r !== next_0);
	const num_1 = Math.floor(Math.random() * searchRegions.length);
	const next_1 = searchRegions[num_1];

	return { next_0, next_1 };
}

function genNextTrip(
	trip: Tables<'trips'>,
	regions: Tables<'regions'>[],
	option: 0 | 1 = 0
): TablesInsert<'trips'> {
	const from = regions.find((r) => r.id === trip.to) as Tables<'regions'>;
	const to = regions.find((r) => r.id === trip[`next_${option}`]) as Tables<'regions'>;
	const dist = getDist(from.x, from.y, to.x, to.y);
	const duration = getDuration(dist);
	const start_at = new Date().toISOString();
	const arrive_at = addTime(start_at, duration);
	const { next_0, next_1 } = genRegionOptions(regions.filter((r) => r.id !== to.id));
	const { id, user } = trip;
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

export { genRegionOptions, getDist, addTime, genNextTrip, tripReady };
