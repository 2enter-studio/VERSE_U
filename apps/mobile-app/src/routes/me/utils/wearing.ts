import { db } from '@/db';
import { authState, gameState } from '@/states';
import { createError, load } from '@/utils';

async function buyWearing(wearing_id: string) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('You must be logged in to buy wearings');

	const { data, error } = await db
		.from('owned_wearings')
		.insert({ wearing: wearing_id })
		.select('wearing, equipped')
		.returns<{ wearing: string; equipped: boolean }[]>()
		.single();

	if (error) return { error };

	const result = {
		id: data.wearing,
		equipped: data.equipped
	};

	gameState.ownedWearings.push(result);
}

async function equipWearings(wearing_ids: string[]) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('You must be logged in to equip wearings');

	// un-equip all wearings
	const { error } = await db
		.from('owned_wearings')
		.update({ equipped: false })
		.eq('owner', user_id)
		.eq('equipped', true);

	if (error) return { error };

	{
		// equip new wearings
		const { error } = await db
			.from('owned_wearings')
			.update({ equipped: true })
			.eq('owner', user_id)
			.in('wearing', wearing_ids);
		if (error) return { error };
	}

	await load.wearings();
}

async function getWearingsByUserId(user_id: string) {
	const { data, error } = await db
		.from('owned_wearings')
		.select('wearing')
		.eq('owner', user_id)
		.eq('equipped', true)
		.returns<{ wearing: string }[]>();

	if (error) return { error };

	return data.map((d) => d.wearing);
}

export { equipWearings, buyWearing, getWearingsByUserId };
