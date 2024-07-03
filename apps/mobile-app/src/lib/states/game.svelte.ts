import type { Tables } from '@repo/shared/supatypes';
import { MIN_STAY_TIME } from '@repo/shared/config';
import { sysState } from '@/states';

class GameState {
	regions = $state<Region[]>([]);
	trip = $state<Tables<'trips'> | null>(null);
	peopleNearBy = $state<Tables<'profiles'>[]>([]);

	chats = $state<Chatroom[]>([]);
	chat_id = $state<string | null>(null);

	wearings = $state<Wearing[]>([]);
	wearingTypes = $state<WearingType[]>([]);
	owned_wearings = $state<{ id: string; equipped: boolean }[]>([]);

	readonly chat = $derived(this.chats.find((chat) => chat.id === this.chat_id));
	readonly equippedWearings = $derived(this.ownedWearings.filter((wearing) => wearing.equipped));
	readonly strangerChats = $derived(this.chats.filter((c) => c.chat_members.some((m) => !m.agree)));
	readonly friendChats = $derived(this.chats.filter((c) => !this.strangerChats.includes(c)));
	readonly tripStatus = $derived.by(() => {
		const defaultResult = { progress: 0, timeRemain: 0 };
		if (!this.trip) return defaultResult;

		const now = sysState.now;
		const arriveAt = new Date(this.trip.arrive_at);
		const startAt = new Date(this.trip.start_at);
		const timeDiff = now.getTime() - arriveAt.getTime();

		let result: { progress: number; timeRemain: number };

		if (timeDiff < 0) {
			// on the way
			const progress =
				(now.getTime() - startAt.getTime()) / (arriveAt.getTime() - startAt.getTime());
			result = { timeRemain: -timeDiff, progress };
		} else if (timeDiff >= MIN_STAY_TIME) {
			// ready to go
			result = { timeRemain: 0, progress: 1 };
		} else if (timeDiff >= 0) {
			// arrived
			const timeRemain = MIN_STAY_TIME - timeDiff;
			result = { timeRemain, progress: 1 };
		} else {
			return defaultResult;
		}
		return result;
	});
}

const gameState = new GameState();

export { gameState };
