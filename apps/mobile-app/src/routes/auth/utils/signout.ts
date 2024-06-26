import { db } from '@/db';
import { createError, redirectTo } from '@/utils';

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return createError('OPERATION_FAILED');
	redirectTo('/auth/account');
}

export { signOut };
