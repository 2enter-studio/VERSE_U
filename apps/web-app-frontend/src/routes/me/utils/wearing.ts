import { authState, gameState } from '@/states';
import { createError, load } from '@/utils';

async function buyWearing(wearing_id: string) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('MUST_SIGNIN_FIRST');

	const { data, error } = await wearingApi.insertOwnedWearings(user_id, wearing_id);

	if (error) return { error };

	const result = {
		id: data.wearing,
		equipped: data.equipped
	};

	gameState.owned_wearings.push(result);
}

async function equipWearings(wearing_ids: string[]) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('MUST_SIGNIN_FIRST');

	// un-equip all wearings
	const { error } = await wearingApi.unequipWearings(user_id, wearing_ids);

	if (error) return { error };

	{
		// equip new wearings
		const { error } = await wearingApi.equipWearings(user_id, wearing_ids);

		if (error) return { error };
	}

	await load.owned_wearings();
}

async function getWearings() {
	const { data, error } = await wearingApi.getWearings();

	if (error) return { error };

	return data.map((d) => d.wearing);
}

async function getWearingsByUserId(user_id: string) {
	const { data, error } = await wearingApi.getOwnedWearings(user_id);

	if (error) return { error };

	return data.map((d) => d.wearing);
}

export { equipWearings, buyWearing, getWearingsByUserId, getWearings };
