import { createError, validate } from '@/utils';

import { pwdSignIn } from '$routes/auth/utils';
import * as authApi from '@/api/auth';

async function signUp(email: string, password: string, anon_key: string) {
	if (!validate.email(email) || !validate.password(password)) {
		return createError('INVALID_EMAIL_OR_PASSWORD');
	}

	const { error } = await authApi.register(email, password, anon_key);

	if (error) return createError('SIGN_UP_FAILED'); 
	if (anon_key) {
		window.open('https://apps.apple.com/tw/app/verse-u/id6502902450', '_blank');
	}

	await pwdSignIn(email, password);
}

export { signUp };
