import { get, writable } from 'svelte/store';
import type { Tables } from '@repo/supabase';
import { MIN_STAY_TIME } from '@/config';

type TripStatus = {
	progress: number;
	timeRemain: number;
};

const trip = writable<null | Tables<'trips'>>(null);
const regions = writable<Region[]>([]);
const peopleNearby = writable<Profile[]>([]);

function updateTripStatus(update: (value: TripStatus) => void) {
	const currentTrip = get(trip);
	if (!currentTrip) return;

	const now = new Date();
	const arriveAt = new Date(currentTrip.arrive_at);
	const startAt = new Date(currentTrip.start_at);
	const timeDiff = now.getTime() - arriveAt.getTime();

	let data: TripStatus;

	if (timeDiff < 0) {
		// on the way
		const progress = (now.getTime() - startAt.getTime()) / (arriveAt.getTime() - startAt.getTime());
		data = { timeRemain: -timeDiff, progress };
	} else if (timeDiff >= MIN_STAY_TIME) {
		// ready to go
		data = { timeRemain: 0, progress: 1 };
	} else if (timeDiff >= 0) {
		// arrived
		const timeRemain = MIN_STAY_TIME - timeDiff;
		data = { timeRemain, progress: 1 };
	} else {
		return;
	}
	update(data);
}

const tripStatus = writable<TripStatus>({ progress: 0, timeRemain: 0 }, (update) => {
	updateTripStatus(update);
	const interval = setInterval(() => {
		updateTripStatus(update);
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});

export { trip, regions, tripStatus, peopleNearby };
