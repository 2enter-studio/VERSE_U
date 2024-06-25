import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createError, load } from '@/utils';

import { db } from '@/db';
import type { Tables } from '@repo/shared/supatypes';

class AuthState {
	profile = $state<Tables<'profiles'> | null>(null);
	session = $state<Session | null>(null);

	readonly user = $derived(this.session?.user ?? null);
	readonly loggedIn = $derived(!!this.session?.user);

	async set(inputSession?: Session | null) {
		// Get session from store or input
		let s = inputSession || this.session;

		// If no session found, check local storage
		if (!s) {
			console.log('no session found in store, checking local storage');
			// Use supabase built-in method to get session from local storage
			const { data, error } = await db.auth.getSession();
			if (error) return { error };
			s = data.session;
		}

		// If session found, set it to store
		this.session = s;

		// Get auth id via session
		const user_id = this.session?.user?.id;
		if (!user_id) return createError('no user found');

		// Use this syntax to prevent issue caused by await call
		// https://supabase.com/docs/reference/javascript/auth-onauthstatechange
		setTimeout(async () => {
			// Get the auth profile by auth id
			await load.profile(user_id);
		}, 0);
	}
	clear() {
		this.session = null;
		this.profile = null;
	}
}

// Update session & profile when auth state changed (sign in/out, etc.)
db.auth.onAuthStateChange(async (e: AuthChangeEvent, s) => {
	// (e, s) --> (event, session)
	console.log(`auth state: ${e}`);

	switch (e) {
		// e:  'INITIAL_SESSION' | 'PASSWORD_RECOVERY' | 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | "MFA_CHALLENGE_VERIFIED"
		case 'SIGNED_OUT':
			authState.clear();
			break;
		case 'SIGNED_IN':
			await authState.set(s);
			break;
	}
});

const authState = new AuthState();

export { authState };
