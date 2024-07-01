import { db } from '@/db';
import { createError } from '@/utils';

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return createError('OPERATION_FAILED');
}

export { signOut };
