import { admin } from './utils/db.ts';
import type { Tables } from '../types.ts';

async function getTripByUserId(user_id: string) {
	const { data, error } = await admin
		.from('trips')
		.select()
		.eq('user', user_id)
		.returns<Tables<'trips'>[]>()
		.single();

	if (error) {
		console.error(error);
		return null;
	}

	return data;
}

export { getTripByUserId };
