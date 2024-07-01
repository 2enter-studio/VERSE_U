import { get } from 'svelte/store';
import { page } from '$app/stores';

import { db } from '@/db';
import type { OAuthProvider } from '@/config';
import { sysState } from '@/states';
import { createError, validate } from '@/utils';

async function providerSignIn(provider: OAuthProvider) {
	const options = {
		redirectTo: sysState.platform === 'web' ? get(page).url.origin : 'verseuapp://'
	};

	const { error } = await db.auth.signInWithOAuth({ provider, options });

	if (error) {
		return createError('SIGNIN_FAILED');
	}
}

async function pwdSignIn(email: string, password: string) {
	if (!validate.email(email) || !validate.password(password)) {
		// sysState.defaultError('INVALID_EMAIL_OR_PASSWORD');
		return createError('INVALID_EMAIL_OR_PASSWORD');
	}

	const { error } = await db.auth.signInWithPassword({ email, password });
	if (error) {
		console.error(error);
		return createError('SIGNIN_FAILED');
	}
	window.location.reload();
	// await new Promise(resolve => setTimeout(resolve, 5 * 1000));
}

export { providerSignIn, pwdSignIn };
