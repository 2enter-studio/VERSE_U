import { get } from 'svelte/store';

import { db } from '@/db';
import { user } from '@/stores/auth';
import { createError } from '@/utils/error';

async function updateActiveStatus() {
	const currentUser = get(user);
	const user_id = currentUser?.id;
	if (!user_id) return createError('no auth found');

	const { error } = await db.rpc('update_last_active');

	if (error) return createError('failed to update active status');
}

export { updateActiveStatus };
