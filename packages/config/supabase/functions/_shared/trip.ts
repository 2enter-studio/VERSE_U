import { admin } from './db.ts';
import type { Tables } from '../types.ts';

async function getTripByUserId(user_id: string) {
	const { data, error } = await admin.from('trips').select().eq('user', user_id).single();
	if (error) {
		console.error(error);
		return null;
	}

	return data as Tables<'trips'>;
}

export { getTripByUserId };
