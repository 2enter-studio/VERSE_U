import type { Tables } from '@repo/shared/supatypes';
import { inPeriod } from '@repo/shared/utils';
import { authState, gameState, sysState } from '@/states';
import { assignMLTexts, createError, needUpdate, preferences, validate } from '@/utils';
import { version } from '$app/environment';
import * as systemApi from '@/api/system';
import * as wearingApi from '@/api/wearings';
import * as profileApi from '@/api/profile';
import * as authApi from '@/api/auth';
import * as chatApi from '@/api/chat';
async function preference() {
	// sysState.pref.locale = await preferences.locale.get();
	sysState.pref.music_volume = await preferences.music_volume.get();
	sysState.pref.sound_volume = await preferences.sound_volume.get();
}

async function maintenance() {
	const resp = await systemApi.getMaintenance();

	if (authState.user?.email === 'demodemo@2enter.art' || !authState.loggedIn) return;

	sysState.maintenance = resp;
	const { start, end } = resp;

	if (inPeriod(start, end, new Date())) {
		sysState.routeTo('maintain');
	}
}

async function app_version() {
	const resp = await systemApi.getAppVersion();
	if (!validate.app_version(resp.value) || !validate.app_version(version)) return;

	sysState.remoteAppVersion = resp;
}

async function sponsors() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');
	const resp = await systemApi.getSponsors();

	if (resp) return createError('FAILED_TO_LOAD_DATA');

	gameState.sponsors = await assignMLTexts(data, ['name', 'coupon_info'] as const);
}

async function profile(user_id?: string) {
	if (!user_id) user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const resp = await profileApi.getProfile(user_id);

	authState.profile = resp;
}

async function session() {
	const resp = await authApi.getSession();
	authState.session = resp;
	return resp;
}

async function regions() {
	const resp = await systemApi.getRegions();
	gameState.regions = await assignMLTexts(resp, ['name', 'description'] as const);
}

async function meshes() {
	const resp = await wearingApi.getMeshes();
	gameState.meshes = resp as Mesh[];
}

async function wearings() {
	const resp = await wearingApi.getWearings();
	if (resp.error) return createError('FAILED_TO_LOAD_DATA');

	const wearingTypes: Tables<'wearing_types'>[] = [];
	for (const { category } of resp) {
		if (!wearingTypes.some((r) => r.id === category.id)) {
			wearingTypes.push(category);
		}
	}

	const promises: Promise<void>[] = [];

	await Promise.all(promises);

	gameState.wearingTypes = await assignMLTexts(wearingTypes, ['name', 'description'] as const);
	gameState.wearings = (await assignMLTexts(resp, [
		// 'name',
		'description'
	] as const)) as Wearing[];
	gameState.wearings = resp as Wearing[];
}

async function owned_wearings() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');
	const resp = await wearingApi.getOwnedWearings(user_id);

	gameState.owned_wearings = resp.map(({ wearing, equipped }) => {
		return {
			id: wearing,
			equipped
		};
	}) as OwnedWearing[];
}

async function chats(chat_ids?: string[]) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const resp = await chatApi.getChats(user_id, chat_ids);


	if (chat_ids) {
		const result = resp.filter((row) => row.chat_members.every((member) => member.user));
		for (const d of result) {
			const chat = gameState.chats.find((c) => c.id === d.id);
			if (chat) {
				Object.assign(chat, d);
			} else {
				gameState.chats.push(d);
			}
		}
		gameState.chats = result;
	} else {
		// validate chat ids
		gameState.chats = resp.filter((row) => row.chat_members.every((member) => member.user));
	}
}

async function trip() {
	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const resp = await profileApi.getTrip(user_id);

	gameState.trip = resp;
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

	const resp = await systemApi.getPeopleNearBy(user_id);
	const result = resp.filter((row) => row.user);
	gameState.peopleNearBy = result.map((row) => row.user);
}

async function block_users() {
	const resp = await systemApi.getBlockUsers();
	gameState.block_users = resp;
}

export {
	preference,
	app_version,
	maintenance,
	profile,
	regions,
	meshes,
	wearings,
	owned_wearings,
	chats,
	sponsors,
	peopleNearBy,
	block_users,
	trip,
	session
};
