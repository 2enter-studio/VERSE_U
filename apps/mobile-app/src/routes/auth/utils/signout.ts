import { db } from '@/db';

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return { error };
	// clearStore();
	// localStorage.removeItem(`sb-${supaId}-auth-token`);
}

export { signOut };
