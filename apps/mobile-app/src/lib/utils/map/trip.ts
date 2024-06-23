import { db } from '@/db';
import { gameState } from '@/states';
import { handleEFResponse } from '@/utils/error';

async function startNextTrip(option: 0 | 1) {
	const { data, error } = await db.functions.invoke('set-trip', {
		body: JSON.stringify({ option })
	});
	await handleEFResponse(error, () => {
		console.log(data);
		gameState.trip = data.nextTrip;
		gameState.tripStatus.progress = 0;
		gameState.peopleNearBy = [];
	});
}

export { startNextTrip };
