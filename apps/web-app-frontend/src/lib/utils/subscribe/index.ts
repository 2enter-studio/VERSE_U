import { getCurrentYearMonth, load, Subscription } from '@/utils';
import { authState, gameState } from '@/states';

function chat_members() {
	const user_id = authState.user?.id;
	if (!user_id) return null;

	return new Subscription({
		tableName: 'chat_members' as const,
		filter: `user=neq.${user_id}`,
		callback: async (payload) => {
			const { chat } = payload.new;
			await load.chats([chat]);
		}
	});
}

function chat_messages() {
	const user_id = authState.user?.id;
	if (!user_id) return null;

	return new Subscription({
		tableName: `chat_messages_${getCurrentYearMonth()}` as 'chat_messages',
		filter: `sender=neq.${user_id}`,
		event: 'INSERT',
		callback: async (payload) => {
			const newMessage = payload.new;
			const chat_id = newMessage.chat;
			if (!gameState.chats.some((c) => c.id === chat_id)) {
				await load.chats([chat_id]);
			}
			gameState.chats.find((chat) => chat.id === chat_id)?.chat_messages.push(newMessage);
		}
	});
}

function newTrip() {
	const user_id = authState.user?.id;
	if (!user_id) return null;

	return new Subscription({
		tableName: 'trips',
		channelName: `trip-${user_id}`,
		filter: `user=eq.${user_id}`,
		callback: async (payload) => {
			console.log('new trip: ', payload.new);
			gameState.trip = payload.new;
		}
	});
}

function leaver() {
	const region_id = gameState.trip?.to;
	if (!region_id) return null;
	return new Subscription({
		tableName: 'trips',
		channelName: `tripper-${region_id}`,
		filter: `from=eq.${region_id}`,
		callback: async (payload) => {
			const userLeave = payload.new.user;
			console.log('User is leaving: ', userLeave);
			if (!gameState.peopleNearBy) return;
			gameState.peopleNearBy = gameState.peopleNearBy.filter((person) => person.user !== userLeave);
		}
	});
}

function owned_wearings() {
	const user_id = authState.user?.id;
	if (!user_id) return null;

	return new Subscription({
		tableName: 'owned_wearings',
		channelName: `owned_wearings_${user_id}`,
		filter: `owner=eq.${user_id}`,
		callback: async (payload) => {
			gameState.owned_wearings.push({
				equipped: payload.new.equipped,
				id: payload.new.wearing
			});
		}
	});
}

export { chat_messages, chat_members, newTrip, leaver, owned_wearings };
