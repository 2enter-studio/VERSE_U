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

export { loadRegions };
