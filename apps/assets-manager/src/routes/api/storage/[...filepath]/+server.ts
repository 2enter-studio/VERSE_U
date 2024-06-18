import { admin } from '@repo/utils/db';
import { error as serverError } from '@sveltejs/kit';
import type { BucketName } from '@/config';

export const GET = async ({ params }) => {
	const { filepath } = params;
	const bucket = filepath.split('/')[0] as BucketName;
	const filename = filepath.split(bucket)[1];

	const { data, error } = await admin.storage.from(bucket).download(filename);
	if (error) {
		serverError(404, 'failed to get file');
	}
	return new Response(data);
};
