import { get } from 'svelte/store';
import { page } from '$app/stores';

import type { OAuthProvider } from '@/config';
import { authState, sysState } from '@/states';
import { createError, validate } from '@/utils';
import * as authApi from '@/api/auth';
import { goto } from '$app/navigation';

async function providerSignIn(provider: OAuthProvider) {
	const options = {
		redirectTo: sysState.platform === 'web' ? get(page).url.origin : 'verseuapp://'
	};

	const { error } = await authApi.signInWithOAuth(provider, options);

	if (error) {
		return createError('SIGNIN_FAILED');
	}
}

async function pwdSignIn(email: string, password: string) {
	if (!validate.email(email) || !validate.password(password)) {
		// sysState.defaultError('INVALID_EMAIL_OR_PASSWORD');
		return createError('INVALID_EMAIL_OR_PASSWORD');
	}

	const resp = await authApi.login(email, password);
	authState.set(resp.session);
	console.log('resp', resp);
	goto('/');
	// await new Promise(resolve => setTimeout(resolve, 5 * 1000));
}

export { providerSignIn, pwdSignIn };