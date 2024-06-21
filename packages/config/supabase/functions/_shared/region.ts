import { admin } from './db.ts';
import type { Tables } from '../types.ts';

export let regions: Tables<'regions'>[] | null = null;

async function loadRegions() {
	const { data, error } = await admin.from('regions').select('id, x, y').eq('enabled', true);
	if (error) {
		console.error(error);
		regions = null;
	}
	console.log(data);
	regions = data as unknown as Tables<'regions'>[];
}

function getArriveTime(start_at: string) {
	const startTime = new Date(start_at).getTime();
	const arriveTime = startTime + 5 * 1000;
	return new Date(arriveTime).toISOString();
}

function genRegionOptions(currentRegion?: string) {
	// let regions = await getRegions();
	if (!regions) return null;

	let regionsCopy = structuredClone(regions);

	regionsCopy = regionsCopy.filter((region) => region.id !== currentRegion);
	const num_0 = Math.floor(Math.random() * regionsCopy.length);
	const next_0 = regionsCopy[num_0].id;

	regionsCopy = regionsCopy.filter((region) => region.id !== next_0);
	const num_1 = Math.floor(Math.random() * regionsCopy.length);
	const next_1 = regionsCopy[num_1].id;

	return { next_0, next_1 };
}

export { loadRegions, genRegionOptions, getArriveTime };

