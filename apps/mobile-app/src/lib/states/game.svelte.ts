import type { Tables } from '@repo/shared/supatypes';
import { MIN_STAY_TIME } from '@repo/shared/config';

class GameState {
	regions = $state<Region[]>([]);
	trip = $state<Tables<'trips'> | null>(null);
	tripStatus = $state<{ progress: number; timeRemain: number }>({ progress: 0, timeRemain: 0 });
	peopleNearBy = $state<Tables<'profiles'>[]>([]);

	chats = $state<Chatroom[]>([]);
	chat_id = $state<string | null>(null);

	wearings = $state<Wearing[]>([]);
	wearingTypes = $state<WearingType[]>([]);
	ownedWearings = $state<{ id: string; equipped: boolean }[]>([]);

	readonly chat = $derived(this.chats.find((chat) => chat.id === this.chat_id));
	readonly equippedWearings = $derived(this.ownedWearings.filter((wearing) => wearing.equipped));
	readonly strangerChats = $derived(this.chats.filter((c) => c.chat_members.some((m) => !m.agree)));
	readonly friendChats = $derived(this.chats.filter((c) => !this.strangerChats.includes(c)));

	loadTripStatus() {
		const now = new Date();
		if (!this.trip) return;
		const arriveAt = new Date(this.trip.arrive_at);
		const startAt = new Date(this.trip.start_at);
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
		this.tripStatus = data;
	}
}

const gameState = new GameState();

gameState.loadTripStatus();
setInterval(() => {
	gameState.loadTripStatus();
}, 1000);

export { gameState };
