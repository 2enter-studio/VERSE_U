import type { Tables } from '@repo/config/supatypes';
import { db } from '@/db';
import { authState, gameState } from '@/states';
import { assignMLTexts, createError, validate } from '@/utils';

async function loadProfile(user_id?: string) {
	if (!user_id) user_id = authState.user?.id;
	// const user_id = get(user)?.id;
	if (!user_id) return createError('No auth found');

	const { data, error } = await db
		.from('profiles')
		.select('*')
		.eq('user', user_id)
		.returns<Tables<'profiles'>[]>()
		.single();

	if (error) {
		console.error(error.message);
		return { error };
	}

	authState.profile = data;
}

async function loadRegions() {
	const { data, error } = await db.from('regions').select('*').returns<Tables<'regions'>[]>();
	if (error) return { error };
	gameState.regions = await assignMLTexts(data, ['name', 'description'] as const);
}

async function loadWearings() {
	const { data, error } = await db
		.from('wearings')
		.select('*, category(*), texture_types(*), body_parts(*)');
	if (error) return { error };
	gameState.wearings = (await assignMLTexts(data, ['name', 'description'] as const)) as Wearing[];

	const wearingTypes: Tables<'wearing_types'>[] = [];
	for (const { category } of data) {
		if (!wearingTypes.some((r) => r.id === category.id)) {
			wearingTypes.push(category);
		}
	}
	gameState.wearingTypes = await assignMLTexts(wearingTypes, ['name', 'description'] as const);
}

async function loadOwnedWearings() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('NO_USER_FOUND');
	const { data, error } = await db
		.from('owned_wearings')
		.select('wearing,equipped')
		.returns<{ wearing: string; equipped: boolean }[]>();

	if (error) return { error };

	gameState.ownedWearings = data.map(({ wearing, equipped }) => {
		return {
			id: wearing,
			equipped
		};
	});
}

async function loadChats(chat_ids?: string[]) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('NO_USER_FOUND');

	const reload = chat_ids === undefined;

	if (reload) {
		const { data, error } = await db
			.from('chats')
			.select('*, chat_members(*, user(*)), chat_messages(*)')
			.returns<Chatroom[]>();

		if (error) return { error };
		gameState.chats = data;
	} else {
		// validate chat ids
		if (chat_ids.some((id) => !validate.uuid(id))) return createError('invalid chat id');

		const { data, error } = await db
			.from('chats')
			.select('*, chat_members(*, user(*)), chat_messages(*)')
			.in('id', chat_ids)
			.returns<Chatroom[]>();

		if (error) return { error };
		gameState.chats = gameState.chats.concat(data);
	}
}

async function loadTrip() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('NO_USER_FOUND');

	const { data, error } = await db
		.from('trips')
		.select()
		.eq('user', user_id)
		.returns<Tables<'trips'>[]>()
		.single();

	if (error) return { error };
	gameState.trip = data;
}

async function loadPeopleNearBy() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('NO_USER_FOUND');
	if (!gameState.trip) return createError('NO_TRIP_FOUND');

	const { trip } = gameState;
	if (new Date(trip.arrive_at).getTime() > new Date().getTime()) {
		console.log('you have not arrived');
		gameState.peopleNearBy = [];
		return;
	}

	const { data, error } = await db
		.from('trips')
		.select('user(*)')
		.lt('arrive_at', new Date().toISOString())
		.eq('to', trip.to)
		.returns<{ user: Tables<'profiles'> }[]>();

	if (error) return { error };

	gameState.peopleNearBy = data.map((d) => d.user);
}

export {
	loadProfile,
	loadRegions,
	loadWearings,
	loadOwnedWearings,
	loadChats,
	loadPeopleNearBy,
	loadTrip
};
