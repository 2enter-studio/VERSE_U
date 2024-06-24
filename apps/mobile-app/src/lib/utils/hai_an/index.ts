import { createError, handleEFResponse } from '@/utils';
import { db } from '@/db';
import { authState } from '@/states';

async function triggerHaiAn(passcode: string) {
	const user_id = authState.user?.id;
	if (!user_id) return createError('');

	const { data, error } = await db.functions.invoke('hai-an-road', {
		body: JSON.stringify({ passcode })
	});
	await handleEFResponse(error, () => {
		console.error(error);
		// const newStatus = get(tripStatus);
	});
	console.log(data);
}

export { triggerHaiAn };
