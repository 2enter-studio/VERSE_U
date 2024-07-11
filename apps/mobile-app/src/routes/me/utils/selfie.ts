import { authState } from '@/states';
import { db } from '@/db';
import { createError } from '@/utils';

async function uploadSelfie(args: { imageUrl: string }) {
	const { imageUrl } = args;

	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const res = await fetch(imageUrl);
	const blob = await res.blob();

	const { error } = await db.storage.from('user_data').upload(`${user_id}/selfie`, blob, {
		upsert: true,
		contentType: 'image/webp',
		cacheControl: '0'
	});
	if (error) {
		console.error(error);
		return { error };
	}
}

export { uploadSelfie };
