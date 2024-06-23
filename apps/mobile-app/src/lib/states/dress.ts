import { derived, writable } from 'svelte/store';
import type { Tables } from '@repo/config/supatypes';

const wearings = writable<Wearing[]>([]);
const wearingTypes = writable<Tables<'wearing_types'>[]>([]);
const ownedWearings = writable<{ wearing: string; equipped: boolean }[]>([]);

const equippedWearings = derived(ownedWearings, ($ownedWearings) => {
	return $ownedWearings.filter((w) => w.equipped).map((w) => w.wearing);
});

export { wearings, wearingTypes, ownedWearings, equippedWearings };
