import type { Tables } from '@repo/shared/supatypes';
import { MIN_STAY_TIME } from '@repo/shared/config';

function makeGameState() {
	let regions = $state<Region[]>([]);
	let wearings = $state<Wearing[]>([]);

	let trip = $state<Tables<'trips'> | null>(null);
	let tripStatus = $state<{ progress: number; timeRemain: number }>({ progress: 0, timeRemain: 0 });
	let chats = $state<Chatroom[]>([]);
	let peopleNearBy = $state<Tables<'profiles'>[]>([]);

	let chat_id = $state<string | null>(null);
	let chat = $derived(chats.find((chat) => chat.id === chat_id));

	let wearingTypes = $state<WearingType[]>([]);
	let ownedWearings = $state<{ id: string; equipped: boolean }[]>([]);
	let equippedWearings = $derived(ownedWearings.filter((wearing) => wearing.equipped));

	const strangerChats = $derived(chats.filter((c) => c.chat_members.some((m) => !m.agree)));
	const friendChats = $derived(chats.filter((c) => !strangerChats.includes(c)));

	return {
		getTripStatus() {
			const now = new Date();
			if (!trip) return;
			const arriveAt = new Date(trip.arrive_at);
			const startAt = new Date(trip.start_at);
			const timeDiff = now.getTime() - arriveAt.getTime();

			let data: { progress: number; timeRemain: number };

			if (timeDiff < 0) {
				// on the way
				const progress =
					(now.getTime() - startAt.getTime()) / (arriveAt.getTime() - startAt.getTime());
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
			tripStatus = data;
		},

		get chats() {
			return chats;
		},
		get chat() {
			return chat;
		},
		get chat_id() {
			return chat_id;
		},
		get regions() {
			return regions;
		},
		get wearings() {
			return wearings;
		},
		get wearingTypes() {
			return wearingTypes;
		},
		get ownedWearings() {
			return ownedWearings;
		},
		get equippedWearings() {
			return equippedWearings;
		},
		get trip() {
			return trip;
		},
		get tripStatus() {
			return tripStatus;
		},
		get peopleNearBy() {
			return peopleNearBy;
		},
		get friendChats() {
			return friendChats;
		},
		get strangerChats() {
			return strangerChats;
		},
		set chats(value) {
			chats = value;
		},
		set chat_id(value) {
			chat_id = value;
		},
		set regions(value) {
			regions = value;
		},
		set wearings(value) {
			wearings = value;
		},
		set wearingTypes(value) {
			wearingTypes = value;
		},
		set ownedWearings(value) {
			ownedWearings = value;
		},
		set trip(value) {
			trip = value;
		},
		set tripStatus(value) {
			tripStatus = value;
		},
		set peopleNearBy(value) {
			peopleNearBy = value;
		}
	};
}

const gameState = makeGameState();

gameState.getTripStatus();
setInterval(() => {
	gameState.getTripStatus();
}, 1000);

export { gameState };
