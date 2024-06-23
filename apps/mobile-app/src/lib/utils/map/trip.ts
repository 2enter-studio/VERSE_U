import { get } from 'svelte/store';
import type { Tables } from '@repo/config/supatypes';

import { db } from '@/db';
import { trip, tripStatus, peopleNearby } from '../../states';
import { auth } from '../../states';
import { createError, handleEFResponse } from '@/utils/error';

async function loadTrip() {
	const user_id = auth.user?.id;
	if (!user_id) return createError('You must be logged in to get your trip');
	const { data, error } = await db
		.from('trips')
		.select()
		.eq('user', user_id)
		.returns<Tables<'trips'>[]>()
		.single();

	if (error) return { error };
	trip.set(data);
}

async function startNextTrip(option: 0 | 1) {
	const { data, error } = await db.functions.invoke('set-trip', {
		body: JSON.stringify({ option })
	});
	await handleEFResponse(error, () => {
		console.log(data);
		trip.set(data.nextTrip);
		const newStatus = get(tripStatus);
		newStatus.progress = 0;
		tripStatus.set(newStatus);
		peopleNearby.set([]);
	});
}

export { loadTrip, startNextTrip };
