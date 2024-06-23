import { get } from 'svelte/store';
import { db } from '@/db';
import { ownedWearings, wearings, wearingTypes } from '../../states';
import { auth } from '../../states';
import { assignMLTexts } from '@/utils/ml_text';
import { createError } from '@/utils/error';
import type { Tables } from '@repo/config/supatypes';

async function loadWearingTypes() {
	const { data, error } = await db
		.from('wearing_types')
		.select('*')
		.returns<Tables<'wearing_types'>[]>();
	if (error) return { error };

	const newData = await assignMLTexts(data);

	wearingTypes.set(newData);
}

async function loadWearings() {
	await loadWearingTypes();
	const { data, error } = await db
		.from('wearings')
		.select('*, texture_types(value), body_parts(value)')
		.returns<Wearing[]>();

	if (error) return { error };

	const newData = await assignMLTexts(data);

	wearings.set(newData);
	await loadOwnedWearings();
}

async function loadOwnedWearings() {
	const user_id = auth.user?.id;
	if (!user_id) return;

	const { data, error } = await db
		.from('owned_wearings')
		.select('wearing,equipped')
		.eq('owner', user_id)
		.returns<{ wearing: string; equipped: boolean }[]>();

	if (error) return { error };

	ownedWearings.set(data);
}

async function buyWearing(wearing_id: string) {
	const user_id = auth.user?.id;
	if (!user_id) return createError('You must be logged in to buy wearings');

	const { data, error } = await db
		.from('owned_wearings')
		.insert({ wearing: wearing_id })
		.select('wearing, equipped')
		.returns<{ wearing: string; equipped: boolean }[]>()
		.single();

	if (error) return { error };
	ownedWearings.set([...get(ownedWearings), data]);
}

async function equipWearings(wearing_ids: string[]) {
	const user_id = auth.user?.id;
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

	await loadOwnedWearings();
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

export { loadWearings, loadOwnedWearings, equipWearings, buyWearing, getWearingsByUserId };
