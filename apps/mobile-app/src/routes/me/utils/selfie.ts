import { decode } from 'base64-arraybuffer';
import { authState } from '@/states';
import { db } from '@/db';

// import { handleEFResponse } from '@/utils';

async function uploadSelfie(image: string) {
	const user_id = authState.user?.id;
	if (!user_id) return;

	// const { data, error } = await db.functions.invoke('upload-selfie', {
	// 	body: JSON.stringify({ image: decode(image) })
	// });
	// await handleEFResponse(error, () => {
	// 	console.log(data);
	// });

	const { error } = await db.storage
		.from('user_data')
		.upload(`${user_id}/selfie`, decode(image), { upsert: true, contentType: 'image/webp', cacheControl: 'no-cache' });
	if (error) {
		console.error(error);
		return { error };
	}
}

export { uploadSelfie };
