import type { Tables } from '@repo/shared/supatypes';

import { genRandomNumbers, addTime } from '@repo/shared/utils';
import { db } from '@/db';
import { authState, gameState } from '@/states';
import { createError } from '@/utils';

async function createProfile(value: { name: string }) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	if (gameState.regions.length === 0) return createError('FAILED_TO_LOAD_DATA');

	const { data: profileData, error: profileError } = await db
		.from('profiles')
		.insert(value)
		.select('*')
		.returns<Tables<'profiles'>[]>()
		.single();

	if (profileError) return { error: profileError };

	const [from, to, next_0, next_1] = genRandomNumbers(gameState.regions.length, 4).map(
		(num) => gameState.regions[num].id
	);

	const now = new Date().toISOString();
	const start_at = addTime(now, -300);
	const arrive_at = addTime(now, -100);

	const { data: tripData, error: tripError } = await db
		.from('trips')
		.insert({
			from,
			to,
			next_0,
			next_1,
			start_at,
			arrive_at
		})
		.select()
		.returns<Tables<'trips'>[]>()
		.single();

	if (tripError) return { error: tripError };

	gameState.trip = tripData;
	authState.profile = profileData;
}

async function modifyProfile(value: { name: string }) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { data, error } = await db
		.from('profiles')
		.update(value)
		.eq('user', user_id)
		.select()
		.returns<Tables<'profiles'>[]>()
		.single();

	if (error) return { error };
	authState.profile = data;
}

export { createProfile, modifyProfile };
