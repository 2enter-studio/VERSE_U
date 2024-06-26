import { db } from '@/db';
import { createError, validate } from '@/utils';

import { pwdSignIn } from '$routes/auth/utils';

async function signUp(email: string, password: string) {
	if (!validate.email(email) || !validate.password(password)) {
		return createError('INVALID_EMAIL_OR_PASSWORD');
	}

	const { error } = await db.auth.signUp({ email, password });

	if (error) return createError('SIGN_UP_FAILED');

	await pwdSignIn(email, password);
}

export { signUp };
