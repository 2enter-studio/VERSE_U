import type { RealtimePostgresUpdatePayload as Payload } from '@supabase/realtime-js/dist/module/RealtimeChannel';
import type { Tables } from '@repo/shared/supatypes';

import { db } from '@/db';
import { createError, handleEFResponse } from '@/utils';
import { gameState } from '@/states';

async function startNextTrip(option: 0 | 1) {
	const { data, error } = await db.functions.invoke('set-trip', {
		body: JSON.stringify({ option })
	});
	await handleEFResponse(error, () => {
		console.log(data);
		gameState.trip = data.nextTrip;
		gameState.tripStatus.progress = 0;
		gameState.peopleNearBy = [];
	});
}

function subscribeToRegion(callback: (payload: Payload<Tables<'profiles'>>) => void) {
	const region_id = gameState.trip?.to;
	if (!region_id) return createError('No destination found');

	db.channel(`trippers-${region_id}`)
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'trips',
				filter: `from=eq.${region_id}`
			},
			callback
		)
		.subscribe();
}

export { startNextTrip, subscribeToRegion };
