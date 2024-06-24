import { db } from '@/db';
import { pwdSignIn } from '@/utils/auth/signin';

import { createError, validate } from '@/utils';

async function signUp(email: string, password: string) {
	if (!validate.email(email)) return createError('invalid email');
	if (!validate.password(password)) return createError('invalid password');

	const { error } = await db.auth.signUp({ email, password });
	if (error) return { error };
	{
		const res = await pwdSignIn(email, password);
		if (res?.error) {
			return res;
		}
	}
}

export { signUp };
