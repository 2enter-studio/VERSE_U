import { createError, handleEFResponse } from '@/utils/error';
import { get } from 'svelte/store';
import { db } from '@/db';
import { user } from '@/stores';

async function triggerHaiAn(passcode: string) {
	const user_id = get(user)?.id;
	if (!user_id) return createError('');

	const { data, error } = await db.functions.invoke('hai-an-road', { body: JSON.stringify({ passcode }) });
	await handleEFResponse(error, () => {
		console.error(error);
		// const newStatus = get(tripStatus);
	});
	console.log(data);
}

export { triggerHaiAn };
