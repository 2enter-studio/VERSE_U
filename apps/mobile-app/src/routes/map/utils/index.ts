import { db } from '@/db';
import { handleEFResponse } from '@/utils';
import { gameState } from '@/states';

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
