import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { clearStore } from '@/utils/auth/signout';
import { createError } from '@/utils/error';

import { db } from '@/db';
import { loadProfile } from '@/utils/auth/profile';
import type { Tables } from '@repo/config/supatypes';

function createAuth() {
	let profile = $state<Tables<'profiles'> | null>(null);
	let session = $state<Session | null>(null);
	const user = $derived(session?.user ?? null);
	const loggedIn = $derived(!!session?.user);

	return {
		get profile() {
			return profile;
		},
		get session() {
			return session;
		},
		get user() {
			return user;
		},
		get loggedIn() {
			return loggedIn;
		},
		set session(value) {
			session = value;
		},
		set profile(value) {
			profile = value;
		},
		async set(inputSession?: Session | null) {
			// Get session from store or input
			let s = inputSession || session;

			// If no session found, check local storage
			if (!s) {
				console.log('no session found in store, checking local storage');
				// Use supabase built-in method to get session from local storage
				const { data, error } = await db.auth.getSession();
				if (error) return { error };
				s = data.session;
			}

			// If session found, set it to store
			session = s;

			// Get auth id via session
			const user_id = session?.user?.id;
			if (!user_id) return createError('no user found');

			// Use this syntax to prevent issue caused by await call
			// https://supabase.com/docs/reference/javascript/auth-onauthstatechange
			setTimeout(async () => {
				// Get the auth profile by auth id
				await loadProfile(user_id);
			}, 0);
		},
		clear() {
			session = null;
			profile = null;
		}
	};
}

// Update session & profile when auth state changed (sign in/out, etc.)
db.auth.onAuthStateChange(async (e: AuthChangeEvent, s) => {
	// (e, s) --> (event, session)
	console.log(`auth state: ${e}`);

	switch (e) {
		// e:  'INITIAL_SESSION' | 'PASSWORD_RECOVERY' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | "MFA_CHALLENGE_VERIFIED"
		case 'SIGNED_OUT':
			clearStore();
			break;
		case 'SIGNED_IN':
			await auth.set(s);
			break;
	}
});

const auth = createAuth();

export { auth };
