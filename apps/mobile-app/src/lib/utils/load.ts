import type { Tables } from '@repo/shared/supatypes';

import { db } from '@/db';
import { authState, gameState, sysState } from '@/states';
import { assignMLTexts, createError, needUpdate, preferences, redirectTo, validate } from '@/utils';
import { version } from '$app/environment';
import { inPeriod } from '@repo/shared/utils';

async function locale() {
	sysState.locale = await preferences.locale.get();
}

async function maintenance() {
	const { data, error } = await db
		.from('maintenance')
		.select()
		.returns<Tables<'maintenance'>[]>()
		.limit(1)
		.single();

	if (error) return;

	sysState.maintenance = data;
	const { start, end } = data;

	if (inPeriod(start, end, new Date())) {
		redirectTo('/maintain');
	}
}

async function appVersion() {
	const { data, error } = await db
		.from('app_versions')
		.select()
		.order('created_at', { ascending: false })
		.returns<Tables<'app_versions'>[]>()
		.limit(1)
		.single();

	if (error) return;
	if (!validate.app_version(data.value) || !validate.app_version(version)) return;

	sysState.remoteAppVersion = data;

	if (needUpdate()) {
		console.log('need update!!');
		redirectTo('/update');
	} else {
		console.log('no need update');
	}
}

async function profile(user_id?: string) {
	if (!user_id) user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { data, error } = await db
		.from('profiles')
		.select('*')
		.eq('user', user_id)
		.returns<Tables<'profiles'>[]>()
		.single();

	if (error) {
		return createError('FAILED_TO_LOAD_DATA');
	}

	authState.profile = data;
}

async function regions() {
	const { data, error } = await db.from('regions').select('*').returns<Tables<'regions'>[]>();
	if (error) return createError('FAILED_TO_LOAD_DATA');
	gameState.regions = await assignMLTexts(data, ['name', 'description'] as const);
}

async function wearings() {
	const { data, error } = await db
		.from('wearings')
		.select('*, category(*), texture_types(*), body_parts(*)');

	if (error) return createError('FAILED_TO_LOAD_DATA');

	gameState.wearings = (await assignMLTexts(data, ['name', 'description'] as const)) as Wearing[];

	const wearingTypes: Tables<'wearing_types'>[] = [];
	for (const { category } of data) {
		if (!wearingTypes.some((r) => r.id === category.id)) {
			wearingTypes.push(category);
		}
	}
	gameState.wearingTypes = await assignMLTexts(wearingTypes, ['name', 'description'] as const);
}

async function ownedWearings() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');
	const { data, error } = await db
		.from('owned_wearings')
		.select('wearing,equipped')
		.returns<{ wearing: string; equipped: boolean }[]>();

	if (error) return createError('FAILED_TO_LOAD_DATA');

	gameState.ownedWearings = data.map(({ wearing, equipped }) => {
		return {
			id: wearing,
			equipped
		};
	});
}

async function chats(chat_ids?: string[]) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const reload = chat_ids === undefined;

	if (reload) {
		const { data, error } = await db
			.from('chats')
			.select('*, chat_members(*, user(*)), chat_messages(*)')
			.returns<Chatroom[]>();

		if (error) return createError('FAILED_TO_LOAD_DATA');

		gameState.chats = data;
	} else {
		// validate chat ids
		if (chat_ids.some((id) => !validate.uuid(id))) return createError('CHAT_NOT_FOUND');

		const { data, error } = await db
			.from('chats')
			.select('*, chat_members(*, user(*)), chat_messages(*)')
			.in('id', chat_ids)
			.returns<Chatroom[]>();

		if (error) return createError('FAILED_TO_LOAD_DATA');

		for (const d of data) {
			const chat = gameState.chats.find((c) => c.id === d.id);
			if (chat) {
				Object.assign(chat, d);
			} else {
				gameState.chats.push(d);
				// chats.set([...get(chats), d]);
			}
		}
	}
}

async function trip() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { data, error } = await db
		.from('trips')
		.select()
		.eq('user', user_id)
		.returns<Tables<'trips'>[]>()
		.single();

	if (error) return createError('FAILED_TO_LOAD_DATA');

	gameState.trip = data;
}

async function peopleNearBy() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');
	if (!gameState.trip) return createError('TRIP_NOT_FOUND');

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
		.neq('user', user_id)
		.returns<{ user: Tables<'profiles'> }[]>();

	if (error) return createError('FAILED_TO_LOAD_DATA');

	gameState.peopleNearBy = data.map((d) => d.user);
}

export {
	locale,
	appVersion,
	maintenance,
	profile,
	regions,
	wearings,
	ownedWearings,
	chats,
	peopleNearBy,
	trip
};
