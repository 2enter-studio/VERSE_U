import { db } from '@/db';
import { authState } from '@/states';
import { createError } from '@/utils';

async function updateActiveStatus() {
	const currentUser = authState.user;
	const user_id = currentUser?.id;
	if (!user_id) return createError('USER_NOT_FOUND');

	const { error } = await db.rpc('update_last_active');

	if (error) return createError('OPERATION_FAILED');
}

export { updateActiveStatus };
