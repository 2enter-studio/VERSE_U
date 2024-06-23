import { db } from '@/db';
import { auth } from '@/states';

function clearStore() {
	auth.clear();
}

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return { error };
	// clearStore();
	// localStorage.removeItem(`sb-${supaId}-auth-token`);
}

export { signOut, clearStore };
