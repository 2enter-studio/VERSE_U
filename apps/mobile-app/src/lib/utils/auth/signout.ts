import { db } from '@/db';
// import { PUBLIC_SUPA_PROJ_ID as supaId } from '$env/static/public';
import { session, profile } from '@/stores/auth';

function clearStore() {
	session.set(null);
	profile.set(null);
}

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return { error };
	// clearStore();
	// localStorage.removeItem(`sb-${supaId}-auth-token`);
}

export { signOut, clearStore };
