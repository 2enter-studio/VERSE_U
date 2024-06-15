import { derived, writable } from 'svelte/store';

const wearings = writable<Wearing[]>([]);
const wearingTypes = writable<WearingType[]>([]);
const ownedWearings = writable<{ wearing: string; equipped: boolean }[]>([]);

const equippedWearings = derived(ownedWearings, ($ownedWearings) => {
	return $ownedWearings.filter((w) => w.equipped).map((w) => w.wearing);
});

export { wearings, wearingTypes, ownedWearings, equippedWearings };
