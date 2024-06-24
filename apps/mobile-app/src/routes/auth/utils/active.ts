import { db } from '@/db';
import { authState } from '@/states';
import { createError } from '@/utils';

async function updateActiveStatus() {
	const currentUser = authState.user;
	const user_id = currentUser?.id;
	if (!user_id) return createError('no auth found');

	const { error } = await db.rpc('update_last_active');

	if (error) return createError('failed to update active status');
}

export { updateActiveStatus };
