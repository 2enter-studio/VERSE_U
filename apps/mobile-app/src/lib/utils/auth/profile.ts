import moment from 'moment';
import randomItem from 'random-item';
import { get } from 'svelte/store';

import { db } from '@/db';
import { profile, user, regions, trip } from '@/stores';
import { createError } from '../error';
import type { Tables } from '@/types/supabase';

async function loadProfile(user_id?: string) {
	if (!user_id) user_id = get(user)?.id;
	// const user_id = get(user)?.id;
	if (!user_id) return createError('No auth found');

	const { data, error } = await db.from('profiles').select('*').eq('user', user_id).returns<Profile[]>().single();

	if (error) {
		console.error(error.message);
		return { error };
	}

	profile.set(data);
}

async function createProfile(name: string) {
	const user_id = get(user)?.id;
	if (!user_id) return createError('No auth found');

	let regionIds = [...get(regions).map((r) => r.id)];
	if (regionIds.length === 0) return createError('NO_REGION_FOUND');

	const { data: profileData, error: profileError } = await db.from('profiles').insert({ name });
	if (profileError) return { error: profileError };

	const from = randomItem(regionIds);
	regionIds.splice(regionIds.indexOf(from), 1);
	const to = randomItem(regionIds);
	regionIds.splice(regionIds.indexOf(to), 1);
	const next_0 = randomItem(regionIds);
	regionIds.splice(regionIds.indexOf(next_0), 1);
	const next_1 = randomItem(regionIds);
	regionIds.splice(regionIds.indexOf(next_1), 1);

	const { data: tripData, error: tripError } = await db
		.from('trips')
		.insert({
			from,
			to,
			next_0,
			next_1,
			arrive_at: moment().add(-100, 'seconds').toISOString(),
			start_at: moment().add(-300, 'seconds').toISOString()
		})
		.select('*')
		.returns<Tables<'trips'>[]>()
		.single();

	if (tripError) return { error: tripError };

	trip.set(tripData);
	profile.set(profileData);
}

async function modifyProfile(args: { name: string }) {
	const { name } = args;

	const user_id = get(user)?.id;
	if (!user_id) return createError('No auth found');
	const { data, error } = await db.from('profiles').update({ name }).eq('user', user_id).select('*').returns<Profile[]>().single();
	if (error) {
		console.error(error.message);
		return { error };
	}
	profile.set(data);
}

export { loadProfile, createProfile, modifyProfile };
