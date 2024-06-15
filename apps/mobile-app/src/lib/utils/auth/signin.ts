import { db } from '@/db';
import type { OAuthProvider } from '@/config';
import { platform } from '@/stores';
import validate from '@/utils/validate';
import { createError } from '@/utils/error';
import { get } from 'svelte/store';
import { page } from '$app/stores';

async function providerSignIn(provider: OAuthProvider) {
	const options = { redirectTo: get(platform) === 'web' ? get(page).url.origin : 'verseuapp://' };
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
