// import { updateActiveStatus } from '@/utils/auth';
import type { Load } from '@sveltejs/kit';
import { authState } from '@/states';
import { load as loadData, redirectTo } from '@/utils';

export const prerender = true;
export const ssr = false;

export const load: Load = async () => {
	await loadData.appVersion();
	await loadData.maintenance();

	if (!authState.loggedIn) {
		await authState.set();
		// console.log(authState.loggedIn ? 'logged in' : 'not logged in');
		if (!authState.loggedIn) {
			redirectTo('/auth/account');
		}
		// redirect(302, '/');
	}
	// const result = await updateActiveStatus();
	// if (result?.error) console.error(result.error);
	return {};
};
