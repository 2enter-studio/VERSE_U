import type { RealtimePostgresUpdatePayload as Payload } from '@supabase/supabase-js';
import { get } from 'svelte/store';

import { db } from '@/db';
import { createError } from '@/utils/error';
import type { Tables } from '@repo/config/supatypes';
import { gameState } from '@/states';

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

async function getNewUserInRegion() {
	const region_id = gameState.trip?.to;
	if (!region_id) return createError('No destination found');
}

export { getNewUserInRegion, subscribeToRegion };
