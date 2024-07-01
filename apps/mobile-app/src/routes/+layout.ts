// import { updateActiveStatus } from '@/utils/auth';
import type { Load } from '@sveltejs/kit';
import { authState } from '@/states';

export const prerender = true;
export const ssr = false;

export const load: Load = async () => {
	if (!authState.loggedIn) {
		await authState.set();
	}
	// const result = await updateActiveStatus();
	// if (result?.error) console.error(result.error);
	return {};
};
