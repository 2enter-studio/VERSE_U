import type { Tables } from '@repo/shared/supatypes';

import { genRandomNumbers, addTime } from '@repo/shared/utils';
// import { db } from '@/db';
import { authState, gameState, sysState } from '@/states';
import { createError } from '@/utils';
import { DEFAULT_ROUTE } from '@/config';
import * as profileApi from '@/api/profile';

function createAnonymousProfile(id: string, value: { session: Session, user: Tables<'profiles'> }) {
	console.log('createAnonymousProfile', value);
	authState.session = value.session;
	authState.profile = value.user;
	authState.profile.name = 'Anonymous';
	authState.isAnonymous = true;

	console.log('authState.profile', authState.profile);
}

async function createProfile(value: { name: string, id: string }) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	if (gameState.regions.length === 0) return createError('FAILED_TO_LOAD_DATA');

	const { data, error } = await profileApi.createProfile(user_id, value);
	if (error) return { error };
	authState.profile = data;

	const [from, to, next_0, next_1] = genRandomNumbers(gameState.regions.length, 4).map(
		(num) => gameState.regions[num].id
	);

	const now = new Date().toISOString();
	const start_at = addTime(now, -1000 * 60 * 80);
	const arrive_at = addTime(now, -1000 * 60 * 60);

	const v = {
		from,
		to,
		next_0,
		next_1,
		start_at,
		arrive_at
	};

	const { data: tripData, error: tripError } = await profileApi.updateTrip(user_id, v);

	if (tripError) return { error: tripError };

	{
		const { data, error } = await profileApi.getStarterPack();

		if (error) return { error };
		const insertData = data.map((d) => {
			return { wearing: d.id };
		});

		{
			const { error } = await profileApi.insertStarterPack(user_id, insertData);
			if (error) {
				console.error(error);
				return { error };
			}
		}
	}

	gameState.trip = tripData;
	authState.profile = profileData;
	sysState.routeTo(DEFAULT_ROUTE);
	window.location.reload();
}

async function modifyProfile(value: { name: string }) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { data, error } = await profileApi.updateProfile(user_id, value);

	if (error) return { error };
	authState.profile = data;
}

export { createProfile, createAnonymousProfile, modifyProfile };
