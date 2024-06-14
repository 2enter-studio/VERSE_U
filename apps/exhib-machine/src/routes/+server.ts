import { json } from '@sveltejs/kit';
import { metadata } from '@/server/state';

export const GET = async () => {
	return json(metadata);
};
