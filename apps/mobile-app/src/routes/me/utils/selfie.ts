import { decode } from 'base64-arraybuffer';
import { authState } from '@/states';
import { db } from '@/db';
import { createError } from '@/utils';

// import { handleEFResponse } from '@/utils';

async function uploadSelfie(args: { image: string }) {
	const { image } = args;

	const user_id = authState.user?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { error } = await db.storage.from('user_data').upload(`${user_id}/selfie`, decode(image), {
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
