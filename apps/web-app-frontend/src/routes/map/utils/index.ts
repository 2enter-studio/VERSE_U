import { handleEFResponse } from '@/utils';
import { gameState } from '@/states';
// import { clearExpiredChats } from '$routes/social/utils';

async function startNextTrip(option: 0 | 1) {
	const { data, error } = await profileApi.setTrip({ option });

	await handleEFResponse(error, async () => {
		console.log(data);
		// await clearExpiredChats();
		gameState.trip = data.nextTrip;
		gameState.tripStatus.progress = 0;
		gameState.peopleNearBy = [];
	});
}

export { startNextTrip };
