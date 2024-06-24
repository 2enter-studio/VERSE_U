import { db } from '@/db';
import type { OAuthProvider } from '@/config';
import { general } from '@/states';
import { createError, validate } from '@/utils';
import { get } from 'svelte/store';
import { page } from '$app/stores';

async function providerSignIn(provider: OAuthProvider) {
	const options = {
		redirectTo: general.platform === 'web' ? get(page).url.origin : 'verseuapp://'
	};
	const { error } = await db.auth.signInWithOAuth({ provider, options });
	if (error) return { error };
}

async function pwdSignIn(email: string, password: string) {
	if (!validate.email(email)) return createError('invalid email');
	if (!validate.password(password)) return createError('invalid password');

	const { error } = await db.auth.signInWithPassword({ email, password });
	if (error) return { error };
}

export { providerSignIn, pwdSignIn };
