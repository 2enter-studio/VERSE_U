import { json } from '@sveltejs/kit';
import { HAI_AN_KEY } from '$env/static/private';
import { genHaiAnPasscode } from '@repo/shared/utils';

export const GET = async () => {
	const passcode = genHaiAnPasscode(HAI_AN_KEY);
	return json({ passcode });
};
