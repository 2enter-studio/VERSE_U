import type { BucketName } from '@/config';
import { db } from '@/db';

async function downloadImage(bucket: BucketName, filename: string) {
	const { data, error } = await db.storage.from(bucket).download(filename);
	if (error) return { error };
	return data;
}

function getFileUrl(bucket: BucketName, filename: string) {
	return db.storage.from(bucket).getPublicUrl(filename);
}

export { downloadImage, getFileUrl };
