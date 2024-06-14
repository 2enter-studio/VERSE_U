import { json } from '@sveltejs/kit';
import sha256 from 'sha256';
import moment from 'moment';
import { PASSCODE_KEY } from '$env/static/private';

export const GET = async () => {
	const now = moment().utc().format('YYYY-MM-DD HH');
	const passcode = sha256(now + PASSCODE_KEY)
		.slice(0, 5)
		.toUpperCase();

	return json({ passcode });
};
