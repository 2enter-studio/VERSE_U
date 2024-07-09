import { HAI_AN_KEY } from '$env/static/private';
import { genHaiAnPasscode } from '@repo/shared/utils';

export const load = async () => {
	const passcode = genHaiAnPasscode(HAI_AN_KEY);
	return { passcode };
};
