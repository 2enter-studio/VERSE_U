import { db } from '@/db';
import { authState } from '@/states';

function clearStore() {
	authState.clear();
}

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return { error };
	// clearStore();
	// localStorage.removeItem(`sb-${supaId}-auth-token`);
}

export { signOut, clearStore };
