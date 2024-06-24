import { admin } from './utils/db.ts';
import type { Tables } from '../types.ts';

async function getRegions() {
	const { data, error } = await admin
		.from('regions')
		.select('id, x, y')
		.eq('enabled', true)
		.returns<Tables<'regions'>[]>();
	if (error) {
		console.error(error);
	}
	return data;
}

export { getRegions };
