import { writable, derived, get } from 'svelte/store';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { clearStore } from '@/utils/auth/signout';
import { createError } from '@/utils/error';

import { db } from '@/db';
import { loadProfile } from '@/utils/auth/profile';
import type { Tables } from '@repo/supabase';

const profile = writable<Tables<'profiles'> | null>(null);
const session = writable<Session | null>(null);

const user = derived(session, ($session) => $session?.user ?? null);
const loggedIn = derived(session, ($session) => !!$session?.user);

// Update session & profile when auth state changed (sign in/out, etc.)
db.auth.onAuthStateChange(async (e: AuthChangeEvent, s) => {
	// (e, s) --> (event, session)
	console.log(`auth state: ${e}`);

	switch (e) {
		case 'SIGNED_OUT':
			clearStore();
			break;
		case 'SIGNED_IN':
			await setAuth(s);
			break;
	}
});

async function setAuth(inputSession?: Session | null) {
	// Get session from store or input
	let s = inputSession || get(session);

	// If no session found, check local storage
	if (!s) {
		console.log('no session found in store, checking local storage');
		// Use supabase built-in method to get session from local storage
		const { data, error } = await db.auth.getSession();
		if (error) return { error };
		s = data.session;
	}

	// If session found, set it to store
	session.set(s);

	// Get auth id via session
	const user_id = get(session)?.user?.id;
	if (!user_id) return createError('no user found');

	// Use this syntax to prevent issue caused by await call
	// https://supabase.com/docs/reference/javascript/auth-onauthstatechange
	setTimeout(async () => {
		// Get the auth profile by auth id
		await loadProfile(user_id);
	}, 0);
}

export { session, user, profile, loggedIn, setAuth };
