import { db } from '@/db';
import { createError } from '@/utils';
import { sysState } from '@/states';

async function signOut() {
	const { error } = await db.auth.signOut();
	if (error) return createError('OPERATION_FAILED');
	sysState.routeTo('account');
}

export { signOut };
