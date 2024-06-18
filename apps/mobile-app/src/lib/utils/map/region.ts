import type { RealtimePostgresUpdatePayload as Payload } from '@supabase/supabase-js';
import { get } from 'svelte/store';

import { db } from '@/db';
import { createError } from '@/utils/error';
import { peopleNearby, regions, trip, user } from '@/stores';
import { assignMLTexts } from '@/utils/ml_text';
import type { Tables } from '@repo/supabase';

async function loadRegions() {
	const { data, error } = await db.from('regions').select().eq('enabled', true).returns<Region[]>();
	if (error) {
		return { error };
	}

	const newData = await assignMLTexts(data);

	regions.set(newData);
}

async function loadPeopleNearby() {
	const region_id = get(trip)?.to;
	if (!region_id) return createError('No destination found');

	const { data, error } = await db
		.from('trips')
		.select('profiles(*), arrive_at')
		.eq('to', region_id)
		.returns<{ profiles: Tables<'profiles'>; arrive_at: string }[]>();

	if (error) return createError('Failed to get users in region');

	const result = data.filter((d) => {
		if (d.profiles.user === get(user)?.id) return false;
		const arrive_at = new Date(d.arrive_at).getTime();
		const now = new Date().getTime();
		return now > arrive_at;
	});

	peopleNearby.set(result.map((r) => r.profiles));
}

function subscribeToRegion(callback: (payload: Payload<Tables<'profiles'>>) => void) {
	const region_id = get(trip)?.to;
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
	const region_id = get(trip)?.to;
	if (!region_id) return createError('No destination found');
}

export { loadRegions, loadPeopleNearby, getNewUserInRegion, subscribeToRegion };
