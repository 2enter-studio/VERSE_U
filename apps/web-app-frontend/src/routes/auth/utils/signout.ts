import { createError } from '@/utils';
import { sysState, authState } from '@/states';
import * as authApi from '@/api/auth';
async function signOut() {
	const { error } = await authApi.logout();
	if (error) return createError('OPERATION_FAILED');
	authState.clear();
	sysState.routeTo('account');
}

export { signOut };
